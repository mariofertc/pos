<?php

/**
 * @group Model
 */

class ActividadTest extends CIUnit_TestCase
{
	protected $tables = array(
		'actividades'		 => 'actividades',
		//'user'		  => 'user',
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
		
		$this->CI->load->model('actividad');
		$this->_pcm = $this->CI->actividad;
	}

	public function tearDown()
	{
		$this->CI->db->query("set foreign_key_checks=1");
		parent::tearDown();
	}

	public function testGetAll()
	{
		$actual = $this->_pcm->get_all();
		$this->assertEquals(5, count($actual));
	}

	public function testGetEstadoActividad()
	{
		$ID_actividad=1;

		$actual = $this->_pcm->get_estado($ID_actividad);
		print_r($actual);
		$this->assertEquals(1, $actual);
	}

	public function testFailGetEstadoActividad()
	{
		$ID_actividad=1;

		$actual = $this->_pcm->get_estado($ID_actividad);
		print_r($actual);
		$this->assertNotEquals(2, $actual);
	}

	public function testFailGetEstadoActividadNoExistente()
	{
		$ID_actividad=7;

		$actual = $this->_pcm->get_estado($ID_actividad);
		print_r($actual);
		$this->assertEquals(-1, $actual);
	}


}
