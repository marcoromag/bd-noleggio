alter table video add FULLTEXT (titolo);

-- Inserisce un po' di titoli in disponibilità
update video set tipo='NON-DISPONIBILE', data_disponibilita='2020-02-16' where id in ('tt7286456', 'tt4520988','tt0000417','tt0002113',
'tt0005853','tt0000014','tt0000029','tt0000609','tt0026252'
,'tt0000567','tt0026029','tt0136652','tt0002349','tt0021232','tt0021232','tt0004374','tt0501313');

