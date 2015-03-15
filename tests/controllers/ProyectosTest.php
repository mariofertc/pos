<?php

/**
 * @group Controller
 */

class ProyectosTest extends CIUnit_TestCase
{

	
	public function setUp()
	{
		// Set the tested controller
		$this->CI = set_controller('proyectos');
	}
	

	public function tearDown()
	{

	}	

	public function testSaveInserting(){
		$_POST['nick']='testing_proyect';
		$_POST['nombre']='Testing Proyect';
		$_POST['descripcion']='descripcion de prueba';
		$_POST['fecha_inicio']=date("Y-m-d H:i:s");
		$_POST['fecha_fin']=date("Y-m-d H:i:s");
		$_POST['presupuesto']=0;
		$_POST['visibilidad']=1;//privado
		
		ob_start();
		$this->CI->save();
		$out=ob_get_clean();
		
		$res = json_decode($out);
		$this->assertFalse($res->error);
		$this->assertSame('TODO BIEN',$res->message);	
		return $res->proyecto_id;
	}

	/**
	 * @depends testSaveInserting
	 **/
	public function testSaveUpdating(){
		$ID = func_get_args();

		$_POST['ID']=$ID[0];
		$_POST['nick']='testing_proyect';
		$_POST['nombre']='Tested Proyect';
		$_POST['descripcion']='descripcion de prueba';
		$_POST['fecha_inicio']=date("Y-m-d H:i:s");
		$_POST['fecha_fin']=date("Y-m-d H:i:s");
		$_POST['presupuesto']=500;
		$_POST['visibilidad']=1;//privado

		ob_start();
		$this->CI->save();
		$out=ob_get_clean();

		$res = json_decode($out);
		$this->assertFalse($res->error);
		$this->assertSame('TODO BIEN',$res->message);	
	}

	/**
	 *	@depends testSaveUpdating
	 **/
	public function testDeleting(){
		$ID = func_get_args();

		ob_start();
		$this->CI->delete($ID[0]);
		$out=ob_get_clean();

		$res = json_decode($out);

		$this->assertFalse($res->error);
		$this->assertSame('TODO BIEN',$res->message);	
	}

}
