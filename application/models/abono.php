<?php
class Abono extends CI_Model
{
	public function get_info($abono_id)
	{
		$this->db->from('abonos');
		$this->db->where('abono_id',$abono_id);
		return $this->db->get();
	}
	
	public function get_abonos($sale_id)
	{
		$this->db->from('abonos');
		$this->db->where('sale_id',$sale_id);
		return $this->db->get();
	}

	function exists($sale_id)
	{
		$this->db->from('sales');
		$this->db->where('sale_id',$sale_id);
		$query = $this->db->get();

		return ($query->num_rows()==1);
	}

	function update($sale_data, $sale_id)
	{
		$this->db->where('sale_id', $sale_id);
		$success = $this->db->update('sales',$sale_data);
		
		return $success;
	}
	
	function save ($abonos_data,$sale_id=false)
	{
		if(count($abonos_data)==0)
			return -1;

		//Run these queries as a transaction, we want to make sure we do all or nothing
		$this->db->trans_start();

		$this->db->insert('abonos',$abonos_data);
		$abono_id = $this->db->insert_id();
		$this->db->trans_complete();
		
		if ($this->db->trans_status() === FALSE)
		{
			return -1;
		}
		
		return $abono_id;
	}
	
	function delete($sale_id)
	{
		//Run these queries as a transaction, we want to make sure we do all or nothing
		$this->db->trans_start();
		
		$this->db->delete('sales_payments', array('sale_id' => $sale_id)); 
		$this->db->delete('sales_items_taxes', array('sale_id' => $sale_id)); 
		$this->db->delete('sales_items', array('sale_id' => $sale_id)); 
		$this->db->delete('sales', array('sale_id' => $sale_id)); 
		
		$this->db->trans_complete();
				
		return $this->db->trans_status();
	}

	function get_sale_items($sale_id)
	{
		$this->db->from('sales_items');
		$this->db->where('sale_id',$sale_id);
		return $this->db->get();
	}

	function get_sale_payments_old($sale_id)
	{
		$this->db->from('sales_payments');
		$this->db->where('sale_id',$sale_id);
		return $this->db->get();
	}
	
	function get_sale_payments($sale_id)
	{
		$this->db->select('sales_payments.payment_amount, payments.payment_type, payments.payment_id');
		$this->db->from('payments');
		$this->db->join('sales_payments','sales_payments.payment_id = payments.payment_id');
		//$this->db->join('people', 'people.person_id = suppliers.person_id');
		$this->db->where('sales_payments.sale_id',$sale_id);
		return $this->db->get();
	}

	function get_customer($sale_id)
	{
		$this->db->from('sales');
		$this->db->where('sale_id',$sale_id);
		return $this->Customer->get_info($this->db->get()->row()->customer_id);
	}
	
