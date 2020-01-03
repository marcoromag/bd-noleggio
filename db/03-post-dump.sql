alter table video add FULLTEXT (titolo);

insert into catalogo 
select 1 as punto_vendita, id as video, 0 as quantita_disponibile from video 
left join catalogo on catalogo.video = id and punto_vendita=1 where catalogo.video is null
;

select 2 as punto_vendita, id as video, 0 as quantita_disponibile from video 
left join catalogo on catalogo.video = id and punto_vendita=2 where catalogo.video is null
LIMIT 100000;

-- Inserisce un po' di titoli in disponibilità
update video set tipo='NON-DISPONIBILE', data_disponibilita='2020-02-16' where id in ('tt7286456', 'tt4520988','tt0000417','tt0002113',
'tt0005853','tt0000014','tt0000029','tt0000609','tt0026252'
,'tt0000567','tt0026029','tt0136652','tt0002349','tt0021232','tt0021232','tt0004374','tt0501313');

