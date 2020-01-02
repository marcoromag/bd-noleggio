alter table video add FULLTEXT (titolo);

insert into catalogo 
select 1 as punto_vendita, id as video, 0 as quantita_disponibile from video 
left join catalogo on catalogo.video = id and punto_vendita=1 where catalogo.video is null
;

select 2 as punto_vendita, id as video, 0 as quantita_disponibile from video 
left join catalogo on catalogo.video = id and punto_vendita=2 where catalogo.video is null
LIMIT 100000;
