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

--20200728
--Unit Items
alter table phppos_items add column unit varchar(25);
--Precision
alter table phppos_items modify cost_price double(15,4);
alter table phppos_items modify unit_price double(15,4);

alter table phppos_sales_items modify item_cost_price double(15,4);
alter table phppos_sales_items modify item_unit_price double(15,4);
alter table phppos_sales_items modify discount_percent double(15,4);
alter table phppos_sales_abonos_temp modify total double(15,4);
alter table phppos_sales_items_taxes modify percent double(15,4);
alter table  phppos_sales_payments modify payment_amount double(15,4);
alter table phppos_sales_suspended_items modify item_cost_price double(15,4), modify item_unit_price double(15,4), modify discount_percent double(15,4);
alter table phppos_sales_suspended_items_taxes modify percent double(15,4);
alter table phppos_sales_suspended_payments modify payment_amount double(15,4);
alter table phppos_abonos modify abono_amount double(15,4);

drop table phppos_sales_items_temp;

alter table phppos_receivings_items modify item_cost_price double(15,4);
alter table phppos_receivings_items modify item_unit_price double(15,4);
alter table phppos_receivings_items modify discount_percent double(15,4);

alter table phppos_receivings_abonos_temp modify total double(15,4);
alter table  phppos_receivings_payments modify payment_amount double(15,4);

--Images for blog, items and lanzaientos
alter table phppos_files add column controller varchar(25) default 'items';
--20201220
--Esign
insert into phppos_modules values('module_esign','module_esign_desc',20,'esign');
insert into phppos_permissions values('esign',180);

alter table phppos_sales add column xml_name varchar(50);
alter table phppos_sales add column signed varchar(1) default null;
alter table phppos_sales add column send_sri date;
alter table phppos_sales add column send_email date;
alter table phppos_sales add column state varchar(10);