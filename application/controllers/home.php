<?php
require_once ("secure_area.php");
class Home extends Secure_area 
{
	function __construct()
	{
		parent::__construct();	
	}
	
	function index()
	{
	// $this->output->enable_profiler(TRUE);
		$this->load->view("home");
	}
	
	function logout()
	{
		$this->Employee->logout();
	}
}
?>