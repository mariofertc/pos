<?php
require_once ("secure_area.php");
//require_once ("interfaces/idata_controller.php");
class Almacenes extends Secure_area
{
	function __construct()
	{
		parent::__construct('almacenes');
		//$this->Sale->create_sales_items_temp_table();
		//$this->load->library('sale_lib');
	}

	function index()
	{
		//$this->_reload();
		// $this->output->enable_profiler(TRUE);
		$data['controller_name']=strtolower($this->uri->segment(1));
		$data['form_width']=$this->get_form_width();
		$data['manage_table']=get_almacen_manage_table($this->Almacen->get_all(),$this);
		$this->load->view('almacenes/manage',$data);
	}

	
	function save($almacen_id)
	{
		$almacen_data = array(
			'nombre' => $this->input->post('nombre'),
			'direccion' => $this->input->post('direccion'),
			'utilidad' => $this->input->post('utilidad')
		);
		
		if ($this->Almacen->save($almacen_data, $almacen_id))
		{
			echo json_encode(array('success'=>true,'message'=>$this->lang->line('porpagar_successfully_updated'),'almacen_id'=>$almacen_id));
		}
		else
		{
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('porpagar_unsuccessfully_updated')));
		}
	}	

	function view($almacen_id=-1)
	{
		$data['almacen_info']=$this->Almacen->get_info($almacen_id);
		$this->load->view("almacenes/form",$data);
	}
	
	
	/*
	get the width for the add/edit form
	*/
	function get_form_width()
	{
		return 360;
	}
	
	function search()
	{
		$search=$this->input->post('search');
		$data_rows=get_almacen_manage_table_data_rows($this->Almacen->search($search),$this);
		echo $data_rows;
	}
	
	function get_row()
	{
		$almacen_id = $this->input->post('row_id');
		$data_row=get_almacen_data_row($this->Almacen->get_info($almacen_id),$this);
		echo $data_row;
	}
	
	function delete()
	{
		$almacenes_to_delete=$this->input->post('ids');
		
		if($this->Almacen->delete_list($almacenes_to_delete))
		{
			echo json_encode(array('success'=>true,'message'=>$this->lang->line('suppliers_successful_deleted').' '.
			count($almacenes_to_delete).' '.$this->lang->line('almacenes_one_or_multiple')));
		}
		else
		{
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('suppliers_cannot_be_deleted')));
		}
	}
	function suggest()
	{
		$suggestions = $this->Almacen->get_search_suggestions($this->input->post('q'),$this->input->post('limit'));
		echo implode("\n",$suggestions);
	}
	
}
?>