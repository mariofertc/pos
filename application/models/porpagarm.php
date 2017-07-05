<?php

class Porpagarm extends CI_Model {

    public function get_info($porpagar_id) {
        $this->db->from('porpagar');
        $this->db->where('porpagar_id', $abono_id);
        return $this->db->get();
    }

    public function get_abonos($receiving_id) {
        $this->db->from('porpagar');
        $this->db->where('receiving_id', $receiving_id);
        return $this->db->get();
    }

    function exists($sale_id) {
        $this->db->from('sales');
        $this->db->where('sale_id', $sale_id);
        $query = $this->db->get();

        return ($query->num_rows() == 1);
    }

    function update($sale_data, $sale_id) {
        $this->db->where('sale_id', $sale_id);
        $success = $this->db->update('sales', $sale_data);

        return $success;
    }

    function save($porpagar_data, $porpagar_id = false) {
        if (count($porpagar_data) == 0)
            return -1;

        //Run these queries as a transaction, we want to make sure we do all or nothing
        $this->db->trans_start();

        $this->db->insert('porpagar', $porpagar_data);
        $porpagar_id = $this->db->insert_id();
        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            return -1;
        }

        return $porpagar_id;
    }

    function delete($sale_id) {
        //Run these queries as a transaction, we want to make sure we do all or nothing
        $this->db->trans_start();

        $this->db->delete('sales_payments', array('sale_id' => $sale_id));
        $this->db->delete('sales_items_taxes', array('sale_id' => $sale_id));
        $this->db->delete('sales_items', array('sale_id' => $sale_id));
        $this->db->delete('sales', array('sale_id' => $sale_id));

        $this->db->trans_complete();

        return $this->db->trans_status();
    }

    function get_sale_items($sale_id) {
        $this->db->from('sales_items');
        $this->db->where('sale_id', $sale_id);
        return $this->db->get();
    }

    function get_sale_payments_old($sale_id) {
        $this->db->from('sales_payments');
        $this->db->where('sale_id', $sale_id);
        return $this->db->get();
    }

    function get_sale_payments($sale_id) {
        $this->db->select('sales_payments.payment_amount, payments.payment_type, payments.payment_id');
        $this->db->from('payments');
        $this->db->join('sales_payments', 'sales_payments.payment_id = payments.payment_id');
        //$this->db->join('people', 'people.person_id = suppliers.person_id');
        $this->db->where('sales_payments.sale_id', $sale_id);
        return $this->db->get();
    }

    function get_customer($sale_id) {
        $this->db->from('sales');
        $this->db->where('sale_id', $sale_id);
        return $this->Customer->get_info($this->db->get()->row()->customer_id);
    }

    /*
      Returns all the items
     */

    function get_all($num = 10, $offset = 0, $where, $order = null) {
        /*$this->db->select('rp.receiving_id, rp.payment_id, concat("RECV-",rp.receiving_id) as compra_id, receiving_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(supplier.first_name," ",supplier.last_name) as supplier_name, sum(total) as total, receivings_items_temp.payment_type, comment, 0 as debe', false);
        $this->db->from('receivings_items_temp');
        $this->db->join('people as employee', 'receivings_items_temp.employee_id = employee.person_id');
        $this->db->join('people as supplier', 'receivings_items_temp.supplier_id = supplier.person_id', 'left');
        $this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->join('payments as p', 'p.payment_id = rp.payment_id');
        $this->db->join('receivings_payments rp2', 'rp2.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->where('por_cobrar = 1');
        $this->db->group_by('receivings_items_temp.receiving_id');
        $this->db->order_by('receivings_items_temp.receiving_id');

        $this->db->order_by($order);
        $this->db->limit($num, $offset);
        $data['summary'] = $this->db->get()->result_array();

        $this->get_payment_abonos($data);
        return $data['summary'];*/


        $this->db->from('phppos_receivings_abonos_temp');
        if ($where != "")
            $this->db->where($where);
        $this->db->order_by($order);
        $this->db->limit($num, $offset);

        $data['summary'] = $this->db->get()->result_array();

        $this->get_payment_abonos($data);
        return $data['summary'];
    }

    function get_total($where = '') {

        $this->db->from('phppos_receivings_abonos_temp');
        $this->db->order_by('receiving_id');
        if ($where != "")
            $this->db->where($where);
        return count($this->db->get()->result_array());
        /*$this->db->select('rp.payment_id,rp.receiving_id, receiving_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(supplier.first_name," ",supplier.last_name) as supplier_name, sum(total) as total, receivings_items_temp.payment_type, comment, 0 as debe', false);
        $this->db->from('receivings_items_temp');
        $this->db->join('people as employee', 'receivings_items_temp.employee_id = employee.person_id');
        $this->db->join('people as supplier', 'receivings_items_temp.supplier_id = supplier.person_id', 'left');
        $this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->join('payments as p', 'p.payment_id = rp.payment_id');
        $this->db->join('receivings_payments rp2', 'rp2.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->where('por_cobrar = 1');
        $this->db->group_by('receivings_items_temp.receiving_id');
        $this->db->order_by('receivings_items_temp.receiving_id');
        if ($where != "")
            $this->db->where($where);
        $this->db->where('deleted', 0);
        return count($this->db->get()->result_array());*/
    }

    function get_receiving($receiving_id) {
        $this->db->select('rp.payment_id,rp.receiving_id, receiving_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(supplier.first_name," ",supplier.last_name) as supplier_name, sum(total) as total, receivings_items_temp.payment_type, comment, 0 as debe', false);
        $this->db->from('receivings_items_temp');
        $this->db->join('people as employee', 'receivings_items_temp.employee_id = employee.person_id');
        $this->db->join('people as supplier', 'receivings_items_temp.supplier_id = supplier.person_id', 'left');
        $this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->join('payments as p', 'p.payment_id = rp.payment_id');
        $this->db->join('receivings_payments rp2', 'rp2.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->where('por_cobrar = 1');
        $this->db->where('receivings_items_temp.receiving_id = ' . $receiving_id);
        $this->db->group_by('receivings_items_temp.receiving_id');
        $this->db->order_by('receivings_items_temp.receiving_id');

        $data = array();
        $data['summary'] = $this->db->get()->result_array();

        $this->get_payment_abonos($data);

        return $data['summary'][0];
    }

    function search($search) {
        /*$this->db->select('rp.payment_id,rp.receiving_id, receiving_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(supplier.first_name," ",supplier.last_name) as supplier_name, sum(total) as total, receivings_items_temp.payment_type, comment, 0 as debe,' .
                'null as mora, null as cuotas', false);
        $this->db->from('receivings_items_temp');
        $this->db->join('people as employee', 'receivings_items_temp.employee_id = employee.person_id');
        $this->db->join('people as supplier', 'receivings_items_temp.supplier_id = supplier.person_id', 'left');
        $this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->join('payments as p', 'p.payment_id = rp.payment_id');
        $this->db->join('receivings_payments rp2', 'rp2.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->where('por_cobrar = 1');*/
        $this->db->from('phppos_receivings_abonos_temp');
        if ($search) {
            $this->db->where("(supplier.first_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
			supplier.last_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
			CONCAT(supplier.first_name,' ',supplier.last_name) LIKE '%" . $this->db->escape_like_str($search) . "%')");
        }
        $this->db->group_by('receivings_items_temp.receiving_id');
        $this->db->order_by('receivings_items_temp.receiving_id');

        $data = array();
        $data['summary'] = $this->db->get()->result_array();

        $this->get_payment_abonos($data);
        return $data;
    }

    function get_payment_abonos(&$data) {
        //esto Es pagos
        $data['abonos'] = array();
        $data['payments'] = array();
        foreach ($data['summary'] as $key => $value) {
            $this->db->select('receivings_payments.payment_id, payments.payment_type,receivings_payments.payment_amount, receivings_payments.receiving_id, por_cobrar,payments.have_plazo, payments.payment_days, payments.payment_months, payments.share, receiving_date', false);
            $this->db->from('receivings_items_temp');
            $this->db->join('receivings_payments', 'receivings_payments.receiving_id=receivings_items_temp.receiving_id');
            $this->db->join('payments', 'payments.payment_id=receivings_payments.payment_id');
            $this->db->where('receivings_payments.receiving_id = ' . $value['receiving_id']);
            $this->db->where('por_cobrar = 1');
            $this->db->group_by('receivings_payments.receiving_id');
            $this->db->group_by('payment_id');
            $data['payments'][$key] = $this->db->get()->result_array();
            $tot_pagado = 0;
            $tot_debe = 0;
            foreach ($data['payments'][$key] as $pkey => $pvalue) {
                $this->db->select('porpagar_id,porpagar.amount,porpagar.type,porpagar.comment,porpagar.time');
                $this->db->from('receivings_items_temp');
                $this->db->join('porpagar', 'receivings_items_temp.receiving_id = porpagar.receiving_id');
                $this->db->where('porpagar.payment_id = ' . $pvalue['payment_id']);
                $this->db->where('porpagar.receiving_id = ' . $value['receiving_id']);
                $this->db->group_by('porpagar_id');
                $data['abonos'][$key] = $this->db->get()->result_array();
                $esDia = false;
                $cuotas = 0;
                //Si tiene Plazo, comparar con la fecha de pago.
                if ($pvalue['have_plazo']) {
                   $cuotas = ($pvalue['share'] != 0 ? $pvalue['share'] : 1);
                } else { //Si tiene Plazo fijo.
                    if ($pvalue['payment_days'] > 0) {
                        $esDia = true;
                    }
                    $cuotas = ($pvalue['share'] != 0 ? $pvalue['share'] : 1);
                }
                foreach ($data['abonos'][$key] as $akey => $avalue) {
                    $tot_pagado += $avalue['amount'];
                }
                $tot_debe += $pvalue['payment_amount'];
                $datePago = $dateRecv = strtotime($pvalue['receiving_date']);
                $dateHoy = time(); {
                    //Moroso
                    $i = 0;
                    $valorCuota = $tot_debe / $cuotas;
                    $aux = $tot_pagado;
                    $det = '';
                    $cuo = '';

                    if ($cuotas == 1) {
                        $datePago = $dateHoy;
                        if ($tot_pagado > 0)
                            $cuo = 'Pagado ' . to_currency($tot_pagado) . '<br>';
                    }
                    // $datePago = $dateRecv;
                    while ($i < $cuotas && $cuotas != 1) {
                        $diasVencidos = 0;
                        if ($esDia) {
                            $datePago = strtotime('+' . $pvalue['payment_days'] . ' day', $datePago);
                        } else {
                            $datePago = strtotime('+' . $pvalue['payment_months'] . ' month', $datePago);
                        }
                        //Sale del ciclo, porque todav�a no ha pagado y no le toca pagar.
                        if ($datePago > $dateHoy and $valorCuota > $aux)
                            break;
                        //Sigue en el ciclo, porque ya ha pagado (calcula cuotas pagadas) o le toca pagar (calculo cuotas mora).
                        if ($valorCuota <= $aux) {
                            $aux -= $valorCuota;
                            $cuo .= ($i + 1) . ' Pagada ' . to_currency($valorCuota) . '<br>';
                        } else if ($datePago <= $dateHoy) {
                            if ($aux > 0)
                                $aux -= $valorCuota;
                            else
                                $aux = 0;
                            //D�as impagos.
                            $diasVencidos += ($dateHoy - $datePago) != 0 ? floor(($dateHoy - $datePago) / 60 / 60 / 24) : 0;
                            // $det .= $diasVencidos.'d�as mora. Cuota '. ($i + 1) . ' Por Pagar. Valor='.$valorCuota.'<br>';
                            $det .= $diasVencidos;
                            $cuo .= ($i + 1) . ' Impago ' . to_currency(($aux == 0) ? $valorCuota : abs($aux)) . '<br>';
                        }
                        $i++;
                    }
                }
                $data['summary'][$key]['cuotas'] = $cuo;
                $data['summary'][$key]['mora'] = $det;
            }
            $data['summary'][$key]['debe'] = number_format($tot_debe - $tot_pagado,2);
            $data['summary'][$key]['total'] = $tot_debe;
        }
    }

    /*
      Get search suggestions to find customers
     */

    function get_search_suggestions($search, $limit = 25) {
        $suggestions = array();
        $this->db->select('rp.payment_id,rp.receiving_id, supplier.first_name as first_name, supplier.last_name as last_name', false);
        $this->db->from('receivings_items_temp');
        $this->db->join('people as employee', 'receivings_items_temp.employee_id = employee.person_id');
        $this->db->join('people as supplier', 'receivings_items_temp.supplier_id = supplier.person_id', 'left');
        $this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->join('payments as p', 'p.payment_id = rp.payment_id');
        $this->db->join('receivings_payments rp2', 'rp2.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->where("por_cobrar = 1 and supplier.first_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		supplier.last_name LIKE '%" . $this->db->escape_like_str($search) . "%' or 
		CONCAT(supplier.first_name,' ',supplier.last_name) LIKE '%" . $this->db->escape_like_str($search) . "%'");
        $this->db->group_by('receivings_items_temp.receiving_id');
        $this->db->order_by('receivings_items_temp.receiving_id');

        $by_name = $this->db->get();
        foreach ($by_name->result() as $row) {
            $suggestions[] = $row->first_name . ' ' . $row->last_name;
        }
        //only return $limit suggestions
        if (count($suggestions > $limit)) {
            $suggestions = array_slice($suggestions, 0, $limit);
        }
        return $suggestions;
    }

    function get_all_filtered($en_mora = 0, $tiene_deuda = 0) {
        $this->db->select('rp.payment_id,rp.receiving_id, receiving_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(supplier.first_name," ",supplier.last_name) as supplier_name, sum(total) as total, receivings_items_temp.payment_type, comment, 0 as debe,' .
                'null as mora, null as cuotas', false);
        $this->db->from('receivings_items_temp');
        $this->db->join('people as employee', 'receivings_items_temp.employee_id = employee.person_id');
        $this->db->join('people as supplier', 'receivings_items_temp.supplier_id = supplier.person_id', 'left');
        $this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->join('payments as p', 'p.payment_id = rp.payment_id');
        $this->db->join('receivings_payments rp2', 'rp2.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->where('por_cobrar = 1');
        $this->db->group_by('receivings_items_temp.receiving_id');
        $this->db->order_by('receivings_items_temp.receiving_id');

        $data = array();
        $data['summary'] = $this->db->get()->result_array();
        $this->get_payment_abonos($data);
        $remove = array();
        foreach ($data['summary'] as $key => $value) {
            if ($en_mora != 0) {
                if (empty($data['summary'][$key]['mora']))
                    unset($data['summary'][$key]);
            }
            if ($tiene_deuda != 0) {
                if (empty($data['summary'][$key]['debe']))
                //if($data['summary'][$key]['debe']==0)
                    unset($data['summary'][$key]);
            }
        }
        return $data;
    }

    public function create_porpagar_temp_table()
    {
        $table_temp = $this->db->dbprefix('receivings_abonos_temp');
        if($this->db->table_exists($table_temp))
        {
            //Borra datos previos
            $this->db->query("drop table ".$table_temp);
        }
        $this->db->query("CREATE TABLE if not exists ".$table_temp."
        (SELECT rp.receiving_id, rp.payment_id, concat('RECV-',rp.receiving_id) as compra_id, receiving_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name,' ',employee.last_name) as employee_name, CONCAT(supplier.first_name,' ',supplier.last_name) as supplier_name, sum(total) as total, sit.payment_type, comment, 0 as debe, supplier.person_id
        FROM ".$this->db->dbprefix('receivings_items_temp')." as sit
        INNER JOIN ".$this->db->dbprefix('people'). " as employee ON  sit.employee_id=employee.person_id
        LEFT JOIN ".$this->db->dbprefix('people')." as supplier ON  sit.supplier_id=supplier.person_id
        LEFT OUTER JOIN ".$this->db->dbprefix('receivings_payments')." as rp ON  rp.receiving_id=sit.receiving_id
        INNER JOIN ".$this->db->dbprefix('payments')." as p ON  p.payment_id=rp.payment_id
        LEFT OUTER JOIN ".$this->db->dbprefix('receivings_payments')." as rp2 ON rp2.receiving_id = sit.receiving_id
        where p.por_cobrar = 1
        GROUP BY sit.receiving_id)");
    }

}
 /*$this->db->select('rp.receiving_id, rp.payment_id, concat("RECV-",rp.receiving_id) as compra_id, receiving_date, sum(quantity_purchased) as items_purchased, CONCAT(employee.first_name," ",employee.last_name) as employee_name, CONCAT(supplier.first_name," ",supplier.last_name) as supplier_name, sum(total) as total, receivings_items_temp.payment_type, comment, 0 as debe', false);
        $this->db->from('receivings_items_temp');
        $this->db->join('people as employee', 'receivings_items_temp.employee_id = employee.person_id');
        $this->db->join('people as supplier', 'receivings_items_temp.supplier_id = supplier.person_id', 'left');
        $this->db->join('receivings_payments rp', 'rp.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->join('payments as p', 'p.payment_id = rp.payment_id');
        $this->db->join('receivings_payments rp2', 'rp2.receiving_id = phppos_receivings_items_temp.receiving_id', 'left outer');
        $this->db->where('por_cobrar = 1');
        $this->db->group_by('receivings_items_temp.receiving_id');
        $this->db->order_by('receivings_items_temp.receiving_id');

        $this->db->order_by($order);
        $this->db->limit($num, $offset);
        $data['summary'] = $this->db->get()->result_array();

        $this->get_payment_abonos($data);
        return $data['summary'];*/