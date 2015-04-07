<?php
require_once ("person_controller.php");
class Employees extends Person_controller
{
	function __construct()
	{
		parent::__construct('employees');
	}
	
	function index()
	{
		$data['controller_name']=strtolower($this->uri->segment(1));
		$data['form_width']=$this->get_form_width();
		$data['manage_table']=get_people_manage_table($this->Employee->get_all(),$this);
		$this->load->view('people/manage',$data);
	}
	
	/*
	Returns employee table data rows. This will be called with AJAX.
	*/
	function search()
	{
		$search=$this->input->post('search');
		$data_rows=get_people_manage_table_data_rows($this->Employee->search($search),$this);
		echo $data_rows;
	}
	
	/*
	Gives search suggestions based on what is being searched for
	*/
	function suggest()
	{
		$suggestions = $this->Employee->get_search_suggestions($this->input->post('q'),$this->input->post('limit'));
		echo implode("\n",$suggestions);
	}
	
	/*
	Loads the employee edit form
	*/
	function view($employee_id=-1)
	{
		$data['person_info']=$this->Employee->get_info($employee_id);
		$data['all_modules']=$this->Module->get_all_modules();
		$this->load->view("employees/form",$data);
	}
	
	/*
	Inserts/updates an employee
	*/
	function save($employee_id=-1)
	{
		$person_data = array(
		'first_name'=>$this->input->post('first_name'),
		'last_name'=>$this->input->post('last_name'),
		'email'=>$this->input->post('email'),
		'phone_number'=>$this->input->post('phone_number'),
		'address_1'=>$this->input->post('address_1'),
		'address_2'=>$this->input->post('address_2'),
		'city'=>$this->input->post('city'),
		'state'=>$this->input->post('state'),
		'zip'=>$this->input->post('zip'),
		'country'=>$this->input->post('country'),
		'comments'=>$this->input->post('comments')
		);
		$permission_data = $this->input->post("permissions")!=false ? $this->input->post("permissions"):array();
		
		//Password has been changed OR first time password set
		if($this->input->post('password')!='')
		{
			$employee_data=array(
			'username'=>$this->input->post('username'),
			'password'=>md5($this->input->post('password'))
			);
		}
		else //Password not changed
		{
			$employee_data=array('username'=>$this->input->post('username'));
		}
		
		if ($_SERVER['HTTP_HOST'] == 'demo.phppointofsale.com' && $employee_id == 1)
		{
			//failure
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('employees_error_updating_demo_admin').' '.
			$person_data['first_name'].' '.$person_data['last_name'],'person_id'=>-1));
		}
		elseif($this->Employee->save($person_data,$employee_data,$permission_data,$employee_id))
		{
			//New employee
			if($employee_id==-1)
			{
				echo json_encode(array('success'=>true,'message'=>$this->lang->line('employees_successful_adding').' '.
				$person_data['first_name'].' '.$person_data['last_name'],'person_id'=>$employee_data['person_id']));
			}
			else //previous employee
			{
				echo json_encode(array('success'=>true,'message'=>$this->lang->line('employees_successful_updating').' '.
				$person_data['first_name'].' '.$person_data['last_name'],'person_id'=>$employee_id));
			}
		}
		else//failure
		{	
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('employees_error_adding_updating').' '.
			$person_data['first_name'].' '.$person_data['last_name'],'person_id'=>-1));
		}
	}
	
	/*
	This deletes employees from the employees table
	*/
	function delete()
	{
		$employees_to_delete=$this->input->post('ids');
		
		if ($_SERVER['HTTP_HOST'] == 'demo.phppointofsale.com' && in_array(1,$employees_to_delete))
		{
			//failure
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('employees_error_deleting_demo_admin')));
		}
		elseif($this->Employee->delete_list($employees_to_delete))
		{
			echo json_encode(array('success'=>true,'message'=>$this->lang->line('employees_successful_deleted').' '.
			count($employees_to_delete).' '.$this->lang->line('employees_one_or_multiple')));
		}
		else
		{
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('employees_cannot_be_deleted')));
		}
	}
	
	/**
	 * Display form: Import data from an excel file
	 * @author: Nguyen OJB, Mario T.
	 * @since: 10.1
	 */
	function excel_import()
	{
		$this->load->view("employees/excel_import", null);
	}

	/**
	 * Read data from excel file -> save it to databse
	 * @author: Nguyen OJB, Mario T.
	 * @since: 10.1
	 */
	function do_excel_import()
	{
		$msg = "do_excel_import";
		$failCodes = null;
		$successCode = null;
		if ($_FILES['file_path']['error']!=UPLOAD_ERR_OK)
		{
			$msg = $this->lang->line('items_excel_import_failed');
			echo json_encode( array('success'=>false,'message'=>$msg) );
			return ;
		}
		else
		{
		try
		{
			$this->load->library('spreadsheetexcelreader');
			$this->spreadsheetexcelreader->store_extended_info = false;
			$success = $this->spreadsheetexcelreader->read($_FILES['file_path']['tmp_name']);

			$rowCount = $this->spreadsheetexcelreader->rowcount(0);
			if($rowCount > 2){
				for($i = 3; $i<=$rowCount; $i++){
					$user_name = $this->spreadsheetexcelreader->val($i, 'A');
					$employee_id = $this->Employee->get_employee_id($user_name);
					if($employee_id <> false)
					{
						$failCodes[] = $this->spreadsheetexcelreader->val($i, 'A');
						continue;
					}
					$employee_data = array(
					'username' => $user_name,
					'password' => md5($this->spreadsheetexcelreader->val($i, 'B'))
					);
					$person_data = array(
					'first_name'			=>	$this->spreadsheetexcelreader->val($i, 'C'),
					'last_name'	=>	$this->spreadsheetexcelreader->val($i, 'D'),
					'phone_number'		=>	$this->spreadsheetexcelreader->val($i, 'E'),
					'email'	=>	$this->spreadsheetexcelreader->val($i, 'F'),
					'address_1'	=>	$this->spreadsheetexcelreader->val($i, 'G'),
					'address_2'	=>	$this->spreadsheetexcelreader->val($i, 'H'),
					'city'		=>	$this->spreadsheetexcelreader->val($i, 'I'),
					'state'		=>	$this->spreadsheetexcelreader->val($i, 'J'),
					'zip'		=>	$this->spreadsheetexcelreader->val($i, 'K'),
					'country'		=>	$this->spreadsheetexcelreader->val($i, 'L'),
					'comments'		=>	$this->spreadsheetexcelreader->val($i, 'M')
					);
					$permissions = null;
					if($this->Employee->save($person_data,$employee_data,$permissions,false)) {
					}
					else//insert or update item failure
					{
						$failCodes[] = $this->spreadsheetexcelreader->val($i, 'A');
						//echo json_encode( array('success'=>true,'message'=>'Your upload file has no data or not in supported format.') );
					}
				}
			} else {
				// rowCount < 2
				echo json_encode( array('success'=>true,'message'=>'Your upload file has no data or not in supported format.') );
				return;
			}
		} catch (Exception $e) {
				//echo 'Caught exception: ',  $e->getMessage(), "\n";
				// echo json_encode( array('success'=>false,'message'=>$e->getMessage()) );
				echo json_encode( array('success'=>false,'message'=>'vamos') );
				break;
				}
		}

		$success = true;
		if(count($failCodes) > 1){
			$msg = "Most suppliers imported. But some were not, here is list of their CODE (" .count($failCodes) ."): ".implode(", ", $failCodes);
			$success = false;
		}else{
			$msg = "Import suppliers successful";
		}

		echo json_encode( array('success'=>$success,'message'=>$msg) );
	}
	
	/*
	get the width for the add/edit form
	*/
	function get_form_width()
	{
		return 650;
	}
}
?>