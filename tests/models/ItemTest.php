<?php

/**
 * @group Model
 */

class ItemTest extends CIUnit_TestCase
{
	protected $tables = array(
		'phppos_items'		 => 'phppos_items',
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
		
		$this->CI->load->model('item');
		$this->_pcm = $this->CI->item;
	}

	public function tearDown()
	{
	//	$this->CI->db->query("set foreign_key_checks=1");
		parent::tearDown();
	}

	public function testSave(){
		$item_date=array(
			'name'=>'producto TEST',
			'category'=>'categoria TEST',
			//'item_number'=>'number',
			'description'=>'descripcion',
			'cost_price'=>4,
			'unit_price'=>5,
			'quantity'=>500,
			'reorder_level'=>3
			);
		
		$resultado = $this->_pcm->save($item_date,false);
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

	public function testgetInfo(){
		$id = 1;
		$res = $this->_pcm->get_info($id);
		$this->assertEquals(1, count($res));
		$this->assertEquals("producto A", $res->name);
	}

	public function testEmptygetInfo(){
		$id = 666;
		$res = $this->_pcm->get_info($id);
		$this->assertTrue(!empty($res));
		$this->assertEmpty($res->name);
	}

	public function testGetCategories(){
		$res = $this->_pcm->get_categories();
		$this->assertNotNull($res->result());	
		$this->assertCount(2,$res->result());	
	}

	public function testGetCountCategories(){
		$res = $this->_pcm->get_count_column();
		$this->assertNotNull($res->result());	
	}

	public function testGelAll(){
		$res = $this->_pcm->get_all(2,0,array());
		$this->assertNotNull($res);	
		$this->assertCount(2,$res);	
	}

	public function testGetLimitesPrecios(){
		$res = $this->_pcm->get_limites_precios();
		$this->assertNotNull($res);	
		$this->assertEquals(10,$res->minimo);
		$this->assertEquals(100,$res->maximo);
	}
}
