--20190821
--Apertura y Cierre de Caja.
 alter table phppos_boxes add column open_time timestamp not null default current_timestamp, 
 add column close_value double(7,2), 
 add column open_value double(7,2);
 alter table phppos_boxes add column open_comment text;

 alter table phppos_boxes modify column comment text null;
 alter table phppos_boxes modify column close_time timestamp null;
 