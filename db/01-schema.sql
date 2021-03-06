create database noleggio;
use noleggio;

create or replace table punto_vendita (
  id int not null, 
  nome varchar(255) not null,
  citta varchar(255) not null, 
  indirizzo varchar(255) not null, 
  cap varchar(5) not null, 
  CONSTRAINT pk_punto_vendita primary key (id) 
);


create or replace table impiegato (
	matricola varchar(36) not null,
	punto_vendita int not null,
	login varchar(64) not null,
	password varchar(64) not null,
	tipo enum('ADDETTO', 'DIRIGENTE') not null,
	nome varchar(64) not null,
	cognome varchar(64) not null,
	constraint pk_impiegato primary key (matricola),
	constraint fk_impiegato_punto_vendita FOREIGN key (punto_vendita) REFERENCES punto_vendita(id)
);

create or replace table fornitore (
	id varchar(36) not null,
	nome varchar(64) not null,
	CONSTRAINT pk_fornitore PRIMARY key (id)
);

create or replace table batch (
  id varchar(36) not null, 
  tipo enum('CARICO','SCARICO') not null check (tipo in ('CARICO','SCARICO')),
  esito enum('SUCCESSO','FALLITO','IN-ESECUZIONE') not null default 'IN-ESECUZIONE' check (tipo in ('SUCCESSO','FALLITO','IN-ESECUZIONE')),
  errore varchar(256),
  punto_vendita int not null,
  impiegato varchar(64) not null,
  data date not null,
  CONSTRAINT pk_batch primary key (id),
  CONSTRAINT fk_batch_punto_vendita foreign key (punto_vendita) REFERENCES punto_vendita (id),
  CONSTRAINT fk_batch_impiegato foreign key (impiegato) REFERENCES impiegato (matricola)
);


create or replace table genere (
	nome varchar(36) not null,
	descrizione varchar(255) not null,
	CONSTRAINT pk_genere PRIMARY key (nome)
);

create or replace table attore (
	id varchar(36) not null,
	nome varchar(255) not null,
	CONSTRAINT pk_attore PRIMARY key (id)
);

create or replace table video (
	id varchar(36) not null,
	genere varchar(36) not null,
	tipo enum('DISPONIBILE','NON-DISPONIBILE') not null,
	titolo varchar(255) not null,
	regista varchar(255) not null,
	casa_produttrice varchar(255) not null,
	data_disponibilita date,
	CONSTRAINT pk_video PRIMARY key (id),
	CONSTRAINT fk_video_genere FOREIGN key (genere) REFERENCES genere(nome),
    FULLTEXT (titolo)
);


create or replace table supporto (
	id varchar(36) not null,
	seriale varchar(36) not null,
	video varchar(36) not null,
	fornitore varchar(36) not null,
	punto_vendita int not null,
	batch_carico varchar(36) not null,
	batch_scarico varchar(36),
	stato_fisico enum ('BUONO','DANNEGGIATO') not null default 'BUONO' check (stato_fisico in ('BUONO','DANNEGGIATO')),
	costo_supporto NUMERIC(10,2),
	noleggio_corrente varchar(36),
	disponibile boolean generated always as (case when batch_scarico is null then true ELSE null end) persistent,
	CONSTRAINT pk_supporto PRIMARY key (id),
	CONSTRAINT key_supporto_gia_presente UNIQUE key (fornitore, seriale, disponibile),
	CONSTRAINT fk_supporto_video FOREIGN key (video) REFERENCES video(id),
	CONSTRAINT fk_supporto_fornitore FOREIGN key (fornitore) REFERENCES fornitore(id),
	CONSTRAINT fk_supporto_punto_vendita FOREIGN key (punto_vendita) REFERENCES punto_vendita(id),
	CONSTRAINT fk_supporto_batch_carico FOREIGN key (batch_carico) REFERENCES batch(id),
	CONSTRAINT fk_supporto_batch_scarico FOREIGN key (batch_scarico) REFERENCES batch(id),
	CONSTRAINT ck_supporto_batch_carico CHECK ((select tipo from batch where id=`batch_carico`) = 'CARICO'),
	CONSTRAINT ck_supporto_batch_scarico CHECK ((select tipo from batch where id=`batch_carico`) = 'SCARICO')
);

