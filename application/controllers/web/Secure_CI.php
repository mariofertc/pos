<?php
class Secure_CI extends CI_Controller 
{
	public $user;

	function __construct()
	{
		parent::__construct();	
		if(!$this->webuser->is_logged())
		{
			redirect(site_url('web/market/login'));
		}else{
			$this->user = $this->session->userdata('webuser_data');
		     $this->twiggy->set('webuser_data',$this->session->userdata('webuser_data'));
		}
	}
}