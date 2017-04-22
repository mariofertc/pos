<?php
function get_people_manage_table()
{
	$CI =& get_instance();
	$table='<table cellpadding="0" cellspacing="0" border="0" class="display" id="sortable_table">
		<thead>
			<tr>
				<th width="5%"><input type="checkbox" id="select_all" /></th>
				<th width="25%">'.$CI->lang->line('common_first_name').'</th>
				<th width="25%">'.$CI->lang->line('common_last_name').'</th>
				<th width="12%">'.$CI->lang->line('common_email').'</th>
				<th width="15%">'.$CI->lang->line('common_phone_number').'</th>
				<th width="25%">Acciones</th> 
			</tr>
		</thead>
		<tbody>
	<!--Esto se llena con  ajax cloro -->	
		</tbody>
		<tfoot>
			
		</tfoot>
	</table>';   
        
	return $table;
}

function get_people_manage_table_data_rows($data,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	foreach($data->result() as $beneficiario)
	{
		$table_data_rows.=get_person_data_row($beneficiario,$controller);
	}
	if($data->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='7'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_persons_to_display')."</div></tr></tr>";
	}
	return $table_data_rows;
}

function get_person_data_row($data,$controller)	
{	
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();
	$height = $controller->get_form_height()+50;
	$data = (array)$data;
	$id  = mb_strtolower($data['person_id']);
	
	$table_data_row='<tr>';
	$table_data_row.="<td><input type='checkbox' id='$id' value='".$data['person_id']."'/></td>";
	$table_data_row.='<td>'.character_limiter($data['first_name']).'</td>';
	$table_data_row.='<td>'.character_limiter($data['last_name']).'</td>';
	$table_data_row.='<td>'.mailto($data['email'],character_limiter($data['email'],22)).'</td>';
	$table_data_row.='<td>'.character_limiter($data['phone_number']).'</td>';			
	$table_data_row.='<td>'. anchor($controller_name . "/view/$id/?width=$width&height=$height", 
							img(array('src' => 'images/ico/page_edit.png','alt' => 'Editar','title' => 'Editar','class' => 'IconosOpcion')), 
							array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update')));
	$table_data_row.='</tr>';
	
	return $table_data_row;
}




/*
Gets the html table to manage people.
*/
function get_people_manage_table_old($people,$controller)
{
	$CI =& get_instance();
	$table='<table class="tablesorter" id="sortable_table">';
	
	$headers = array('<input type="checkbox" id="select_all" />', 
	$CI->lang->line('common_last_name'),
	$CI->lang->line('common_first_name'),
	$CI->lang->line('common_email'),
	$CI->lang->line('common_phone_number'),
	'&nbsp');
	
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.=get_people_manage_table_data_rows($people,$controller);
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the people.
*/
function get_people_manage_table_data_rows_old($people,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($people->result() as $person)
	{
		$table_data_rows.=get_person_data_row($person,$controller);
	}
	
	if($people->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='6'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_persons_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_person_data_row_old($person,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='5%'><input type='checkbox' id='person_$person->person_id' value='".$person->person_id."'/></td>";
	$table_data_row.='<td width="20%">'.character_limiter($person->last_name,13).'</td>';
	$table_data_row.='<td width="20%">'.character_limiter($person->first_name,13).'</td>';
	$table_data_row.='<td width="30%">'.mailto($person->email,character_limiter($person->email,22)).'</td>';
	$table_data_row.='<td width="20%">'.character_limiter($person->phone_number,13).'</td>';		
	$table_data_row.='<td width="5%">'.anchor($controller_name."/view/$person->person_id?width=$width&height=450", $CI->lang->line('common_edit'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))).'</td>';		
	$table_data_row.='</tr>';
	
	return $table_data_row;
}

/*
Gets the html table to manage suppliers.
*/
//function get_supplier_manage_table($suppliers,$controller)
function get_supplier_manage_table()
{
	$CI =& get_instance();
	$table='<table class="tablesorter" id="sortable_table">';
	
	$headers = array('<input type="checkbox" id="select_all" />',
	$CI->lang->line('suppliers_company_name'),
	$CI->lang->line('common_last_name'),
	$CI->lang->line('common_first_name'),
	$CI->lang->line('common_email'),
	$CI->lang->line('common_phone_number'),
	'&nbsp');
	
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	//$table.=get_supplier_manage_table_data_rows($suppliers,$controller);
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the supplier.
*/
function get_supplier_manage_table_data_rows($suppliers,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($suppliers->result() as $supplier)
	{
		$table_data_rows.=get_supplier_data_row($supplier,$controller);
	}
	
	if($suppliers->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='7'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_persons_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_supplier_data_row($supplier,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='5%'><input type='checkbox' id='person_$supplier->person_id' value='".$supplier->person_id."'/></td>";
	$table_data_row.='<td width="17%">'.character_limiter($supplier->company_name,13).'</td>';
	$table_data_row.='<td width="17%">'.character_limiter($supplier->last_name,13).'</td>';
	$table_data_row.='<td width="17%">'.character_limiter($supplier->first_name,13).'</td>';
	$table_data_row.='<td width="22%">'.mailto($supplier->email,character_limiter($supplier->email,22)).'</td>';
	$table_data_row.='<td width="17%">'.character_limiter($supplier->phone_number,13).'</td>';		
	$table_data_row.='<td width="5%">'.anchor($controller_name."/view/$supplier->person_id?width=$width", $CI->lang->line('common_edit'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))).'</td>';		
	$table_data_row.='</tr>';
	
	return $table_data_row;
}
/*
Gets the html table to manage boxes.
*/
function get_boxes_manage_table($boxes,$controller)
{
	$CI =& get_instance();
	$table='<table class="tablesorter" id="sortable_table">';
	
	$headers = array('<input type="checkbox" id="select_all" />', 
	$CI->lang->line('boxes_close_time'),
	$CI->lang->line('boxes_comment'),
	$CI->lang->line('employees_employee'),
	'&nbsp'
	);
	
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.=get_boxes_manage_table_data_rows($boxes,$controller);
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the boxes.
*/
function get_boxes_manage_table_data_rows($boxes,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($boxes->result() as $box)
	{
		$table_data_rows.=get_box_data_row($box,$controller);
	}
	
	if($boxes->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='11'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('boxes_no_boxes_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_box_data_row($box,$controller)
{
	$CI =& get_instance();
	$employee_info=$CI->Employee->get_info($box->employee_id);
	$nom_emp=$employee_info->username;
	//foreach($employee_info as $emp_info)
	//{
		//$nom_emp.=$emp_info['username']. '%, ';
	//}
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='3%'><input type='checkbox' id='box_$box->box_id' value='".$box->box_id."'/></td>";
	$table_data_row.='<td width="20%">'.$box->close_time."</td>";
	$table_data_row.='<td width="15%">'.$box->comment.'</td>';
	$table_data_row.='<td width="20%">'.$nom_emp.'</td>';
	$table_data_row.='<td width="5%">'.anchor($controller_name."/view/$box->box_id?width=$width", $CI->lang->line('common_edit'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))).'</td>';		
	
	$table_data_row.='</tr>';
	return $table_data_row;
}



/*
Gets the html table to manage items.
*/
function get_items_manage_table()
{
	$CI =& get_instance();	
	
	$table='<table class="stripe row-border order-column dataTable no-footer DTFC_Cloned" id="sortable_table">';
	$headers = array('<input type="checkbox" id="select_all" />', 
	$CI->lang->line('items_item_number_ab'),
	$CI->lang->line('items_name'),
	$CI->lang->line('items_category'),
	$CI->lang->line('items_size'),
	$CI->lang->line('suppliers_supplier'),
	$CI->lang->line('items_cost_price_ab'),
	$CI->lang->line('items_unit_price_ab'),
	$CI->lang->line('items_tax_percents_ab'),
	// $CI->lang->line('items_quantity_a'),
	// $CI->lang->line('items_quantity_b'),
	// $CI->lang->line('items_quantity_c'),
	$CI->lang->line('items_quantity_ab'),
	//'Inventory'//Ramel Inventory Tracking
	$CI->lang->line('inv_inventory'),
	//'&nbsp', 
	//'&nbsp',
	);
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		if($header == $CI->lang->line('inv_inventory'))
//			$table.="<th colspan='4' width='10' style='text-align:center'>$header</th>";
			$table.="<th>$header</th>";
		else if($header == $CI->lang->line('items_tax_percents_ab'))
		{
			$table.="<th>$header</th>";
			$almacenes = $CI->Almacen->get_all();
			foreach($almacenes as $almacen)
			{
				//$table.="<th>".word_limiter($almacen['nombre'],2)."</th>";
				$table.="<th>".word_limiter($almacen['short_name'],2)."</th>";
			}
		}
		else
			$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	//$table.=get_items_manage_table_data_rows($items,$controller);
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the items.
*/
function get_items_manage_table_data_rows($items,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($items->result() as $item)
	{
		$table_data_rows.=get_item_data_row($item,$controller);
	}
	
	if($items->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='11'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('items_no_items_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_item_data_row($item,$controller)
{
	$CI =& get_instance();
	$item_tax_info=$CI->Item_taxes->get_info($item->item_id);
	$tax_percents = '';
	foreach($item_tax_info as $tax_info)
	{
		$tax_percents.=$tax_info['percent']. '%, ';
	}
	$tax_percents=substr($tax_percents, 0, -2);
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td ><input type='checkbox' id='item_$item->item_id' value='".$item->item_id."'/></td>";
	$table_data_row.='<td>'.$item->item_number.'</td>';
	$table_data_row.='<td >'.$item->name.'</td>';
	$table_data_row.='<td >'.$item->category.'</td>';
	$table_data_row.='<td >'.$item->size.'</td>';
	$table_data_row.='<td >'.$item->company_name.'</td>';
	$table_data_row.='<td >'.to_currency($item->cost_price).'</td>';
	$table_data_row.='<td >'.to_currency($item->unit_price).'</td>';
	$table_data_row.='<td >'.$tax_percents.'</td>';
	$almacenes = $CI->Almacen->get_all();
	foreach($almacenes as $almacen)
	{
		$almacen_id = "id".$almacen['almacen_id'];
		$table_data_row.='<td width="5%">'.$item->$almacen_id.'</td>';
	}
	
	// $table_data_row.='<td width="5%">'.$item->quantity.'</td>';
	// $table_data_row.='<td width="5%">'.$item->quantity.'</td>';
	$table_data_row.='<td>'.$item->quantity.'</td>';
	
	$table_data_row.='<td>'.anchor($controller_name."/view/$item->item_id?width=$width", $CI->lang->line('common_edit_ab'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))). nbs();		
	//Ramel Inventory Tracking
	$table_data_row.=anchor($controller_name."/inventory/$item->item_id?width=300", $CI->lang->line('common_inv'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_count'))). nbs();//inventory count
	$table_data_row.=anchor($controller_name."/inventory_mov/$item->item_id?width=300", $CI->lang->line('common_mov'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_move'))). nbs();
	$table_data_row.=anchor($controller_name."/count_details/$item->item_id?width=$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_details_count'))).'</td>';//inventory details	
	
	$table_data_row.='</tr>';
	return $table_data_row;
}




/*
Gets the html table to manage items.
*/
function get_items_manage_table_old($items,$controller)
{
	$CI =& get_instance();	
	
	$table='<table class="tablesorter" id="sortable_table">';
	$headers = array('<input type="checkbox" id="select_all" />', 
	$CI->lang->line('items_item_number_ab'),
	$CI->lang->line('items_name'),
	$CI->lang->line('items_category'),
	$CI->lang->line('suppliers_supplier'),
	$CI->lang->line('items_cost_price_ab'),
	$CI->lang->line('items_unit_price_ab'),
	$CI->lang->line('items_tax_percents_ab'),
	// $CI->lang->line('items_quantity_a'),
	// $CI->lang->line('items_quantity_b'),
	// $CI->lang->line('items_quantity_c'),
	$CI->lang->line('items_quantity_ab'),
	//'Inventory'//Ramel Inventory Tracking
	$CI->lang->line('inv_inventory'),
	//'&nbsp', 
	//'&nbsp',
	);
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		if($header == $CI->lang->line('inv_inventory'))
			$table.="<th colspan='4' width='10' style='text-align:center'>$header</th>";
		else if($header == $CI->lang->line('items_tax_percents_ab'))
		{
			$table.="<th>$header</th>";
			$almacenes = $CI->Almacen->get_all();
			foreach($almacenes->result() as $almacen)
			{
				$table.="<th>".word_limiter($almacen->nombre,1)."</th>";
			}
		}
		else
			$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.=get_items_manage_table_data_rows($items,$controller);
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the items.
*/
function get_items_manage_table_data_rows_old($items,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($items->result() as $item)
	{
		$table_data_rows.=get_item_data_row($item,$controller);
	}
	
	if($items->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='11'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('items_no_items_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_item_data_row_old($item,$controller)
{
	$CI =& get_instance();
	$item_tax_info=$CI->Item_taxes->get_info($item->item_id);
	$tax_percents = '';
	foreach($item_tax_info as $tax_info)
	{
		$tax_percents.=$tax_info['percent']. '%, ';
	}
	$tax_percents=substr($tax_percents, 0, -2);
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='1%'><input type='checkbox' id='item_$item->item_id' value='".$item->item_id."'/></td>";
	$table_data_row.='<td width="5%">'.$item->item_number.'</td>';
	$table_data_row.='<td width="20%">'.$item->name.'</td>';
	$table_data_row.='<td width="13%">'.$item->category.'</td>';
	$table_data_row.='<td width="13%">'.$item->company_name.'</td>';
	$table_data_row.='<td width="9%">'.to_currency($item->cost_price).'</td>';
	$table_data_row.='<td width="9%">'.to_currency($item->unit_price).'</td>';
	$table_data_row.='<td width="8%">'.$tax_percents.'</td>';
	$almacenes = $CI->Almacen->get_all();
	foreach($almacenes->result() as $almacen)
	{
		$almacen_id = "id".$almacen->almacen_id;
		$table_data_row.='<td width="5%">'.$item->$almacen_id.'</td>';
	}
	
	// $table_data_row.='<td width="5%">'.$item->quantity.'</td>';
	// $table_data_row.='<td width="5%">'.$item->quantity.'</td>';
	$table_data_row.='<td width="5%">'.$item->quantity.'</td>';
	
	$table_data_row.='<td width="1" style=" padding-left: 0;padding-right: 2;">'.anchor($controller_name."/view/$item->item_id?width=$width", $CI->lang->line('common_edit_ab'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))).'</td>';		
	//Ramel Inventory Tracking
	$table_data_row.='<td  width="1" style=" padding-left: 0;padding-right: 2;">'.anchor($controller_name."/inventory/$item->item_id?width=300", $CI->lang->line('common_inv'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_count'))).'</td>';//inventory count
	$table_data_row.='<td  width="1" style=" padding-left: 0;padding-right: 2;">'.anchor($controller_name."/inventory_mov/$item->item_id?width=300", $CI->lang->line('common_mov'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_move'))).'</td>';
	$table_data_row.='<td width="1" style=" padding-left: 0;padding-right: 2;">'.anchor($controller_name."/count_details/$item->item_id?width=$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_details_count'))).'</td>';//inventory details	
	
	$table_data_row.='</tr>';
	return $table_data_row;
}

//Retorna la busqueda de Reporte
function get_item_data_rowdd($item,$controller)
{
	$CI =& get_instance();
	$item_tax_info=$CI->Item_taxes->get_info($item->item_id);
	$tax_percents = '';
	foreach($item_tax_info as $tax_info)
	{
		$tax_percents.=$tax_info['percent']. '%, ';
	}
	$tax_percents=substr($tax_percents, 0, -2);
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='3%'><input type='checkbox' id='item_$item->item_id' value='".$item->item_id."'/></td>";
	$table_data_row.='<td width="15%">'.$item->item_number.'</td>';
	$table_data_row.='<td width="20%">'.$item->name.'</td>';
	$table_data_row.='<td width="14%">'.$item->category.'</td>';
	$table_data_row.='<td width="14%">'.to_currency($item->cost_price).'</td>';
	$table_data_row.='<td width="14%">'.to_currency($item->unit_price).'</td>';
	$table_data_row.='<td width="14%">'.$tax_percents.'</td>';	
	$table_data_row.='<td width="14%">'.$item->quantity.'</td>';
	$table_data_row.='<td width="5%">'.anchor($controller_name."/view/$item->item_id?width=$width", $CI->lang->line('common_edit'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))).'</td>';		
	
	//Ramel Inventory Tracking
	$table_data_row.='<td width="10%">'.anchor($controller_name."/inventory/$item->item_id?width=$width", $CI->lang->line('common_inv'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_count')))./*'</td>';//inventory count	
	$table_data_row.='<td width="5%">'*/'&nbsp;&nbsp;&nbsp;&nbsp;'.anchor($controller_name."/count_details/$item->item_id?width=$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_details_count'))).'</td>';//inventory details	
	
	$table_data_row.='</tr>';
	return $table_data_row;
}
/*
Gets the html data rows for the people.
*/
function get_inventory_manage_table_data_rows($inventory,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	$tabular_data[] = ARRAY();
	//$report_data = $model->getData(array());
	foreach($inventory->result() as $row)
	{
		//$table_data_rows.=get_inventory_data_row($row,$controller);
		$tabular_data[] = array($row->name, $row->item_number, $row->description, $row->quantity, $row->reorder_level);
	}
	$CI =& get_instance();
	
	$controller_name=$CI->uri->segment(1);
	//$width = $controller->get_form_width();
	//echo $CI->uri->segment(0)->get_form_width();;
	if($inventory->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='6'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_persons_to_display')."</div></tr></tr>";
	}
	
	return $tabular_data;
	//return $table_data_rows;
}

function get_inventory_data_row($inventory,$controller)
{
	$CI =& get_instance();
	
	$controller_name=$CI->uri->segment(1);
	//$width = $controller->get_form_width();
	$width = 360;
	$table_data_row='<tr>';
	$table_data_row.="<td width='5%'><input type='checkbox' id='inventory_$inventory->item_id' value='".$inventory->item_id."'/></td>";
	$table_data_row.='<td width="20%">'.character_limiter($inventory->name,13).'</td>';
	$table_data_row.='</tr>';
	
	return $table_data_row;
}

/*
Gets the html table to manage items.
*/
function get_inventory_manage_table_Fallo($items,$controller)
{
	$CI =& get_instance();
	$table='<table class="tablesorter" id="sortable_table">';
	//name, item_number, quantity, reorder_level, description
	$headers = array('<input type="checkbox" id="select_all" />', 
	$CI->lang->line('items_name'),
	$CI->lang->line('items_item_number'),
	$CI->lang->line('items_quantity'),
	$CI->lang->line('items_reorder_level'),
	$CI->lang->line('items_description'),
	'&nbsp', 
	$CI->lang->line('inv_inventory'),
	//'Inventory'//Ramel Inventory Tracking
	);
	
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.=get_inventory_manage_table_data_rows($items,$controller);
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the items.
*/
function get_inventory_manage_table_data_rows_Fallo($items,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($items->result() as $item)
	{
		$table_data_rows.=get_inventory_data_row($item,$controller);
	}
	
	if($items->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='11'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('items_no_items_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_inventory_data_row_Fallo($inventory,$controller)
{
	$CI =& get_instance();
	
	$controller_name=$CI->uri->segment(1);
	//$width = $controller->get_form_width();
	$width = 360;
	$table_data_row='<tr>';
	$table_data_row.="<td width='5%'><input type='checkbox' id='inventory_$inventory->item_id' value='".$inventory->item_id."'/></td>";
	$table_data_row.='<td width="20%">'.character_limiter($inventory->name,13).'</td>';
	$table_data_row.='</tr>';
	
	return $table_data_row;
}

/*function get_inventory_data_row($item,$controller)
{
	$CI =& get_instance();
	$item_tax_info=$CI->Item_taxes->get_info($item->item_id);
	$tax_percents = '';
	foreach($item_tax_info as $tax_info)
	{
		$tax_percents.=$tax_info['percent']. '%, ';
	}
	$tax_percents=substr($tax_percents, 0, -2);
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='3%'><input type='checkbox' id='item_$item->item_id' value='".$item->item_id."'/></td>";
	$table_data_row.='<td width="15%">'.$item->item_number.'</td>';
	$table_data_row.='<td width="20%">'.$item->name.'</td>';
	$table_data_row.='<td width="14%">'.$item->category.'</td>';
	$table_data_row.='<td width="14%">'.to_currency($item->cost_price).'</td>';
	$table_data_row.='<td width="14%">'.to_currency($item->unit_price).'</td>';
	$table_data_row.='<td width="14%">'.$tax_percents.'</td>';	
	$table_data_row.='<td width="14%">'.$item->quantity.'</td>';
	$table_data_row.='<td width="5%">'.anchor($controller_name."/view/$item->item_id/width:$width", $CI->lang->line('common_edit'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))).'</td>';		
	*/
	//Ramel Inventory Tracking
	//$table_data_row.='<td width="10%">'.anchor($controller_name."/inventory/$item->item_id/width:$width", $CI->lang->line('common_inv'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_count')))./*'</td>';//inventory count	
	//$table_data_row.='<td width="5%">'*/'&nbsp;&nbsp;&nbsp;&nbsp;'.anchor($controller_name."/count_details/$item->item_id/width:$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_details_count'))).'</td>';//inventory details	
	
	//$table_data_row.='</tr>';
	//return $table_data_row;
//}

//Retorna la busqueda de Reporte
function get_inventory_data_rowdd_Fallo($item,$controller)
{
	$CI =& get_instance();
	$item_tax_info=$CI->Item_taxes->get_info($item->item_id);
	$tax_percents = '';
	foreach($item_tax_info as $tax_info)
	{
		$tax_percents.=$tax_info['percent']. '%, ';
	}
	$tax_percents=substr($tax_percents, 0, -2);
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='3%'><input type='checkbox' id='item_$item->item_id' value='".$item->item_id."'/></td>";
	$table_data_row.='<td width="15%">'.$item->item_number.'</td>';
	$table_data_row.='<td width="20%">'.$item->name.'</td>';
	$table_data_row.='<td width="14%">'.$item->category.'</td>';
	$table_data_row.='<td width="14%">'.to_currency($item->cost_price).'</td>';
	$table_data_row.='<td width="14%">'.to_currency($item->unit_price).'</td>';
	$table_data_row.='<td width="14%">'.$tax_percents.'</td>';	
	$table_data_row.='<td width="14%">'.$item->quantity.'</td>';
	$table_data_row.='<td width="4%">'.anchor($controller_name."/view/$item->item_id?width=$width", $CI->lang->line('common_edit'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))).'</td>';		
	
	//Ramel Inventory Tracking
	$table_data_row.='<td width="10%">'.anchor($controller_name."/inventory/$item->item_id?width=$width", $CI->lang->line('common_inv'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_count')))./*'</td>';//inventory count	
	$table_data_row.='<td width="5%">'*/'&nbsp;&nbsp;&nbsp;&nbsp;'.anchor($controller_name."/count_details/$item->item_id?width=$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_details_count'))).'</td>';//inventory details	
	
	$table_data_row.='</tr>';
	return $table_data_row;
}

//Inventory Summary
function get_inventory_summary_manage_table_data_rows($inventory,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	$tabular_data[] = ARRAY();
	//$report_data = $model->getData(array());
	foreach($inventory->result() as $row)
	{
		//$table_data_rows.=get_inventory_data_row($row,$controller);
		$tabular_data[] = array($row->name, $row->item_number, $row->description, $row->quantity, $row->reorder_level, $row->total);
	}
	$CI =& get_instance();
	
	$controller_name=$CI->uri->segment(1);
	//$width = $controller->get_form_width();
	//echo $CI->uri->segment(0)->get_form_width();;
	if($inventory->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='6'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_persons_to_display')."</div></tr></tr>";
	}
	
	return $tabular_data;
	//return $table_data_rows;
}



/*
Gets the html table to manage payments.
*/
function get_payment_manage_table()
{
	$CI =& get_instance();
	$table='<table class="tablesorter" id="sortable_table">';
	
	$headers = array('<input type="checkbox" id="select_all" />',
	$CI->lang->line('payments_type'),
	$CI->lang->line('payments_por_cobrar'),
	'&nbsp');
	
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the supplier.
*/
function get_payment_manage_table_data_rows($payments,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($payments->result() as $payment)
	{
		$table_data_rows.=get_payment_data_row($payment,$controller);
	}
	
	if($payments->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='7'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_payments_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_payment_data_row($payment,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='5%'><input type='checkbox' id='payment_$payment->payment_id' value='".$payment->payment_id."'/></td>";
	$table_data_row.='<td width="17%">'.character_limiter($payment->payment_type,13).'</td>';
	//$table_data_row.="<td width='5%'><input type='radio' id='payment_$payment->por_cobrar' ".(($payment->por_cobrar)?'checked':'')." value='1' DISABLED></td>";
	$table_data_row.="<td width='5%'><input type='radio' id='payment_$payment->por_cobrar' ".(($payment->por_cobrar)?'checked':'')." value='". (($payment->por_cobrar)?'1':'0') ."' DISABLED></td>";
	$table_data_row.='<td width="5%">'.anchor($controller_name."/view/$payment->payment_id?width=$width", $CI->lang->line('common_edit'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update'))).'</td>';		
	$table_data_row.='</tr>';
	
	return $table_data_row;
}

//Abonos Cuentas por Cobrar
//function get_abono_manage_table($por_cobrar_m,$controller){
function get_abono_manage_table(){
	$CI =& get_instance();
	$table='<table class="tabledist" id="sortable_table">';
	
	$headers = array('<input type="checkbox" id="select_all" />',
	$CI->lang->line('sales_id'),
	$CI->lang->line('sales_date'),
	$CI->lang->line('customers_customer'),
	// $CI->lang->line('employees_employee'),
	$CI->lang->line('payments_type'),
	$CI->lang->line('sales_total'),
	$CI->lang->line('reports_debe'),
	$CI->lang->line('abonos_mora'),
	$CI->lang->line('abonos_cuotas'),
	//$CI->lang->line('payments_por_cobrar'),
	$CI->lang->line('inv_inventory')
	);
	
	$table.='<thead><tr>';
	foreach($headers as $header){
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody></tbody></table>';
	return $table;
}

function get_abono_manage_table_data_rows($por_cobrar_m,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($por_cobrar_m['summary'] as $key=>$por_cobrar)
	{
		$table_data_rows.=get_abono_data_row($por_cobrar,$controller);
	}
	
	if(count($por_cobrar_m['summary'])==0)
	{
		$table_data_rows.="<tr><td colspan='7'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_por_cobrar_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_abono_data_row($por_cobrar_m,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.="<td width='1%'><input type='checkbox' id='por_cobrar_m_$por_cobrar_m[sale_id]' value='".$por_cobrar_m['sale_id']."'/></td>";
	$table_data_row.='<td width="5%">'.anchor('sales/edit/'.$por_cobrar_m['sale_id'], 'POS '.$por_cobrar_m['sale_id'], array('target' => '_blank')).'</td>';
	$table_data_row.='<td width="2%">'.character_limiter($por_cobrar_m['sale_date'],13).'</td>';
	//$table_data_row.='<td width="9%">'.character_limiter($por_cobrar_m['customer_name'],13).'</td>';
	//$table_data_row.='<td width="9%">'.anchor('do_search()',character_limiter($por_cobrar_m['customer_name'],13)).'</td>';
	//$table_data_row.='<td width="9%">'.anchor('abonos/search?'.$por_cobrar_m['person_id'],character_limiter($por_cobrar_m['customer_name'],13)).'</td>';
	$table_data_row.='<td width="9%">'.'<button type="submit" value="upvote" onclick="do_search(true,true,'.$por_cobrar_m['person_id'].')">
  <span>'.character_limiter($por_cobrar_m['customer_name'],13).'</span>
</button>'.'</td>';
	// $table_data_row.='<td width="9%">'.character_limiter($por_cobrar_m['employee_name'],13).'</td>';
	$table_data_row.='<td width="10%">'.character_limiter($por_cobrar_m['payment_type'],14).'</td>';
	$table_data_row.='<td width="4%">'.to_currency($por_cobrar_m['total']).'</td>';
	$table_data_row.='<td width="4%">'.to_currency($por_cobrar_m['debe']).'</td>';
	// $table_data_row.='<td width="7%">'. date('Y-m-d', $por_cobrar_m['mora']).'</td>';
	$table_data_row.='<td width="6%">'. to_dia($por_cobrar_m['mora']).'</td>';
	$table_data_row.='<td width="9%">'. $por_cobrar_m['cuotas'].'</td>';
	//$table_data_row.="<td width='5%'><input type='radio' id='payment_$payment->por_cobrar' ".(($payment->por_cobrar)?'checked':'')." value='1' DISABLED></td>";
	//$table_data_row.="<td width='5%'><input type='radio' id='por_cobrar_m_$por_cobrar_m->por_cobrar' ".(($por_cobrar_m['por_cobrar'])?'checked':'')." value='". (($por_cobrar_m['por_cobrar'])?'1':'0') ."' DISABLED></td>";
	// $table_data_row.='<td width="2%">'.anchor($controller_name."/view/$por_cobrar_m[sale_id]/$por_cobrar_m[payment_id]/$por_cobrar_m[debe]/width:$width", $CI->lang->line('common_abono'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update')));		
	$table_data_row.='<td width="2%">'.anchor($controller_name."/view/$por_cobrar_m[sale_id]/$por_cobrar_m[payment_id]/".to_currency_no_money($por_cobrar_m['debe'])."?width=$width", $CI->lang->line('common_abono'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_abonar')));		
	
	//Ver Resumen Pagos
	
	$table_data_row.='&nbsp;'.anchor($controller_name."/pay_details/$por_cobrar_m[sale_id]?width=$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_view'))).'</td>';//inventory details	
	//$table_data_row.='<td width="5%">&nbsp;&nbsp;&nbsp;&nbsp;'.anchor($controller_name."/count_details/$item->item_id/width:$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_details_count'))).'</td>';//inventory details	
	
	//$table_data_row.='<td width="10%">'.anchor($controller_name."/inventory/$item->item_id/width:$width", $CI->lang->line('common_inv'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_count')))./*'</td>';//inventory count	
	//$table_data_row.='<td width="5%">'*/'&nbsp;&nbsp;&nbsp;&nbsp;'.anchor($controller_name."/count_details/$item->item_id/width:$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_details
	
	
	
	$table_data_row.='</tr>';
	
	return $table_data_row;
}

//Para el Registro de cobros
function get_pay_detail_manage_table($abonos,$controller)
{
	$CI =& get_instance();
	
	$table='<table class="tablesorter" id="sortable_table">';
	$headers = array(
	$CI->lang->line('reports_date'),
	$CI->lang->line('sales_payment'),
	$CI->lang->line('sales_amount_tendered'),
	$CI->lang->line('inv_remarks'),
	);
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.=get_pay_manage_table_data_rows($abonos,$controller);
	$table.='</tbody></table>';
	return $table;
}

function get_pay_manage_table_data_rows($abonos,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($abonos->result() as $abono)
	{
		$table_data_rows.=get_pay_data_row($abono,$controller);
	}
	
	if($abonos->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='7'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_por_cobrar_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}
function get_pay_data_row($abonos,$controller)
{
    $CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.='<td width="17%">'.date('Y-m-d',strtotime($abonos->abono_time)).'</td>';
	$table_data_row.='<td width="17%">'.character_limiter($abonos->abono_type,13).'</td>';
	$table_data_row.='<td width="17%">'.to_currency($abonos->abono_amount,13).'</td>';
	$table_data_row.='<td width="17%">'.character_limiter($abonos->abono_comment,13).'</td>';
	$table_data_row.='</tr>';
	
	return $table_data_row;
}

//Para el Registro de Pagos
function get_porpagar_detail_manage_table($abonos,$controller)
{
	$CI =& get_instance();
	
	$table='<table class="tablesorter" id="sortable_table">';
	$headers = array(
	$CI->lang->line('reports_date'),
	$CI->lang->line('sales_payment'),
	$CI->lang->line('sales_amount_tendered'),
	$CI->lang->line('inv_remarks'),
	);
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.=get_porpagar_detail_table_data_rows($abonos,$controller);
	$table.='</tbody></table>';
	return $table;
}

function get_porpagar_detail_table_data_rows($abonos,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($abonos->result() as $abono)
	{
		$table_data_rows.=get_porpagar_detail_data_row($abono,$controller);
	}
	
	if($abonos->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='7'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_por_cobrar_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}
function get_porpagar_detail_data_row($abonos,$controller)
{
    $CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();

	$table_data_row='<tr>';
	$table_data_row.='<td width="17%">'.date('Y-m-d',strtotime($abonos->time)).'</td>';
	$table_data_row.='<td width="17%">'.character_limiter($abonos->type,13).'</td>';
	$table_data_row.='<td width="17%">'.to_currency($abonos->amount,13).'</td>';
	$table_data_row.='<td width="17%">'.character_limiter($abonos->comment,13).'</td>';
	$table_data_row.='</tr>';
	
	return $table_data_row;
}

//Para registrar los pagos a proveedores
function get_porpagar_manage_table()
{
	$CI =& get_instance();
	$table='<table class="tabledist" id="sortable_table">';
	
	$headers = array('<input type="checkbox" id="select_all" />',
	$CI->lang->line('sales_id'),
	$CI->lang->line('sales_date'),
	$CI->lang->line('suppliers_supplier'),
	// $CI->lang->line('employees_employee'),
	$CI->lang->line('payments_type'),
	$CI->lang->line('sales_total'),
	$CI->lang->line('reports_debe'),
	$CI->lang->line('abonos_mora'),
	$CI->lang->line('abonos_cuotas'),
	//$CI->lang->line('payments_por_cobrar'),
	$CI->lang->line('inv_inventory')
	);
	
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	//$table.=get_porpagar_manage_table_data_rows($por_pagar_m,$controller);
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the supplier.
*/
function get_porpagar_manage_table_data_rows($por_pagar_m,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($por_pagar_m['summary'] as $key=>$por_cobrar)
	{
		$table_data_rows.=get_porpagar_data_row($por_cobrar,$controller);
	}
	
	if(count($por_pagar_m['summary'])==0)
	{
		$table_data_rows.="<tr><td colspan='7'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_por_cobrar_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_porpagar_data_row($por_pagar_m,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();
	$table_data_row='<tr>';
	$table_data_row.="<td width='1%'><input type='checkbox' id='por_pagar_m_$por_pagar_m[receiving_id]' value='".$por_pagar_m['receiving_id']."'/></td>";
	$table_data_row.='<td width="5%">'.anchor('receivings/receipt/'.$por_pagar_m['receiving_id'], 'RECV '.$por_pagar_m['receiving_id'], array('target' => '_blank')).'</td>';
	$table_data_row.='<td width="2%">'.character_limiter($por_pagar_m['receiving_date'],13).'</td>';
	$table_data_row.='<td width="9%">'.character_limiter($por_pagar_m['supplier_name'],13).'</td>';
	$table_data_row.='<td width="10%">'.character_limiter($por_pagar_m['payment_type'],65).'</td>';
	$table_data_row.='<td width="4%">'.to_currency($por_pagar_m['total']).'</td>';
	$table_data_row.='<td width="4%">'.to_currency($por_pagar_m['debe']).'</td>';
	$table_data_row.='<td width="6%">'. to_dia($por_pagar_m['mora']).'</td>';
	$table_data_row.='<td width="9%">'. $por_pagar_m['cuotas'].'</td>';
	$table_data_row.='<td width="2%">'.anchor($controller_name."/view/$por_pagar_m[receiving_id]/$por_pagar_m[payment_id]/".to_currency_no_money($por_pagar_m['debe'])."?width=$width", $CI->lang->line('common_abono'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_abonar')));		
	//Ver Resumen Pagos
	$table_data_row.='&nbsp;'.anchor($controller_name."/pay_details/$por_pagar_m[receiving_id]?width=$width", $CI->lang->line('common_det'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_view'))).'</td>';//inventory details	
	$table_data_row.='</tr>';
	
	return $table_data_row;
}





//Almacenes
function get_almacen_manage_table()
{
	$CI =& get_instance();
	$table='<table class="tabledist" id="sortable_table">';
	
	$headers = array('<input type="checkbox" id="select_all" />',
	$CI->lang->line('almacenes_nombre'),
	$CI->lang->line('almacenes_direccion'),
	$CI->lang->line('almacenes_utilidad'),
	'&nbsp');
	
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	//$table.=get_almacen_manage_table_data_rows($almacen,$controller);
	$table.='</tbody></table>';
	return $table;
}

function get_almacen_manage_table_data_rows($almacen,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($almacen->result() as $almaceno)
	{
		$table_data_rows.=get_almacen_data_row($almaceno,$controller);
	}
	
	if($almacen->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='4'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('common_no_persons_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_almacen_data_row($almacen,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();
	$height = $controller->get_form_height();

	$table_data_row='<tr>';
	$table_data_row.="<td width='5%'><input type='checkbox' id='almacen_$almacen->almacen_id' value='".$almacen->almacen_id."'/></td>";
	// $table_data_row.='<td width="5%">'.anchor('almacenes/edit/'.$almacen->almacen_id, $almacen->almacen_id, array('target' => '_blank')).'</td>';
	$table_data_row.='<td width="15%">'.character_limiter($almacen->nombre,13).'</td>';
	$table_data_row.='<td width="15%">'.character_limiter($almacen->direccion,45).'</td>';
	$table_data_row.='<td width="15%">'.to_currency_no_money($almacen->utilidad,7).'</td>';
	$table_data_row.='<td width="10%">'.anchor($controller_name."/view/$almacen->almacen_id?width=$width&height=$height", $CI->lang->line('common_edit'),array('class'=>'thickbox','title'=>$CI->lang->line($controller_name.'_update')));		
	
	$table_data_row.='</tr>';
	
	return $table_data_row;
}


//***************************************************************//
//******************  ECOMMERCE *********************************//
//***************************************************************//

/*
Gets the html table to manage ecommerce transactions.
*/
function get_ecommerce_manage_table()
{
	$CI =& get_instance();	
	
	$table='<table class="stripe row-border order-column dataTable no-footer DTFC_Cloned" id="sortable_table">';
	$headers = array('<input type="checkbox" id="select_all" />', 
	$CI->lang->line('market_fecha'),
	$CI->lang->line('market_usuario'),
	$CI->lang->line('market_detalle'),
	$CI->lang->line('market_monto'),
	$CI->lang->line('market_transaccion_id'),
	$CI->lang->line('market_estado'),
	$CI->lang->line('market_acciones'),
	);
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the ecommerce.
*/
function get_ecommerce_manage_table_data_rows($transactions,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($transactions->result() as $transaction)
	{
		$table_data_rows.=get_ecommerce_data_row($transaction,$controller);
	}
	
	if($transactions->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='11'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('items_no_items_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_ecommerce_data_row($item,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();
	$table_data_row='<tr>';
	$table_data_row.="<td width='1%'><input type='checkbox' id='item_$item->order_id' value='".$item->item_id."'/></td>";
	$table_data_row.='<td width="5%">'.$item->fecha_creacion.'</td>';
	$table_data_row.='<td width="25%">'.$item->usuario.'</td>';
	$table_data_row.='<td width="44%">'.$item->descripcion.'</td>';
	$table_data_row.='<td width="10%">'.to_currency($item->valor).'</td>';
	$table_data_row.='<td width="10%">'.$item->payment_id.'</td>';
	$table_data_row.='<td width="15%">'.$item->estado.'</td>';
	
	$table_data_row.='<td width="1" style=" padding-left: 0;padding-right: 2;">'.anchor($controller_name."/view/$item->payment_id?width=$width", $CI->lang->line('market_enviar_pedido'),array('class'=>'thickbox','title'=>$CI->lang->line('market_enviar_pedido'))).'</td>';		
	
	$table_data_row.='</tr>';
	return $table_data_row;
}


//***************************************************************//
//******************  LANZMIENTOS *******************************//
//***************************************************************//

/*
Gets the html table to manage lanzamientos.
*/
function get_lanzamientos_manage_table()
{
	$CI =& get_instance();	
	
	$table='<table class="stripe row-border order-column dataTable no-footer DTFC_Cloned" id="sortable_table">';
	$headers = array('<input type="checkbox" id="select_all" />', 
	$CI->lang->line('market_titulo'),
	$CI->lang->line('market_detalle'),
	$CI->lang->line('market_fecha'),
	$CI->lang->line('market_producto'),
	$CI->lang->line('market_estado'),
	$CI->lang->line('market_acciones'),
	);
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the lanzamiento.
*/
function get_lanzamiento_manage_table_data_rows($lanzamientos,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($lanzamientos->result() as $lanzamiento)
	{
		$table_data_rows.=get_lanzamiento_data_row($lanzamiento,$controller);
	}
	
	if($lanzamientos->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='11'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('items_no_items_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_lanzamiento_data_row($lanzamiento,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();
	$table_data_row='<tr>';
	$table_data_row.="<td><input type='checkbox' id='lanzamiento_$lanzamiento->lanzamiento_id' value='".$lanzamiento->lanzamiento_id."'/></td>";
	$table_data_row.='<td>'.$lanzamiento->titulo.'</td>';
	$table_data_row.='<td>'.$lanzamiento->detalle.'</td>';
	$table_data_row.='<td>'.$lanzamiento->fecha.'</td>';
	$table_data_row.='<td>'.$lanzamiento->producto.'</td>';
	$table_data_row.='<td>'.$lanzamiento->activo.'</td>';
	
	$table_data_row.='<td style=" padding-left: 0;padding-right: 2;">'.anchor($controller_name."/view/$lanzamiento->lanzamiento_id?width=$width", $CI->lang->line('market_editar_lanzamiento'),array('class'=>'thickbox','title'=>$CI->lang->line('market_editar_lanzamiento'))).'</td>';		
	
	$table_data_row.='</tr>';
	return $table_data_row;
}

//***************************************************************//
//******************  BLOG *******************************//
//***************************************************************//

/*
Gets the html table to manage blog.
*/
function get_blog_manage_table()
{
	$CI =& get_instance();	
	
	$table='<table class="stripe row-border order-column dataTable no-footer DTFC_Cloned" id="sortable_table">';
	$headers = array('<input type="checkbox" id="select_all" />', 
	$CI->lang->line('articulos_titulo'),
	$CI->lang->line('market_usuario'),
	$CI->lang->line('market_fecha'),
	$CI->lang->line('market_acciones'),
	);
	$table.='<thead><tr>';
	foreach($headers as $header)
	{
		$table.="<th>$header</th>";
	}
	$table.='</tr></thead><tbody>';
	$table.='</tbody></table>';
	return $table;
}

/*
Gets the html data rows for the blog.
*/
function get_blog_manage_table_data_rows($blog,$controller)
{
	$CI =& get_instance();
	$table_data_rows='';
	
	foreach($blog->result() as $blg)
	{
		$table_data_rows.=get_blog_data_row($blg,$controller);
	}
	
	if($blog->num_rows()==0)
	{
		$table_data_rows.="<tr><td colspan='11'><div class='warning_message' style='padding:7px;'>".$CI->lang->line('items_no_items_to_display')."</div></tr></tr>";
	}
	
	return $table_data_rows;
}

function get_blog_data_row($articulo,$controller)
{
	$CI =& get_instance();
	$controller_name=$CI->uri->segment(1);
	$width = $controller->get_form_width();
	$table_data_row='<tr>';
	$table_data_row.="<td><input type='checkbox' id='articulo_$articulo->articulo_id' value='".$articulo->articulo_id."'/></td>";
	$table_data_row.='<td>'.$articulo->titulo.'</td>';
	$table_data_row.='<td>'.$articulo->detalle.'</td>';
	$table_data_row.='<td>'.$articulo->fecha.'</td>';
	$table_data_row.='<td>'.$articulo->producto.'</td>';
	$table_data_row.='<td>'.$articulo->activo.'</td>';
	
	$table_data_row.='<td style=" padding-left: 0;padding-right: 2;">'.anchor($controller_name."/view/$articulo->articulo_id?width=$width", $CI->lang->line('market_editar_articulo'),array('class'=>'thickbox','title'=>$CI->lang->line('market_editar_articulo'))).'</td>';		
	
	$table_data_row.='</tr>';
	return $table_data_row;
}
?>