create or replace table documento_liberatoria (
	id varchar(36) not null, 
	data_sottoscrizione date not null,
	posizione_archivio varchar(255),
	CONSTRAINT pk_documento_liberatoria PRIMARY key (id)
);

create or replace table cliente (
	cod_fiscale varchar(16) not null, 
	nome varchar(255) not null,
	cognome varchar(255) not null,
	indirizzo varchar(255) not null,
	data_nascita date not null,
	citta varchar(255) not null,
	cap varchar(5) not null,
	telefono_abitazione  varchar(10) not null,
	telefono_cellulare varchar(10) not null,
	email varchar(255) not null,
	documento_liberatoria varchar(64),
	CONSTRAINT pk_cliente PRIMARY key (cod_fiscale),
	CONSTRAINT fk_cliente_documento_liberatoria FOREIGN key (documento_liberatoria) REFERENCES documento_liberatoria(id)
);

create or replace table termine_noleggio (
	giorni int not null, 
	importo_iniziale NUMERIC(10,2) not null, 
	importo_gg_successivi numeric(10,2) not null,
	CONSTRAINT pk_termine_noleggio PRIMARY key (giorni)
);

create or replace table contratto_noleggio (
	id varchar(36) not null,
	supporto varchar(36) not null,
	cliente varchar(16) not null,
	impiegato_creazione varchar(36) not null,
	impiegato_restituzione varchar(36) check (data_restituzione is not null),
	data_inizio date not null,
	data_restituzione date,
	stato_restituzione enum ('BUONO','DANNEGGIATO') check (stato_restituzione in ('BUONO','DANNEGGIATO')),
	termine_noleggio int not null,
	CONSTRAINT pk_contratto_noleggio PRIMARY key (id),
	CONSTRAINT fk_contratto_noleggio_supporto FOREIGN key (supporto) REFERENCES supporto(id),
	CONSTRAINT fk_contratto_noleggio_cliente FOREIGN key (cliente) REFERENCES cliente(cod_fiscale),
	CONSTRAINT fk_contratto_noleggio_impiegato_creazione FOREIGN key (impiegato_creazione) REFERENCES impiegato(matricola),
	CONSTRAINT fk_contratto_noleggio_impiegato_restituzione FOREIGN key (impiegato_restituzione) REFERENCES impiegato(matricola),
	CONSTRAINT fk_contratto_termine_noleggio FOREIGN key (termine_noleggio) REFERENCES termine_noleggio(giorni)
);

create or replace table ricevuta (
	numero_ricevuta varchar(36) not null, 
	impiegato varchar(36) not null, 
	data date not null,
	contratto_noleggio varchar(36) not null,
	CONSTRAINT pk_ricevuta PRIMARY key (numero_ricevuta),
	CONSTRAINT uk_contratto_noleggio UNIQUE key (contratto_noleggio),
	CONSTRAINT fk_ricevuta_impiegato FOREIGN key (impiegato) REFERENCES impiegato(matricola),
	CONSTRAINT fk_ricevuta_contratto_noleggio FOREIGN key (contratto_noleggio) REFERENCES contratto_noleggio(id)
);

create or replace table voce_ricevuta(
	ricevuta varchar(36), 
	ordine int, 
	descrizione varchar(255), 
	costo numeric(10,2),
	CONSTRAINT pk_voce_ricevuta PRIMARY key (ricevuta, ordine),
	CONSTRAINT fk_voce_ricevuta_ricevuta FOREIGN key (ricevuta) REFERENCES ricevuta(numero_ricevuta)
);

create or replace table interpretazione(
	attore varchar(36) not null,
	video varchar(36) not null,
	ruolo varchar(255),
	constraint pk_interpretazione primary key (attore,video),
	CONSTRAINT fk_interpretazione_attore foreign key (attore) references attore(id),
	CONSTRAINT fk_interpretazione_video foreign key (video) references video(id)
);

