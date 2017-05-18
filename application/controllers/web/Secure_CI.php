<?php
class Secure_CI extends CI_Controller 
{
	public $user;

	function __construct()
	{
		parent::__construct();	
		if(!$this->Customer->is_logged_in())
		{
			if($this->input->is_ajax_request()){
				echo json_encode(array('error'=>TRUE,'msg'=>site_url('web/market/loger/true'))); 
				exit;
			}else{
				//if(get_class($this) == "Store");

				//redirect(site_url('web/market/loger'));
				redirect(site_url('web/market/loger?module='.get_class($this)));
			}
		}else{
			$customer_id = $this->session->userdata('customer_id');
	        if(isset($customer_id)){
				$this->user = $this->Customer->get_logged_in_customer_info();
		    	$this->twiggy->set('webuser_data',$this->user);
	        }
		}
	}
}