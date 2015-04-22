<?php

/**
 * @group Model
 */

class CustomerTest extends CIUnit_TestCase
{
	protected $tables = array(
		'phppos_employees'		 => 'phppos_customers',
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
	//	$this->CI->db->query("set foreign_key_checks=0");
		parent::setUp();
		
		$this->CI->load->model('customer');
		$this->_pcm = $this->CI->customer;
	}

	public function tearDown()
	{
	//	$this->CI->db->query("set foreign_key_checks=1");
		parent::tearDown();
	}

	public function testSave(){
		$person_data=array(
			'person_id'=>2,
			'first_name'=>'tester',
			'last_name'=>'one',
			'phone_number'=>'000000000',
			'email'=>'test@test.com',
			'address_1'=>'home',
			'address_2'=>'home2',
			'city'=>'here',
			'state'=>'here',
			'country'=>'EC',
			'comments'=>'testing'
			);
		$employee_data=array(
			'username'=>'tester',
			'password'=>md5('.abcd1234')
			);
		$permisos=array();
		$data=array_merge($person_data,$employee_data);

		$resultado = $this->_pcm->save($person_data,$employee_data,$permisos,false);
		$this->assertTrue($resultado);
		return $resultado;
	}

	public function testLogin(){
		$user="administrator";
		$pass='.abcd1234';

		$resultado = $this->_pcm->login($user,$pass);
		$this->assertTrue($resultado);
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
		$this->assertCount(1, $respuesta->result());
	}


	public function testgetInfo(){
		$id = 1;
		$res = $this->_pcm->get_info($id);
		$this->assertEquals(1, count($res));
		$this->assertEquals("administrator", $res->username);
	}

	public function testEmptygetInfo(){
		$id = 666;
		$res = $this->_pcm->get_info($id);
		$this->assertTrue(!empty($res));
		$this->assertEmpty($res->username);
	}

}
