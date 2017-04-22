<?php

/**
 * @group Model
 */

class CustomerTest extends CIUnit_TestCase
{
	protected $tables = array(
		'phppos_customers'		 => 'phppos_customers',
		'phppos_people'		  => 'phppos_people',
		//'user_group'	=> 'user_group'
	);
	
	private $_pcm;

	public function __construct($name = NULL, array $data = array(), $dataName = '')
	{
		parent::__construct($name, $data, $dataName);
	}
	
	public function setUp()
	{
		$this->CI->db->query("set foreign_key_checks=0");
		parent::setUp();
		
		$this->CI->load->model('customer');
		$this->_pcm = $this->CI->customer;
	}

	public function tearDown()
	{
		$this->CI->db->query("set foreign_key_checks=1");
		parent::tearDown();
	}

	public function testSave(){
		$person_data=array(
			'first_name'=>'customer',
			'last_name'=>'customer',
			'phone_number'=>'000000000',
			'email'=>'customer@test.com',
			'address_1'=>'customer',
			'address_2'=>'customer',
			'city'=>'customer',
			'state'=>'customer',
			'country'=>'EC',
			'comments'=>'customer'
			);
		$ucstomer_data=array(
			'account_number'=>'123456789',
			'taxable'=>0
			);

		$resultado = $this->_pcm->save($person_data,$ucstomer_data,false);
		$this->assertTrue($resultado);
		return $resultado;
	}


	public function testExists(){
		$id = 1;
		$respuesta = $this->_pcm->exists($id);
		$this->assertTrue($respuesta);
	}

	public function testNoExists(){
		$id = 666;
		$respuesta = $this->_pcm->exists($id);
		$this->assertFalse($respuesta);
	}

	public function testGetAll()
	{
		$respuesta = $this->_pcm->get_all();
		$this->assertCount(0, $respuesta);
	}


	public function testgetInfo(){
		//Inserto un customer, agregado al amdin es de ID=2
		$this->testSave();

		$res = $this->_pcm->get_info(2);
		$this->assertEquals(1, count($res));
		$this->assertEquals("customer", $res->first_name);
	}

	public function testEmptygetInfo(){
		$id = 666;
		$res = $this->_pcm->get_info($id);
		$this->assertTrue(!empty($res));
		$this->assertEmpty($res->first_name);
	}

}
