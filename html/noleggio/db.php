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
        'select matricola, tipo, nome, cognome, punto_vendita '.
        'from impiegato '. 
        'where login=? and password =?'
        );
        $stmt->bind_param('ss',$username, $password);

        return $this->fetch_single($stmt);
    }

    function selezionaPuntoVendita($id) {
        $stmt = $this->prepare_statement ('selezionaPuntoVendita',
        'select citta, indirizzo, cap '.
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
        'select cod_fiscale, nome, cognome, telefono_abitazione, telefono_cellulare, email, data_sottoscrizione, posizione_archivio
        from cliente 
        left join documento_liberatoria on cliente.documento_liberatoria = documento_liberatoria.id
        where nome like ? and cognome like ?
        '
        );
        $stmt->bind_param('sd',$nomeLike, $cognomeLike);

        return $this->fetch_all($stmt);
    }

    function selezionaClientePerCodFiscale($cod_fiscale) {
        $stmt = $this->prepare_statement ('selezionaClienteCodFiscale',
        'select cod_fiscale, nome, cognome, telefono_abitazione, telefono_cellulare, email, documento_liberatoria, data_sottoscrizione, posizione_archivio
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
        'insert into cliente (cod_fiscale, nome, cognome, telefono_abitazione, telefono_cellulare, email)
        values (?,?,?,?,?,?)');
        $stmt->bind_param('ssssss',$cliente->cod_fiscale, $cliente->nome, $cliente->cognome, $cliente->telefono_abitazione, $cliente->telefono_cellulare, $cliente->email);
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        return true;
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

    function ricercaCatalogoPerGenere($punto_vendita,$genere) {
        $stmt = $this->prepare_statement ('selezionaClientePerNome',
        'select id, genere, tipo, titolo, regista, casa_produttrice, data_disponibilita, ifnull(quantita_disponibile,0) as quantita_disponibile
        from video 
        left join catalogo on catalogo.video = video.id
        where video.genere = ? 
        and (catalogo.punto_vendita = ? or catalogo.punto_vendita is null)'
        );
        $stmt->bind_param("si",$genere, $punto_vendita);
        return $this->fetch_all($stmt);
    }

    function ricercaCatalogoPerTitolo($punto_vendita,$parteTitolo) {
        $titoloLike = '%'.$parteTitolo.'%';
        $stmt = $this->prepare_statement ('selezionaClientePerNome',
        'select id, genere, tipo, titolo, regista, casa_produttrice, data_disponibilita, ifnull(quantita_disponibile,0) as quantita_disponibile
        from video 
        left join catalogo on catalogo.video = video.id 
        where MATCH(titolo) AGAINST (? IN NATURAL LANGUAGE MODE) 
        and (catalogo.punto_vendita = ? or catalogo.punto_vendita is null)'
        );
        $stmt->bind_param("si",$titoloLike, $punto_vendita);
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

        $select_supporti= $this->prepare_statement('selezionaBatch_supporti',
        'select id, seriale, video, fornitore, punto_vendita,
         data_carico, data_scarico, stato_fisico
         from supporto
         where batch_carico=?
        ');
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
        'select id, tipo, esito, errore, punto_vendita, impiegato, data
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
                    (id,seriale, video, fornitore, punto_vendita, data_carico, data_scarico, disponibile, stato_fisico, costo_supporto, batch_carico)
                    values(uuid(),?,?,?,?,str_to_date(?,\'%Y-%m-%d\'),null,1,\'BUONO\',?,?)');
                $insert_supporto->bind_param("sssisds",$el->seriale, $el->video, $fornitore, $punto_vendita, $data, $el->costo_supporto, $batchId);
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
             set
               data_scarico=str_to_date(?,\'%Y-%m-%d\'),
               batch_scarico=?
             where
               datediff( str_to_date(?,\'%Y-%m-%d\'), data_carico) >= 90
               and noleggio_corrente is null
               and batch_scarico is null
               and punto_vendita=?
               and fornitore=?
            ');

            $update_supporto->bind_param("sssis",$data, $batchId, $data, $punto_vendita, $fornitore);
            if (!$update_supporto->execute()) {
                throw new Exception($update_supporto->error);
            } 

            //aggiorna le disponibilità dopo lo scarico
            $update_disponibilita = $this->prepare_statement('scaricaSupportiBatch_updateDisponibilita',
            'update catalogo
            join 
               (
                 select video, punto_vendita, count(*) as qta_scaricata
                 from supporto
                 where batch_scarico=?
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
         from supporto
         where video=? and punto_vendita=?
         and stato_fisico=\'BUONO\' and noleggio_corrente is null and data_scarico is null'
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
            where id=? and data_scarico is null and stato_fisico=\'BUONO\' and noleggio_corrente is null 
            for update');
            $sel_supporto->bind_param('s',$supporto);
            $dati_supporto = $this->fetch_single($sel_supporto);
            if (!$dati_supporto) {
                throw new Exception ("Supporto non trovato");
            }

            $id_noleggio = $this->selectUUID();

            $dataInizio= date("Y-m-d");
            $dataFine=date("Y-m-d", time()+ $termine *24*60*60);
            
            //Crea una nuova entry di noleggio
            $insert_noleggio = $this->prepare_statement('creaNoleggio',
            'insert into contratto_noleggio
            (id, supporto, cliente, impiegato, data_inizio, data_fine, termine_noleggio)
            values (?,?,?,?,str_to_date(?,\'%Y-%m-%d\'),str_to_date(?,\'%Y-%m-%d\'),?)'
            );
            $insert_noleggio->bind_param('sssssss',$id_noleggio, $supporto,
            $cod_fiscale,$impiegato,$dataInizio, $dataFine, $termine);
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

    function terminaNoleggio ($punto_vendita, $noleggio, $stato, $dataFine) {
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

            //selezione il termine di noleggio
            $termine = $dati_noleggio['termine_noleggio'];
            $sel_termine = $this->prepare_statement('terminaNoleggio_selTermine',
            'select importo_iniziale,importo_gg_successivi from termine_noleggio where giorni=?');
            $sel_termine->bind_param('i',$termine);
            $dati_termine = $this->fetch_single($sel_termine);

            //calcola l'importo da pagare per il noleggio
            $timestampFine =  DateTime::createFromFormat("Y-m-d", $dataFine)->getTimestamp();
            $timestampInizio = DateTime::createFromFormat("Y-m-d", $dati_noleggio['data_inizio'])->getTimestamp();
            $giorni = ceil (($timestampFine-$timestampInizio) / (24*60*60));

            $importo_iniziale=$dati_termine['importo_iniziale'];
            $importo_gg_successivi=$dati_termine['importo_gg_successivi'];
            $importo_noleggio = ($giorni <= $termine) 
                ? $importo_iniziale 
                : $importo_iniziale + ($giorni-$termine) * $importo_gg_successivi;

            
            //calcola l'importo del danno in caso il supporto sia danneggiato
            $importo_danno = 0;
            $supporto = $dati_noleggio['supporto'];
            if ($stato == 'DANNEGGIATO') {
                $sel_supporto = $this->prepare_statement('terminaNoleggio_selSupporto',
                'select costo_supporto from supporto where id=?');
                $sel_supporto->bind_param('s',$supporto);
                $importo_danno = $this->fetch_single($sel_supporto)['costo_supporto'];
            }
            $totale_pagato = $importo_noleggio + $importo_danno;

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
                totale_pagato=?
             where 
                id=?
            ');
            $upd_noleggio->bind_param('ssds',$dataFine, $stato, $totale_pagato, $noleggio);
            if (!$upd_noleggio->execute()) {
                throw newException ($upd_supporto->error);
            }

            //aumenta la disponibilità
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
            $this->conn->commit();
            return $totale_pagato;
        } catch(Exception $e) {
            $this->conn->rollback();
            throw $e;
        } 
    }

}
?>