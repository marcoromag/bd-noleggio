alter table video add FULLTEXT (titolo);


INSERT INTO `punto_vendita` (`id`, nome, `citta`, `indirizzo`, `cap`) VALUES
(1, 'Roma 1', 'Roma', 'Via Masala 42', '00148'),
(2, 'Milano 1', 'Milano', 'Via Montenapoleone 2', '20001'),
(3, 'Portici', 'Portici', 'Via Libertà 216B', '80055'),
(4, 'Roma 2', 'Roma', 'Via Merulana 5', '00100'),
(5, 'Terni', 'Terni', 'Via Longhi', '1'),
(6, 'Latina', 'Latina', 'Via Verdi', '2'),
(7, 'Frosinone', 'Frosinone', 'Via Acquaforte', '3'),
(8, 'Roma 3', 'Roma', 'Viale Marconi 50', '00141');

INSERT INTO `impiegato` (`matricola`, `punto_vendita`, `login`, `password`, `tipo`, `nome`, `cognome`) VALUES
('RM_1_01', 1, 'admin_rm_1', 'password', 'DIRIGENTE', 'Luigi', 'Mario'),
('RM_1_02', 1, 'mario.rossi', 'password', 'ADDETTO', 'Mario', 'Rossi'),
('RM_1_03', 1, 'luigi.bianchi', 'password', 'ADDETTO', 'Luigi', 'Bianchi'),
('RM_1_04', 1, 'andrea.pini', 'password', 'ADDETTO', 'Andrea', 'Pini'),
('RM_1_05', 1, 'italo.gelsi', 'password', 'ADDETTO', 'Italo', 'Gelsi'),
('RM_1_06', 1, 'marco.romagnuolo', 'password', 'ADDETTO', 'Marco', 'Romagnuolo'),
('RM_1_07', 1, 'svevo.svevi', 'password', 'ADDETTO', 'Svevo', 'Svevi'),
('MI_2_01', 2, 'admin_mi_1', 'password', 'DIRIGENTE', 'Admin', 'Admin'),
('MI_2_02', 2, 'mario.bianchi', 'password', 'ADDETTO', 'Mario', 'Bianchi'),
('MI_2_03', 2, 'luigi.verdi', 'password', 'ADDETTO', 'Luigi', 'Verdi'),
('MI_2_04', 2, 'andrea.scarpa', 'password', 'ADDETTO', 'Andrea', 'Scarpa'),
('MI_2_05', 2, 'italo.mora', 'password', 'ADDETTO', 'Italo', 'Mora'),
('MI_2_06', 2, 'lucio', 'password', 'ADDETTO', 'Lucio', 'Romagnuolo'),
('MI_2_07', 2, 'svevo.alpini', 'password', 'ADDETTO', 'Svevo', 'Alpini')
;

INSERT INTO `fornitore` (`id`, `nome`) VALUES
('CLY', 'Cattleya'),
('RD', 'Rai Distribuzione'),
('PAR', 'Paramount Distribuzione'),
('ZUD', '01 Distribuzione');

INSERT INTO `termine_noleggio` (`giorni`, `importo_iniziale`, `importo_gg_successivi`) VALUES
(3, 5.00, 1.75),
(4, 6.00, 1.50),
(5, 6.50, 1.25),
(6, 7, 1);


-- Inserisce un po' di titoli in prenotazione
update video set tipo='NON-DISPONIBILE', data_disponibilita='2020-02-16' where id in ('tt7286456', 'tt4520988','tt0000417','tt0002113',
'tt0005853','tt0000014','tt0000029','tt0000609','tt0026252'
,'tt0000567','tt0026029','tt0136652','tt0002349','tt0021232','tt0021232','tt0004374','tt0501313');