create or replace table catalogo(
	punto_vendita int not null,
	video varchar(36) not null,
	quantita_disponibile int not null default 0,
	CONSTRAINT pk_catalogo primary key (punto_vendita, video),
	CONSTRAINT fk_catalogo_video foreign key (video) REFERENCES video(id),
	CONSTRAINT fk_catalogo_punto_vendita foreign key (punto_vendita) references punto_vendita(id)
);

create or replace table prenotazione(
	cliente varchar(16) not null,
	video varchar(36) not null,
	punto_vendita int not null,
	CONSTRAINT pk_prenotazione primary key (cliente, video, punto_vendita),
	CONSTRAINT fk_prenotazione_video foreign key (video) REFERENCES video(id),
	CONSTRAINT fk_prenotazione_punto_vendita foreign key (punto_vendita) REFERENCES punto_vendita(id),
	CONSTRAINT fk_prenotazione_cliente foreign key (cliente) references cliente(cod_fiscale)
);

    
create or replace view v_contratto_noleggio_attivo as
	select contratto_noleggio.id,supporto, punto_vendita, cliente,impiegato_creazione,data_inizio, termine_noleggio, video.id as video, titolo
    from cliente 
    join contratto_noleggio on cliente.cod_fiscale = contratto_noleggio.cliente
    join supporto on supporto.id = contratto_noleggio.supporto
    join video on video.id = supporto.video
    where contratto_noleggio.data_restituzione is NULL
;

create or replace view v_contratto_noleggio_terminato as 
	select contratto_noleggio.id,supporto, punto_vendita, cliente,impiegato_creazione, impiegato_restituzione, data_inizio, data_restituzione, termine_noleggio, video.id as video, titolo, ricevuta.numero_ricevuta as ricevuta
        from cliente 
        join contratto_noleggio on cliente.cod_fiscale = contratto_noleggio.cliente
        join supporto on supporto.id = contratto_noleggio.supporto
        join video on video.id = supporto.video
        left join ricevuta on ricevuta.contratto_noleggio = contratto_noleggio.id
        where contratto_noleggio.data_restituzione is not NULL
;

create or replace view v_ricevuta as
	select numero_ricevuta, data, 
	supporto,
	titolo, 
	cliente, cliente.nome, cliente.cognome, indirizzo, citta, cap, 
	impiegato.nome as impiegato_nome, impiegato.cognome as impiegato_cognome, matricola, impiegato.punto_vendita as punto_vendita,
	data_inizio, data_restituzione,
	sum(costo) as totale
	from ricevuta
	join contratto_noleggio on contratto_noleggio.id = ricevuta.contratto_noleggio
	join supporto on supporto.id = contratto_noleggio.supporto
	join video on video.id = supporto.video
	join impiegato on impiegato.matricola = ricevuta.impiegato
	join cliente on cliente.cod_fiscale = contratto_noleggio.cliente
	join voce_ricevuta on voce_ricevuta.ricevuta = ricevuta.numero_ricevuta
	group by numero_ricevuta 
;

create or replace view v_statistica_per_punto_vendita as 
    select punto_vendita.id, punto_vendita.nome, punto_vendita.citta, punto_vendita.indirizzo, punto_vendita.cap, data, count(numero_ricevuta) as numero_ricevute, ifnull(sum(totale),0) as totale_incasso
    from punto_vendita
	left join v_ricevuta 
		on v_ricevuta.punto_vendita = punto_vendita.id 
    group by punto_vendita.id, data
    order by punto_vendita.id,  totale_incasso, data
;

create or replace view v_statistica_per_impiegato as
	select impiegato.punto_vendita, punto_vendita.nome as punto_vendita_nome, matricola, impiegato.nome, cognome, data, ifnull(sum(costo),0) as totale_incasso
	from impiegato
	join punto_vendita on punto_vendita.id = impiegato.punto_vendita
	left join ricevuta 
		on ricevuta.impiegato = impiegato.matricola 
	left join voce_ricevuta 
		on voce_ricevuta.ricevuta = ricevuta.numero_ricevuta
	group by matricola, data
	order by punto_vendita, matricola, data
	;

create or replace view v_supporto_disponibile as 
	select *
     from supporto
     where stato_fisico='BUONO' 
     and noleggio_corrente is null 
     and batch_scarico is null
;
