--20191008
alter table phppos_abonos add column employee_id int(10);
--20190821
--Apertura y Cierre de Caja.
 alter table phppos_boxes add column open_time timestamp not null default current_timestamp, 
 add column close_value double(7,2), 
 add column open_value double(7,2);
 alter table phppos_boxes add column open_comment text;

 alter table phppos_boxes modify column comment text null;
 alter table phppos_boxes modify column close_time timestamp null;

 --Facturación Electrónica
 alter table phppos_almacenes add column codigo_facturacion int(3);
 alter table phppos_sales add column establecimiento int(3), add column punto_emision int(3), add column numero_secuencial int(9);