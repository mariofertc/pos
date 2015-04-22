<?php
class Secure_CI extends CI_Controller 
{
	public $user;

	function __construct()
	{
		parent::__construct();	
		if(!$this->webuser->is_logged())
		{
			if($this->input->is_ajax_request()){
				echo json_encode(array('error'=>TRUE,'msg'=>site_url('web/market/loger/true'))); 
				exit;
			}else{
				redirect(site_url('web/market/loger'));
			}
		}else{
			$this->user = $this->session->userdata('webuser_data');
		    $this->twiggy->set('webuser_data',$this->session->userdata('webuser_data'));
		}
	}
}