	/*
	Returns all the items
	*/
	function get_all()
	{
		//return $data = array();
//		$this->db->select('sales_items_temp.sale_id, sale_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(customer.first_name," ",customer.last_name) as customer_name, sum(total) as total, sales_items_temp.payment_type, comment, sum(sp.payment_amount)-sum(abono_sale.abono_amount) as debe', false);
		$this->db->select('sp.payment_id,sales_items_temp.sale_id, sale_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(customer.first_name," ",customer.last_name) as customer_name, sum(total) as total, sales_items_temp.payment_type, comment, 0 as debe, customer.person_id', false);
		$this->db->from('sales_items_temp');
		$this->db->join('people as employee', 'sales_items_temp.employee_id = employee.person_id');
		$this->db->join('people as customer', 'sales_items_temp.customer_id = customer.person_id', 'left');
		$this->db->join('sales_payments as sp', 'sp.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		//$this->db->join('payments as p1', 'sp.payment_id = p1.payment_id', 'left outer');
		$this->db->join('payments as p', 'p.payment_id = sp.payment_id');
		$this->db->join('sales_payments as sp2', 'sp2.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		
		 //$this->db->join('abonos as abono_sale', 'sp.sale_id = abono_sale.sale_id', 'left outer');
		 //$this->db->join('abonos as abono_payment', 'sp.payment_id = abono_payment.payment_id', 'left outer');
		 
		$this->db->where('p.por_cobrar = 1');
		$this->db->group_by('sales_items_temp.sale_id');
		$this->db->order_by('sales_items_temp.sale_id');

		$data = array();
		$data['summary'] = $this->db->get()->result_array();
		
		$this->get_payment_abonos($data);
		return $data;
	}
	
	
	function get_sale($sale_id)
	{
		$this->db->select('sp.payment_id,sales_items_temp.sale_id, sale_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(customer.first_name," ",customer.last_name) as customer_name, sum(total) as total, sales_items_temp.payment_type, comment, 0 as debe', false);
		$this->db->from('sales_items_temp');
		$this->db->join('people as employee', 'sales_items_temp.employee_id = employee.person_id');
		$this->db->join('people as customer', 'sales_items_temp.customer_id = customer.person_id', 'left');
		$this->db->join('sales_payments as sp', 'sp.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->join('payments as p', 'p.payment_id = sp.payment_id');
		$this->db->join('sales_payments as sp2', 'sp2.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->where('p.por_cobrar = 1');
		$this->db->where('sales_items_temp.sale_id = ' . $sale_id);
		$this->db->group_by('sales_items_temp.sale_id');
		$this->db->order_by('sales_items_temp.sale_id');

		$data = array();
		$data['summary'] = $this->db->get()->result_array();
		
		//Hasta aqui.
		$this->get_payment_abonos($data);
		return $data['summary'][0];
	}
	
	function search($search, $search_id = 0)
	{
		$this->db->select('sp.payment_id,sales_items_temp.sale_id, sale_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(customer.first_name," ",customer.last_name) as customer_name, sum(total) as total, sales_items_temp.payment_type, comment, 0 as debe, customer.person_id,'.
		'null as mora, null as cuotas', false);
		$this->db->from('sales_items_temp');
		$this->db->join('people as employee', 'sales_items_temp.employee_id = employee.person_id');
		$this->db->join('people as customer', 'sales_items_temp.customer_id = customer.person_id', 'left');
		$this->db->join('sales_payments as sp', 'sp.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->join('payments as p', 'p.payment_id = sp.payment_id');
		$this->db->join('sales_payments as sp2', 'sp2.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->where("p.por_cobrar = 1");
		if($search_id != 0)
		{
			$this->db->where("customer.person_id", $search_id);
		}
		else if($search)
		{
			$this->db->where("(trim(customer.first_name) LIKE '%".$this->db->escape_like_str($search)."%' or 
			trim(customer.last_name) LIKE '%".$this->db->escape_like_str($search)."%' or 
			CONCAT(trim(customer.first_name),' ',trim(customer.last_name)) LIKE '%".$this->db->escape_like_str($search)."%')");
		}
		
		$this->db->group_by('sales_items_temp.sale_id');
		$this->db->order_by("customer.last_name", "asc");

		$data = array();
		//return $this->db->get();
		$data['summary'] = $this->db->get()->result_array();
		$this->get_payment_abonos($data);
		return $data;
	}
	
	function get_payment_abonos(&$data)
	{
		//Hasta aqui.
		$data['abonos'] = array();
		$data['payments'] = array();
		foreach($data['summary'] as $key=>$value)
		{			
			$this->db->select('sales_payments.payment_id, payments.payment_type,sales_payments.payment_amount, sales_payments.sale_id, por_cobrar, '.
			'payments.have_plazo, payments.payment_days, payments.payment_months, payments.share, sale_date', false);
			$this->db->from('sales_items_temp');
			$this->db->join('sales_payments','sales_payments.sale_id=sales_items_temp.sale_id');
			$this->db->join('payments','payments.payment_id=sales_payments.payment_id');
			$this->db->where('sales_payments.sale_id = '.$value['sale_id']);
			$this->db->where('por_cobrar = 1');
			$this->db->group_by('sales_payments.sale_id');
			$this->db->group_by('payment_id');
			$data['payments'][$key] = $this->db->get()->result_array();
			$tot_pagado = 0;
			$tot_debe = 0;
			foreach($data['payments'][$key] as $pkey=>$pvalue)
			{
			 $this->db->select('abono_id,abono_amount,abono_type,abono_comment,abono_time');
			 $this->db->from('sales_items_temp');
			 $this->db->join('abonos', 'sales_items_temp.sale_id = abonos.sale_id');
			 $this->db->where('abonos.payment_id = '.$pvalue['payment_id']);
			 $this->db->where('abonos.sale_id = '.$value['sale_id']);
			 $this->db->group_by('abono_id');
			 $data['abonos'][$key] = $this->db->get()->result_array();
			 $esDia = false;
			 $cuotas = 0;
			 //Si tiene Plazo, comparar con la fecha de pago.
			 if($pvalue['have_plazo'])
			 {
			 }
			 else
			 {	//Si tiene Plazo fijo.
				if($pvalue['payment_days']>0)
				{
					$esDia = true;
				}
				$cuotas = $pvalue['share'];
			 }
			 foreach($data['abonos'][$key] as $akey=>$avalue)
			 {
			  $tot_pagado += $avalue['abono_amount'];
			 }
			 $tot_debe += $pvalue['payment_amount'];
			 $dateSale = strtotime($pvalue['sale_date']);
			 $dateHoy = time();
			{
				//Moroso
				$i  = 0;
				$valorCuota = $tot_debe/$cuotas;
				$aux=$tot_pagado;
				$det = '';
				$cuo = '';
				$datePago = $dateSale;
				while($i<$cuotas)
				{	
					$diasVencidos = 0;
					if($esDia)
					{
						$datePago = strtotime('+'.$pvalue['payment_days'].' day',$datePago);
					}
					else
					{
						$datePago = strtotime('+'.$pvalue['payment_months'].' month',$datePago);
					}
					//Sale del ciclo, porque todavía no ha pagado y no le toca pagar.
					if($datePago>$dateHoy and $valorCuota>$aux)
						break;
					//Sigue en el ciclo, porque ya ha pagado (calcula cuotas pagadas) o le toca pagar (calculo cuotas mora).
					if($valorCuota<=$aux)
					{
						$aux -= $valorCuota;
						$cuo .= ($i + 1) . ' Pagada '.to_currency($valorCuota).'<br>';
					}
					else if($datePago<=$dateHoy)
					{	
						if($aux>0)
							$aux -= $valorCuota;
						else
							$aux = 0;
						//Días impagos.
						$diasVencidos += ($dateHoy-$datePago)!=0?floor(($dateHoy-$datePago)/60/60/24):0;
						// $det .= $diasVencidos.'días mora. Cuota '. ($i + 1) . ' Por Pagar. Valor='.$valorCuota.'<br>';
						$det .= $diasVencidos;
						$cuo .= ($i + 1) . ' Impago '.to_currency(($aux==0)?$valorCuota:abs($aux)).'<br>';
					}
					$i++;
				}
			}
			 // $data['summary'][$key]['mora']=date('Y-m-d',$dateSale).'yo'.date('Y-m-d',$datePago).'-'.$det.'-'.$cuotas;
			 $data['summary'][$key]['cuotas']=$cuo;
			 $data['summary'][$key]['mora']=$det;
			}
			$data['summary'][$key]['debe']=$tot_debe-$tot_pagado;
			$data['summary'][$key]['total']=$tot_debe;
		}
	}
	/*
	Get search suggestions to find customers
	*/
	function get_search_suggestions($search,$limit=25)
	{
		$suggestions = array();
		
		$this->db->select('sales_items_temp.sale_id,customer.first_name as first_name, customer.last_name as last_name', false);
		$this->db->from('sales_items_temp');
		$this->db->join('people as employee', 'sales_items_temp.employee_id = employee.person_id');
		$this->db->join('people as customer', 'sales_items_temp.customer_id = customer.person_id', 'left');
		$this->db->join('sales_payments as sp', 'sp.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->join('payments as p', 'p.payment_id = sp.payment_id');
		$this->db->join('sales_payments as sp2', 'sp2.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->where("p.por_cobrar = 1 and trim(customer.first_name) LIKE '%".$this->db->escape_like_str($search)."%' or 
		trim(customer.last_name) LIKE '%".$this->db->escape_like_str($search)."%' or 
		CONCAT(trim(customer.first_name),' ',trim(customer.last_name)) LIKE '%".$this->db->escape_like_str($search)."%'");
		$this->db->group_by('sales_items_temp.sale_id');
		$this->db->order_by("customer.last_name", "asc");

		$by_name = $this->db->get();
		foreach($by_name->result() as $row)
		{
			// $suggestions[]=$row->sale_id.'|'.$row->first_name.' '.$row->last_name;		
			$suggestions[]=trim($row->first_name).' '.trim($row->last_name);		
		}		
		//only return $limit suggestions
		if(count($suggestions > $limit))
		{
			$suggestions = array_slice($suggestions, 0,$limit);
		}
		return $suggestions;	
	}

	function get_all_filtered($en_mora=0,$tiene_deuda=0)
	{
		$this->db->select('sp.payment_id,sales_items_temp.sale_id, sale_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(customer.first_name," ",customer.last_name) as customer_name, sum(total) as total, sales_items_temp.payment_type, comment, 0 as debe, customer.person_id,'.
		'null as mora, null as cuotas', false);
		$this->db->from('sales_items_temp');
		$this->db->join('people as employee', 'sales_items_temp.employee_id = employee.person_id');
		$this->db->join('people as customer', 'sales_items_temp.customer_id = customer.person_id', 'left');
		$this->db->join('sales_payments as sp', 'sp.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->join('payments as p', 'p.payment_id = sp.payment_id');
		$this->db->join('sales_payments as sp2', 'sp2.sale_id = phppos_sales_items_temp.sale_id', 'left outer');
		$this->db->where("p.por_cobrar = 1");
		
		$this->db->group_by('sales_items_temp.sale_id');
		$this->db->order_by("customer.last_name", "asc");

		$data = array();
		//return $this->db->get();
		$data['summary'] = $this->db->get()->result_array();
		$this->get_payment_abonos($data);
		$remove = array();
		foreach($data['summary'] as $key=>$value)
		{		 
			if ($en_mora != 0 )
			{
				// if(is_null($data['summary'][$key]['mora']))
				if(empty($data['summary'][$key]['mora']))
					unset($data['summary'][$key]);
			}
			if ($tiene_deuda != 0 )
			{
				//if($data['summary'][$key]['debe']==0)
				if(empty($data['summary'][$key]['debe']))
					unset($data['summary'][$key]);
			}
		}
		return $data;
	}
}
?>
