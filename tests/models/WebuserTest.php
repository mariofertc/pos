<?php

/**
 * @group Model
 */
class WebuserTest extends CIUnit_TestCase
{
	protected $tables = array(
		'phppos_webusers'		 => 'phppos_webusers',
	);
	
	private $_pcm;

	public function __construct($name = NULL, array $data = array(), $dataName = '')
	{
		parent::__construct($name, $data, $dataName);
	}
	
	public function setUp()
	{
	//	$this->CI->db->query("set foreign_key_checks=0");
	//	parent::setUp();
		
		$this->CI->load->model('webuser');
		$this->_pcm = $this->CI->webuser;
	}

	public function tearDown()
	{
	//	$this->CI->db->query("set foreign_key_checks=1");
	//	parent::tearDown();
	}

	public function testSave(){
		$person_data=array(
			'nombre'=>'Jaime',
			'apellido'=>'Santana',
			'email'=>'tester@test.com',
			'password'=>md5('12345678'),
			);
		
		$resultado = $this->_pcm->save($person_data);
		$this->assertFalse($resultado['error']);
	}

	public function testSaveDuplicate(){
		$person_data=array(
			'nombre'=>'Jaime',
			'apellido'=>'Santana',
			'email'=>'tester@test.com',
			'password'=>md5('12345678'),
			);
		
		$resultado = $this->_pcm->save($person_data);
		$this->assertTrue($resultado['error']);
	}


	public function testExists(){
		$id = 2;
		$respuesta = $this->_pcm->exists($id);
		$this->assertTrue($respuesta);
	}

	public function testNoExists(){
		$id = 666;
		$respuesta = $this->_pcm->exists($id);
		$this->assertFalse($respuesta);
	}
	/*
	public function testLogin(){
		$user="administrator";
		$pass='.abcd1234';

		$resultado = $this->_pcm->login($user,$pass);
		$this->assertTrue($resultado);
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
*/
}
