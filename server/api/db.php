<?php

class DBException extends RuntimeException {
    function __construct($statement, $errorMessage, $errNo) {
        $this->statement = $statement;
        $this->errorMessage = $errorMessage;
        $this->errNo = $errNo;
    }
}

class DB {

    private static $singleton = null;
    private $conn = null;
    private $statements = [];

    private function __construct($servername, $username, $password) {
        $this->conn = new mysqli($servername, $username, $password);

        // Check connection
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    static function start($servername, $username, $password, $db) {
        self::$singleton = new DB($servername, $username, $password);
        self::$singleton->conn->select_db($db);
    }

    static function instance() {
        if (!self::$singleton) die ("DB not initialized");
        return self::$singleton;
    }

    private function prepare_statement ($name, $statement) {
        if (!isset($this->statements[$name])) {
            $stmt = $this->conn->prepare($statement);
            if (!$stmt)
                die("Cannot create statement [".$statement."]: ".$this->conn->error);
            $this->statements[$name] = $stmt;
        }
        return $this->statements[$name];
    }

    private function fetch_single ($stmt) {
        if (!$stmt->execute()) 
            return false;

        if (!($res = $stmt->get_result())) {
            return false;
        }

        if ($res->num_rows == 0)
            return false;
        
        if ($res->num_rows > 1)
            return false;

        $row = $res->fetch_assoc();
        $res->close();

        return $row;
    }

    private function fetch_all($stmt) {
        if (!$stmt->execute()) {
            throw new Exception ($stmt->error);
        }

        if (!($res = $stmt->get_result())) {
            throw new Exception ($stmt->error);
        }

        $result = [];

        while ($row = $res->fetch_assoc()) {
            $result[] = $row;
        } 

        $res->close();
        
        return $result;       
    }

    function login($username, $password) {
        $stmt = $this->prepare_statement ('login',
        'select matricola, tipo, impiegato.nome, cognome, punto_vendita, punto_vendita.nome as nome_punto_vendita
        from impiegato 
        join punto_vendita on punto_vendita.id = impiegato.punto_vendita
        where login=? and password =?
        '
        );
        $stmt->bind_param('ss',$username, $password);

        return $this->fetch_single($stmt);
    }

    function selezionaPuntoVendita($id) {
        $stmt = $this->prepare_statement ('selezionaPuntoVendita',
        'select nome, citta, indirizzo, cap '.
        'from punto_vendita '. 
        'where id=?'
        );
        $stmt->bind_param('i',$id);

        return $this->fetch_single($stmt);
    }

    function selezionaClientiPerNome($parteNome, $parteCognome) {
        $nomeLike = '%'.$parteNome.'%';
        $cognomeLike = '%'.$parteCognome.'%';
        $stmt = $this->prepare_statement ('selezionaClientePerNome',
        'select cod_fiscale, nome, cognome, data_nascita, indirizzo, cap, citta, telefono_abitazione, telefono_cellulare, email, data_sottoscrizione, posizione_archivio
        from cliente 
        left join documento_liberatoria on cliente.documento_liberatoria = documento_liberatoria.id
        where nome like ? and cognome like ?
        '
        );
        $stmt->bind_param('ss',$nomeLike, $cognomeLike);

        return $this->fetch_all($stmt);
    }

    function selezionaClientePerCodFiscale($cod_fiscale) {
        $stmt = $this->prepare_statement ('selezionaClienteCodFiscale',
        'select cod_fiscale, nome, cognome, data_nascita, indirizzo, citta, cap, telefono_abitazione, telefono_cellulare, email, documento_liberatoria, data_sottoscrizione, posizione_archivio
        from cliente 
        left join documento_liberatoria on cliente.documento_liberatoria = documento_liberatoria.id
        where cod_fiscale=?
        '
        );
        $stmt->bind_param('s',$cod_fiscale);
        return $this->fetch_single($stmt);
    }

    function inserisciCliente($cliente) {
        $stmt = $this->prepare_statement ('inserisciCliente',
        'insert into cliente (cod_fiscale, nome, cognome, data_nascita, indirizzo, citta, cap, telefono_abitazione, telefono_cellulare, email)
        values (?,?,?,str_to_date(?,\'%Y-%m-%d\'),?,?,?,?,?,?)');
        $stmt->bind_param('ssssssssss',$cliente->cod_fiscale, $cliente->nome, $cliente->cognome, $cliente->data_nascita, $cliente->indirizzo, $cliente->citta, $cliente->cap, $cliente->telefono_abitazione, $cliente->telefono_cellulare, $cliente->email);
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        return true;
    }

    function inserisciPrenotazione($punto_vendita, $cod_fiscale,$video) {
        $stmt = $this->prepare_statement ('inserisciPrenotazione_check',
        'select tipo 
        from video 
        where id=?'
        );
        $stmt->bind_param('s',$video);
        $tipo = $this->fetch_single($stmt)['tipo'];

        if(!$tipo) {
            throw new Exception("Video non a catalogo");
        }

        if ($tipo == 'DISPONIBILE') {
            throw new Exception("Prenotazione non effettuata: il video è già disponibile");
        }
        
        $stmt = $this->prepare_statement ('inserisciPrenotazione',
        'insert into prenotazione (cliente, punto_vendita, video)
        values (?,?,?)');
        $stmt->bind_param('sis',$cod_fiscale, $punto_vendita, $video);
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        return true;
    }

    function listaVideoPrenotati($punto_vendita, $cod_fiscale) {
        $stmt = $this->prepare_statement ('listaVideoPrenotati',
        'select id, genere, tipo, titolo, regista, casa_produttrice, data_disponibilita, ifnull(quantita_disponibile,0) as quantita_disponibile
        from prenotazione
        join video on id = prenotazione.video
        join catalogo on catalogo.video = prenotazione.video and catalogo.punto_vendita = prenotazione.punto_vendita
        where prenotazione.punto_vendita = ?
        and prenotazione.cliente = ?
        group by id
        ');
        $stmt->bind_param('ss',$punto_vendita, $cod_fiscale);
        return $this->fetch_all($stmt);
    }

    function inserisciDocumentoLiberatoria($cod_fiscale, $documento) {
        $this->conn->begin_transaction();
        try {
            $stmt = $this->prepare_statement ('inserisciDocumento',
            'insert into documento_liberatoria (id, data_sottoscrizione, posizione_archivio)
            values (?,str_to_date(?,\'%Y-%m-%d\'),?)');
            $stmt->bind_param('sss',$documento->id, $documento->data_sottoscrizione, $documento->posizione_archivio);        
            if (!$stmt->execute()) {
                throw new Exception($stmt->error);
            }

            $updateCli = $this->prepare_statement ('inserisciDocumentoUpdateCli',
            'update cliente set documento_liberatoria=? where cod_fiscale=?');
            $updateCli->bind_param('ss',$documento->id, $cod_fiscale);
            if (!$updateCli->execute()) {
                throw new Exception($updateCli->error);
            }
         } catch(Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
        $this->conn->commit();
    }

    function ricercaCatalogoPerGenere($punto_vendita,$genere, $tipo, $pagina, $size) {
        $stmt = $this->prepare_statement ('selezionaClientePerNome',
        'select id, genere, tipo, titolo, regista, casa_produttrice, data_disponibilita, ifnull(quantita_disponibile,0) as quantita_disponibile
        from video 
        left join catalogo on catalogo.video = video.id and catalogo.punto_vendita = ?
        where video.genere = ? 
        and tipo = ?
        order by id
        limit ?,?'
        );
        $start = $pagina * $size;
        $stmt->bind_param("issii",$punto_vendita, $genere,  $tipo, $start, $size);
        return $this->fetch_all($stmt);
    }

    function selezionaNoleggiAttiviPerCliente($cod_fiscale, $punto_vendita) {
        $stmt = $this->prepare_statement ('selezionaNoleggiAttiviPerCliente',
        'select id,supporto,cliente,impiegato_creazione,data_inizio, termine_noleggio, video, titolo
        from v_contratto_noleggio_attivo 
        where cliente = ?
        and punto_vendita=?
        ');
        $stmt->bind_param("sd",$cod_fiscale, $punto_vendita);
        return $this->fetch_all($stmt);
;
    }

    function selezionaNoleggiTerminatiPerCliente($cod_fiscale, $punto_vendita) {
        $stmt = $this->prepare_statement ('selezionaNoleggiTerminatiPerCliente',
        'select id,supporto,cliente,impiegato_creazione, impiegato_restituzione, data_inizio, data_restituzione, termine_noleggio, video, titolo, ricevuta
        from v_contratto_noleggio_terminato 
        where cliente = ?
        and punto_vendita=?
        ');
        $stmt->bind_param("sd",$cod_fiscale, $punto_vendita);
        return $this->fetch_all($stmt);
;
    }

    function ricercaCatalogoPerTitolo($punto_vendita,$parteTitolo, $tipo) {
        $titoloLike = '%'.$parteTitolo.'%';
        $stmt = $this->prepare_statement ('selezionaClientePerNome',
        'select id, genere, tipo, titolo, regista, casa_produttrice, data_disponibilita, ifnull(quantita_disponibile,0) as quantita_disponibile
        from video 
        left join catalogo on catalogo.video = video.id and catalogo.punto_vendita = ?
        where MATCH(titolo) AGAINST (? IN NATURAL LANGUAGE MODE) 
        and tipo=?
        '
        );
        $stmt->bind_param("iss", $punto_vendita,$titoloLike,  $tipo);
        return $this->fetch_all($stmt);
    }

    function selectUUID() {
        $fetchUUID = $this->prepare_statement('selectUUID','select uuid() as uuid');
        return $this->fetch_single($fetchUUID)['uuid'];
    }

    function creaBatch($punto_vendita, $impiegato, $data, $tipo) {
        $batchId = $this->selectUUID();
        $insert_batch = $this->prepare_statement('creaBatch',
        'insert into batch 
            (id,tipo, esito, punto_vendita, impiegato, data)
            values(?,?,\'IN-ESECUZIONE\',?,?,str_to_date(?,\'%Y-%m-%d\'))'
        );
        $insert_batch->bind_param("sssss",$batchId, $tipo, $punto_vendita, $impiegato, $data);
        if (!$insert_batch->execute()) {
            throw new Exception($insert_batch->error);
        }
        return $batchId;
    }

    function selezionaBatch($batchId) {
        $select_batch= $this->prepare_statement('selezionaBatch_batch',
        'select tipo, esito, errore, punto_vendita, impiegato, data
         from batch
         where id=?
        ');
        $select_batch->bind_param("s",$batchId);
        $batch=$this->fetch_single($select_batch);

        if ($batch['tipo'] === 'CARICO') {
        $select_supporti= $this->prepare_statement('selezionaBatch_supporti_carico',
        'select supporto.id, seriale, video, fornitore, supporto.punto_vendita,
         batch.data as data_carico, batch.data as data_carico, stato_fisico
         from supporto
         left join batch on batch.id=batch_carico
         where batch_carico=?
        ');
        } else {
            $select_supporti= $this->prepare_statement('selezionaBatch_supporti_scarico',
            'select supporto.id, seriale, video, fornitore, supporto.punto_vendita,
             carico.data as data_carico, scarico.data as data_scarico, stato_fisico
             from supporto
             left join batch as carico on carico.id=batch_carico
             left join batch as scarico on scarico.id=batch_scarico
             where batch_scarico=?
        ');
        }
        $select_supporti->bind_param("s",$batchId);
        $result = new stdClass;
        $result->batch_id=$batchId;
        $result->tipo = $batch['tipo'];
        $result->esito = $batch['esito'];
        if ($result->esito == 'FALLITO') $result->errore = $batch['errore'];
        $result->punto_vendita = $batch['punto_vendita'];
        $result->impiegato = $batch['impiegato'];
        $result->data = $batch['data'];
        $result->supporti = $this->fetch_all($select_supporti);
        return $result;
    }

    function listaBatch($punto_vendita) {
        $select_batch= $this->prepare_statement('listaBatch',
        'select id as batch_id, tipo, esito, errore, punto_vendita, impiegato, data
         from batch
         where punto_vendita=?
        ');
        $select_batch->bind_param("i",$punto_vendita);
        return  $this->fetch_all($select_batch);
    }

    function listaFornitori() {
        $select= $this->prepare_statement('listaFornitori',
        'select id, nome
         from fornitore
         order by nome
        ');
        return  $this->fetch_all($select);
    }

    function listaGeneri() {
        $select= $this->prepare_statement('listaGeneri',
        'select nome, descrizione
         from genere
         order by descrizione
        ');
        return  $this->fetch_all($select);
    }

    function listaTerminiNoleggio() {
        $select= $this->prepare_statement('listaTerminiNoleggio',
        'select giorni, importo_iniziale, importo_gg_successivi
         from termine_noleggio
         order by giorni
        ');
        return  $this->fetch_all($select);
    }

    function aggiornaBatchSuccesso($batchId) {
        $aggiorna_batch = $this->prepare_statement('aggiornaBatchSuccesso',
        'update batch set esito=\'SUCCESSO\' where id = ?'
        );
        $aggiorna_batch->bind_param("s",$batchId);
        if (!$aggiorna_batch->execute()) {
            throw new Exception($aggiorna_batch->error);
        }
        return true;
    }

    function aggiornaBatchErrore($batchId,$errore) {
        $aggiorna_batch = $this->prepare_statement('aggiornaBatchErrore',
        'update batch set esito=\'FALLITO\', errore=? where id=?'
        );
        $aggiorna_batch->bind_param("ss",$errore, $batchId);
        if (!$aggiorna_batch->execute()) {
            throw new Exception($aggiorna_batch->error);
        }
        return true;
    }

    
    /**
     * Carica una lista di supporti via batch.
     * ogni elemento della lista deve essere un oggetto contenente
     * - video: l'ID del video
     * - seriale: il seriale del supporto
     * - costo_supporto: il costo al fornitore del supporto
     */
    function caricaSupportiBatch($punto_vendita, $fornitore, $impiegato, $data, $lista) {
        $batchId = $this->creaBatch($punto_vendita, $impiegato, $data, 'CARICO');
        $this->conn->begin_transaction();
        try {
            $riga=0;
            foreach ($lista as &$el) {
                $riga++;
                //Crea il supporto
                $insert_supporto = $this->prepare_statement('caricaSupportiBatch_1',
                'insert into supporto 
                    (id,seriale, video, fornitore, punto_vendita, costo_supporto, batch_carico)
                    values(uuid(),?,?,?,?,?,?)');
                $insert_supporto->bind_param("sssids",$el->seriale, $el->video, $fornitore, $punto_vendita, $el->costo_supporto, $batchId);
                if (!$insert_supporto->execute()) {
                    throw new Exception("Errore alla riga ".$riga." durante l'inserimento: ".$insert_supporto->error);
                } 

                //Aumenta la disponibilità, creando l'entry a catalogo se non esiste
                $aggiorna_disponibilita = $this->prepare_statement('aggiorna_disponibilita',
                'insert into catalogo (video, punto_vendita,quantita_disponibile) 
                        values (?,?,1)
                 on duplicate key 
                    update quantita_disponibile=quantita_disponibile+1'
                );
                $aggiorna_disponibilita->bind_param('si',$el->video, $punto_vendita);
                if (!$aggiorna_disponibilita->execute()) {
                    throw new Exception("Errore alla riga ".$riga."durante l'aggiornamento delle quantità: ".$aggiorna_disponibilita->error);
                }
            }       
        } catch(Exception $e) {
            $this->conn->rollback();
            $this->aggiornaBatchErrore($batchId, $e->getMessage());
            return $batchId;
        } 
        $this->conn->commit();
        $this->aggiornaBatchSuccesso($batchId);
        return $batchId;
    }

    function scaricaSupportiBatch($punto_vendita, $fornitore, $impiegato, $data) {
        $batchId = $this->creaBatch($punto_vendita, $impiegato, $data, 'SCARICO');
        $this->conn->begin_transaction();
        try {
            //esegue lo scarico dei supporti
            $update_supporto = $this->prepare_statement('scaricaSupportiBatch_updateSupporto',
            'update supporto
             join batch on batch.id=batch_carico
             set
               batch_scarico=?
             where
               datediff( str_to_date(?,\'%Y-%m-%d\'), batch.data) >= 90
               and noleggio_corrente is null
               and batch_scarico is null
               and supporto.punto_vendita=?
               and fornitore=?
            ');

            $update_supporto->bind_param("ssis", $batchId, $data, $punto_vendita, $fornitore);
            if (!$update_supporto->execute()) {
                throw new Exception($update_supporto->error);
            } 

            //aggiorna le disponibilità dopo lo scarico, prendendo il conteggio di
            //tutti i titolo scaricati in buono stato
            $update_disponibilita = $this->prepare_statement('scaricaSupportiBatch_updateDisponibilita',
            'update catalogo
            join 
               (
                 select video, punto_vendita, count(*) as qta_scaricata
                 from supporto
                 where batch_scarico=?
                 and stato_fisico = \'BUONO\'
                 group by video, punto_vendita
               ) scaricati on 
                 catalogo.video = scaricati.video
                 and catalogo.punto_vendita = scaricati.punto_vendita
            set
               quantita_disponibile = quantita_disponibile - qta_scaricata
            ');
            $update_disponibilita->bind_param("s",$batchId);
            if (!$update_disponibilita->execute()) {
                throw new Exception($update_disponibilita->error);
            }

        } catch(Exception $e) {
            $this->conn->rollback();
            $this->aggiornaBatchErrore($batchId, $e->getMessage());
            return $batchId;
        } 
        $this->conn->commit();
        $this->aggiornaBatchSuccesso($batchId);
        return $batchId;
    }

    function listaSupportiPerVideo($punto_vendita, $video) {

        $stmt = $this->prepare_statement ('listaSupportiPerVideo',
        'select id
         from v_supporto_disponibile
         where video=? and punto_vendita=?
        '
        );
        $stmt->bind_param("si",$video, $punto_vendita);
        return $this->fetch_all($stmt);
        
    }

    function attivaNoleggio($supporto, $cod_fiscale, $impiegato, $termine) {

        //Controlla che il cliente abbia un documento di liberatoria associato
        $cliente = $this->selezionaClientePerCodFiscale($cod_fiscale);
        if (!$cliente)
            throw new Exception ("Cliente non trovato");
        if (!isset($cliente['documento_liberatoria'])) 
            throw new Exception ("Il cliente non ha ancora firmato un documento di liberatoria");

        $this->conn->begin_transaction();

        try {
            //Seleziona il supporto for update
            $sel_supporto = $this->prepare_statement('attivaNoleggio_sel_supporto',
            'select supporto.video as video,supporto.punto_vendita as punto_vendita, stato_fisico, noleggio_corrente, quantita_disponibile
            from supporto
            join catalogo 
              on catalogo.video = supporto.video and catalogo.punto_vendita=supporto.punto_vendita
            where 
              id=? 
              and batch_scarico is null 
              and stato_fisico=\'BUONO\' 
              and noleggio_corrente is null 
            for update');
            $sel_supporto->bind_param('s',$supporto);
            $dati_supporto = $this->fetch_single($sel_supporto);
            if (!$dati_supporto) {
                throw new Exception ("Supporto non trovato");
            }

            $id_noleggio = $this->selectUUID();

            $dataInizio= date("Y-m-d");
            
            //Crea una nuova entry di noleggio
            $insert_noleggio = $this->prepare_statement('creaNoleggio',
            'insert into contratto_noleggio
            (id, supporto, cliente, impiegato_creazione, data_inizio, termine_noleggio)
            values (?,?,?,?,str_to_date(?,\'%Y-%m-%d\'),?)'
            );
            $insert_noleggio->bind_param('ssssss',$id_noleggio, $supporto,
            $cod_fiscale, $impiegato, $dataInizio, $termine);
            if (!$insert_noleggio->execute() || $insert_noleggio->affected_rows != 1) {
                throw new Exception($insert_noleggio->error);
            }

            //aggiorna il supporto per inserire l'ID noleggio
            $aggiorna_supporto = $this->prepare_statement('attivaNoleggio_agg_supporto',
            'update supporto set noleggio_corrente = ? where id = ?'
            );
            $aggiorna_supporto->bind_param('ss',$id_noleggio, $supporto);
            if (!$aggiorna_supporto->execute() || $aggiorna_supporto->affected_rows != 1) {
                throw new Exception($aggiorna_supporto->error);
            }

            //diminuisce la disponibilità
            $aggiorna_disp = $this->prepare_statement ('attivaNoleggio_aggiorna_disp',
            'update catalogo set quantita_disponibile = quantita_disponibile-1 where video=? and punto_vendita=?'
            );
            $aggiorna_disp->bind_param('si',$dati_supporto['video'],$dati_supporto['punto_vendita']);
            if(!$aggiorna_disp->execute() || $aggiorna_disp->affected_rows != 1) {
                throw new Exception($aggiorna_disp->error);
            }
            $this->conn->commit();
            return $id_noleggio;
        } catch(Exception $e) {
            $this->conn->rollback();
            throw $e;
        } 

    }

    function terminaNoleggio ($punto_vendita, $impiegato, $noleggio, $stato, $dataFine) {
        if ($stato != 'BUONO' && $stato != 'DANNEGGIATO')
            throw new Exception ("Stato di restituzione non valido");

        $this->conn->begin_transaction();
        try {
            //Seleziona il noleggio ed il supporto for update
            $sel_noleggio = $this->prepare_statement('terminaNoleggio_selNoleggio',
            'select 
              supporto, data_inizio, termine_noleggio, punto_vendita, video 
            from 
              contratto_noleggio 
            join 
              supporto on supporto.id = contratto_noleggio.supporto
            where 
              contratto_noleggio.id=? 
              and punto_vendita=? 
              and data_restituzione is null 
            for update');
            $sel_noleggio->bind_param('si',$noleggio,$punto_vendita);
            $dati_noleggio = $this->fetch_single($sel_noleggio);
            if (!$dati_noleggio) {
                throw new Exception ("Noleggio non trovato o già terminato");
            }

            $supporto = $dati_noleggio['supporto'];

            //Libera il supporto dal vincolo del noleggio
            $upd_supporto = $this->prepare_statement('terminaNoleggio_updateSupporto',
            'update supporto set noleggio_corrente=null, stato_fisico=? where id=?');
            $upd_supporto->bind_param('ss',$stato, $supporto);
            if (!$upd_supporto->execute()) {
                throw newException ($upd_supporto->error);
            }

            //aggiorna il noleggio
            $upd_noleggio = $this->prepare_statement('terminaNoleggio_updateNoleggio',
            'update contratto_noleggio 
             set 
                data_restituzione=str_to_date(?,\'%Y-%m-%d\'),
                stato_restituzione=?,
                impiegato_restituzione=?
             where 
                id=?
            ');
            $upd_noleggio->bind_param('ssss',$dataFine, $stato, $impiegato, $noleggio);
            if (!$upd_noleggio->execute()) {
                throw newException ($upd_supporto->error);
            }

            //aumenta la disponibilità se lo stato del supporto è buono
            if ($stato == 'BUONO') {
                $video = $dati_noleggio['video'];
                $punto_vendita = $dati_noleggio=['punto_vendita'];
                $aggiorna_disp = $this->prepare_statement ('terminaNoleggio_aggiorna_disp',
                'update catalogo 
                 set 
                   quantita_disponibile = quantita_disponibile+1 
                 where 
                   video=? and punto_vendita=?'
                );
                $aggiorna_disp->bind_param('si',$video,$punto_vendita);
                if(!$aggiorna_disp->execute() || $aggiorna_disp->affected_rows != 1) {
                    throw new Exception($aggiorna_disp->error);
                }
            }

            //crea una ricevuta implicitamente
            $risposta = new stdClass;
            $risposta->id_ricevuta = $this->creaRicevuta ($punto_vendita, $impiegato, $noleggio, $dataFine);
            $this->conn->commit();
            return $risposta;
        } catch(Exception $e) {
            $this->conn->rollback();
            throw $e;
        } 
    }

    function selezionaRicevuta ($ricevuta) {
        $sel_ricevuta = $this->prepare_statement('selezionaRicevuta',
        'select numero_ricevuta, data, supporto, titolo, cliente, nome, cognome, indirizzo, citta, cap, impiegato_nome, impiegato_cognome, matricola, data_inizio, data_restituzione, totale
        from v_ricevuta
        where numero_ricevuta=?');
        $sel_ricevuta->bind_param('s',$ricevuta);
        $dati_ricevuta = $this->fetch_single($sel_ricevuta);
        if (!$dati_ricevuta) {
            throw new Exception ("Supporto non trovato");
        }

        $sel_dettagli = $this->prepare_statement('selezionaRicevuta_dettagli',
        'select descrizione, costo
        from voce_ricevuta
        where ricevuta=? order by ordine');
        $sel_dettagli->bind_param('s',$ricevuta);
        $dati_ricevuta['dettagli'] = $this->fetch_all($sel_dettagli);

        return $dati_ricevuta;
    }

    private function insertRicevuta($impiegato, $noleggio, $data) {
        $idRicevuta = $this->selectUUID();
        $stmt_ricevuta = $this->prepare_statement('insertRicevuta',
        'insert into ricevuta (numero_ricevuta, impiegato, contratto_noleggio, data) 
        values (?,?,?,str_to_date(?,\'%Y-%m-%d\'))
        ');
        $stmt_ricevuta->bind_param('ssss',$idRicevuta, $impiegato, $noleggio, $data);
        if (!$stmt_ricevuta->execute()) {
            throw new Exception ($stmt_ricevuta->error);
        }
        return $idRicevuta;
    } 

    private function insertVoceRicevuta($idRicevuta, $ordine, $descrizione, $costo) {
        $stmt_ricevuta = $this->prepare_statement('insertVoceRicevuta',
        'insert into voce_ricevuta (ricevuta, ordine, descrizione, costo) 
        values (?,?,?,?)
        ');
        $stmt_ricevuta->bind_param('sdsd',$idRicevuta, $ordine, $descrizione, $costo);
        if (!$stmt_ricevuta->execute()) {
            throw newException ($upd_supporto->error);
        }
    }

    function creaRicevuta($punto_vendita, $impiegato, $noleggio, $data) {
        $this->conn->begin_transaction();
        try {
            //Seleziona il noleggio ed il supporto for update
            $sel_noleggio = $this->prepare_statement('creaRicevuta_selNoleggio',
            'select 
                contratto_noleggio.supporto, data_inizio, data_restituzione, stato_restituzione,
                costo_supporto,
                titolo,
                termine_noleggio, importo_iniziale, importo_gg_successivi
            from contratto_noleggio 
            join supporto on supporto.id = contratto_noleggio.supporto
            join video on video.id = supporto.video
            join termine_noleggio on giorni = contratto_noleggio.termine_noleggio
            where 
                contratto_noleggio.id=? 
                and punto_vendita=? 
                and data_restituzione is not null
            ');

            $sel_noleggio->bind_param('si',$noleggio,$punto_vendita);
            $dati_noleggio = $this->fetch_single($sel_noleggio);
            if (!$dati_noleggio) {
                throw new Exception ("Noleggio non trovato o già terminato");
            }

            $supporto = $dati_noleggio['supporto'];
            $termine = $dati_noleggio['termine_noleggio'];
            $titolo = $dati_noleggio['titolo'];
            $stato_restituzione = $dati_noleggio['stato_restituzione'];
            $data_inizio = $dati_noleggio['data_inizio'];
            $data_restituzione = $dati_noleggio['data_restituzione'];
            $costo_supporto = $dati_noleggio['costo_supporto'];
            $importo_iniziale=$dati_noleggio['importo_iniziale'];
            $importo_gg_successivi=$dati_noleggio['importo_gg_successivi'];

            //crea la ricevuta
            $idRicevuta = $this->insertRicevuta($impiegato, $noleggio, $data);
            $ordine = 0;
            
            //calcola l'importo da pagare per il noleggio
            $timestampInizio = DateTime::createFromFormat("Y-m-d", $data_inizio)->getTimestamp();
            $timestampRestituzione =  DateTime::createFromFormat("Y-m-d", $data_restituzione)->getTimestamp();
            $giorni = ceil (($timestampRestituzione-$timestampInizio) / (24*60*60));
            $importo_noleggio = ($giorni <= $termine) 
                ? $importo_iniziale 
                : $importo_iniziale + ($giorni-$termine) * $importo_gg_successivi;

            $this->insertVoceRicevuta($idRicevuta, $ordine++, 'Costo base del noleggio  (primi '.$termine.' gg)', $importo_iniziale);
            if ($giorni > $termine) {
                $this->insertVoceRicevuta($idRicevuta, $ordine++, 'Costo aggiuntivo del noleggio (successivi '.($giorni-$termine).' gg)', ($giorni-$termine) * $importo_gg_successivi);
            }
            if ($stato_restituzione == 'DANNEGGIATO') {
                $this->insertVoceRicevuta($idRicevuta, $ordine++, 'Costo danneggiamento supporto ',$costo_supporto );
            }
            
            $this->conn->commit();

            return $idRicevuta;
        } catch(Exception $e) {
            $this->conn->rollback();
            throw $e;
        } 
    } 

    function statisticaPerDipendenti ($giorno) {

        $select= $this->prepare_statement('statisticaPerDipendenti',
        'select punto_vendita, punto_vendita_nome, matricola, nome, cognome, totale_incasso
        from v_statistica_per_impiegato
        where data is null or data = str_to_date(?,\'%Y-%m-%d\')
        ');
        $select->bind_param("s",$giorno);
        return  $this->fetch_all($select);
    }

    function statisticaPerPuntoVendita($giorno) {
        $select= $this->prepare_statement('statisticaPerDipendenti',
        'select id, nome, citta, indirizzo, cap, totale_incasso, numero_ricevute
        from v_statistica_per_punto_vendita
        where data is null or data = str_to_date(?,\'%Y-%m-%d\')
        ');
        $select->bind_param("s",$giorno);
        return  $this->fetch_all($select);
    }
}
?>