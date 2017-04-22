<?php

/**
 * @group Model
 */

class ProductReviewTest extends CIUnit_TestCase
{
	protected $tables = array(
		'phppos_product_reviews'		 => 'phppos_product_reviews',
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
		
		$this->CI->load->model('product_review');
		$this->_pcm = $this->CI->product_review;
	}

	public function tearDown()
	{
		$this->CI->db->query("set foreign_key_checks=1");
		parent::tearDown();
	}

	public function testSave(){
		$person_data=array(
			'nombre'=>'tester',
			'email'=>'tester@test.com',
			'rating'=>5,
			'detalle'=>'detalle',
			'item'=>'1'
			);
				
		$resultado = $this->_pcm->save($person_data);
		$this->assertFalse($resultado['error']);
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

	public function testgetInfo(){
		//Inserto un customer, agregado al amdin es de ID=2
		$this->testSave();

		$res = $this->_pcm->get_info(2);
		$this->assertEquals(1, count($res));
		$this->assertEquals("tester", $res->nombre);
	}

}
