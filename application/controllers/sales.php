<?php

require_once ("Secure_area.php");

class Sales extends Secure_area {

    function __construct() {
        parent::__construct('sales');
        $this->load->library('sale_lib');
    }

    function index() {
        $this->_reload();
    }

    function item_search() {
        $suggestions = $this->Item->get_item_search_suggestions($this->input->post('q'), $this->input->post('limit'));
        //echo implode("\n", $suggestions);
        echo json_encode($suggestions);
    }

    function customer_search() {
        $suggestions = $this->Customer->get_customer_search_suggestions($this->input->post('q'), $this->input->post('limit'));
        echo json_encode($suggestions);
        //echo implode("\n", $suggestions);
    }

    function select_customer() {
        $customer_id = $this->input->post("customer");
        $this->sale_lib->set_customer($customer_id);
        $this->_reload();
    }

    function change_mode() {
        $mode = $this->input->post("mode");
        $this->sale_lib->set_mode($mode);
        $this->_reload();
    }

    function change_almacen() {
        $almacen = $this->input->post("almacen");
        $this->sale_lib->set_almacen($almacen);
        $this->_reload();
    }

    //Alain Multiple Payments
    function add_payment() {
        $data = array();
        $this->form_validation->set_rules('amount_tendered', 'lang:sales_amount_tendered', 'numeric');
        //$this->form_validation->set_rules(array('field'=>'amount_tendered', 'label'=>'lang:sales_amount_tendered', 'rules'=>'numeric'));
        //$this->form_validation->set_error_delimiters('<div class="error">', '</div>');		
        $io = true;
        $io = $this->form_validation->run();
        if ($io == FALSE) {
            $data['error'] = $this->lang->line('sales_must_enter_numeric');
            $this->_reload($data);
            return;
        }
        //$data['warning']=$this->lang->line('sales_must_enter_numeric');

        $payment_type = $this->input->post('payment_type');
        $payment_amount = $this->input->post('amount_tendered');


        if (!$this->sale_lib->add_payment($payment_type, $payment_amount, $this->Payment->get_info($payment_type)->payment_type)) {
            $data['error'] = 'Unable to Add Payment! Please try again!';
        }
        $this->_reload($data);
    }

    //Alain Multiple Payments
    function delete_payment($payment_id) {
        $this->sale_lib->delete_payment($payment_id);
        $this->_reload();
    }

    function stock() {
        //return $this->sale_lib->out_of_stock($this->input->post("item");)
    }

    function add() {
        $data = array();
        $mode = $this->sale_lib->get_mode();
        // $almacen = $this->sale_lib->get_almacen();
        $selected_almacen = $this->Almacen->get_first();
        $almacen = $this->Almacen->get_info($this->sale_lib->get_almacen() != -1 ? $this->sale_lib->get_almacen() : $selected_almacen->almacen_id);

        $item_id_or_number_or_receipt = $this->input->post("item");
        $quantity = $mode == "sale" ? 1 : -1;
        //$stock = $data['stock'] = $this->sale_lib->get_stock($item_id_or_number_or_receipt);
        if ($this->sale_lib->is_valid_receipt($item_id_or_number_or_receipt) && $mode == 'return') {
            $this->sale_lib->return_entire_sale($item_id_or_number_or_receipt);
        } elseif (!$this->sale_lib->add_item($item_id_or_number_or_receipt, $quantity, 0, null, null, null, null, $almacen)) {
            $data['error'] = $this->lang->line('sales_unable_to_add_item');
        }

        if ($this->sale_lib->out_of_stock($item_id_or_number_or_receipt, $almacen)) {
            $data['warning'] = $this->lang->line('sales_quantity_less_than_zero');
        }
        //$data['almacen'] = (isset($this->Item->get_almacen($this->Item->get_item_id($item_id_or_number_or_receipt))->nombre))?$this->Item->get_almacen($this->Item->get_item_id($item_id_or_number_or_receipt))->nombre:"";

        $this->_reload($data);
    }

    function edit_item($line) {
        $data = array();

        $this->form_validation->set_rules('price', 'lang:items_price', 'required|numeric');
        $this->form_validation->set_rules('quantity', 'lang:items_quantity', 'required|numeric');

        $description = $this->input->post("description");
        $serialnumber = $this->input->post("serialnumber");
        $price = $this->input->post("price");
        $quantity = $this->input->post("quantity");
        $discount = $this->input->post("discount");


        if ($this->form_validation->run() != FALSE) {
            $this->sale_lib->edit_item($line, $description, $serialnumber, $quantity, $discount, $price);
        } else {
            $data['error'] = $this->lang->line('sales_error_editing_item');
        }
        $selected_almacen = $this->Almacen->get_first();
        $almacen = $this->Almacen->get_info($this->sale_lib->get_almacen() != -1 ? $this->sale_lib->get_almacen() : $selected_almacen->almacen_id);
        if ($this->sale_lib->out_of_stock($this->sale_lib->get_item_id($line), $almacen)) {
            $data['warning'] = $this->lang->line('sales_quantity_less_than_zero');
        }


        $this->_reload($data);
    }

    function delete_item($item_number) {
        $this->sale_lib->delete_item($item_number);
        $this->_reload();
    }

    function delete_customer() {
        $this->sale_lib->delete_customer();
        $this->_reload();
    }

    /**
     * Toma los datos del carrito de compra, completa la compra 
     * y genera la vista de impresion del comprobante de venta
     * @return 'sales/receipt.html.twig' Vista del comprobante de venta
     */
    function complete() {
        $data['cart'] = $this->sale_lib->get_cart();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['subtotal_without_disc'] = $this->sale_lib->get_subtotal_without_disc();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['discount'] = $this->sale_lib->get_total_discount();

        $selected_almacen = null;

        //Get store if is selected, other case get first
        if($this->sale_lib->get_almacen()!= -1){
            // $selected_almacen = $this->Almacen->get_all(1,0,array('almacen_id'=>$this->sale_lib->get_almacen()));
            $selected_almacen = $this->Almacen->get_info($this->sale_lib->get_almacen);
        }else{
            $selected_almacen = $this->Almacen->get_first();
        }
        //Almacen
        $data['almacen_id'] = $selected_almacen->almacen_id;
        $data['establecimiento'] = $selected_almacen->codigo_facturacion;
        // ECHO $data['almacen_id'];DIE;

        $data['receipt_title'] = $this->lang->line('sales_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a');
        $customer_id = $this->sale_lib->get_customer();
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
        $comment = $this->input->post('comment');
        $emp_info = $this->Employee->get_info($employee_id);
        $payment_type = $this->input->post('payment_type');
        $data['payment_type'] = $this->input->post('payment_type');
        //Alain Multiple payments
        $data['payments'] = $this->sale_lib->get_payments();
        $data['amount_change'] = to_currency($this->sale_lib->get_amount_due() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;
        $data['print_after_sale'] = $this->Appconfig->get('print_after_sale');

        if ($customer_id != -1) {
            $cust_info = $this->Customer->get_info($customer_id);
            $data['customer'] = $cust_info->first_name . ' ' . $cust_info->last_name;
            $data['zip'] = $cust_info->zip;
            $data['address_1'] = $cust_info->address_1;
            $data['phone_number'] = $cust_info->phone_number;
        }

        $total_payments = 0;

        foreach ($data['payments'] as $payment) {
            $total_payments += $payment['payment_amount'];
        }

        $data['amount_tendered'] = to_currency($total_payments * -1);

        if (( $this->sale_lib->get_mode() == 'sale' ) && ( ( to_currency_no_money($data['total']) - $total_payments ) > 1e-6 )) {
            $data['error'] = $this->lang->line('sales_payment_not_cover_total');
            $this->_reload($data);
            return false;
        }

        //SAVE sale to database
        $data['sale_id'] = 'Vent ' . $this->Sale->save($data['cart'], $customer_id, $employee_id, $comment, $data['payments'], false, $data);
        if ($data['sale_id'] == 'Vent -1') {
            $data['error_message'] = $this->lang->line('sales_transaction_failed');
        }
        
        $this->twig->set($data);
        $this->sale_lib->clear_all();
        //$this->load->view("receivings/receipt", $data);
        //TODO: Must be on configuration
        $this->twig->display("sales/receipt_dongu");
    }

    function receipt($sale_id) {
        $sale_info = $this->Sale->get_info($sale_id)->row_array();
        $this->sale_lib->copy_entire_sale($sale_id);
        $data['cart'] = $this->sale_lib->get_cart();
        $data['payments'] = $this->sale_lib->get_payments();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['subtotal_without_disc'] = $this->sale_lib->get_subtotal_without_disc();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['receipt_title'] = $this->lang->line('sales_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a', strtotime($sale_info['sale_time']));
        $customer_id = $this->sale_lib->get_customer();
        $emp_info = $this->Employee->get_info($sale_info['employee_id']);
        $data['payment_type'] = $sale_info['payment_type'];
        $data['amount_change'] = to_currency($this->sale_lib->get_amount_due() * -1);
        $data['amount_tendered'] = to_currency($this->sale_lib->get_payments_total() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;
        $data['discount'] = $this->sale_lib->get_total_discount();

        if ($customer_id != -1) {
            $cust_info = $this->Customer->get_info($customer_id);
            $data['customer'] = $cust_info->first_name . ' ' . $cust_info->last_name;
            $data['zip'] = $cust_info->zip;
            $data['address_1'] = $cust_info->address_1;
            $data['phone_number'] = $cust_info->phone_number;
        }
        $data['sale_id'] = 'POS ' . $sale_id;
        $data['print_after_sale'] = $this->Appconfig->get('print_after_sale');
        $data['company'] = $this->config->item('company');
        $data['address'] = $this->config->item('address');
        $data['phone'] = $this->config->item('phone');
        $data['return_policy'] = $this->config->item('return_policy');
        
        
//        $this->load->view("sales/receipt", $data);
        $this->sale_lib->clear_all();
        $this->twig->set($data);
        //TODO: It has to be at configuration.
        $this->twig->display("sales/receipt_dongu");
    }

    function get_sri($clave_acceso = null){
        $this->load->helper('file');
        //Pruebas online
        //https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantes?wsdl
        //https://celcer.sri.gob.ec/comprobantes-electronicosws/AutorizacionComprobantes?wsdl
        //Producción online
        //https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantes?wsdl
        //https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantes?wsdl
        //OFFLINE - pruebas
        //https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl 
        //https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl
        //Ambiente de Producción:
        //https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl 
        //https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl
        $c = new nusoap_client('https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',true);
        // https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl
        $file_path = "C:/programas_manual/proyectos/pos/files/sri/signed/". ($clave_acceso==null?"2602202001180278423900110010010000116691988668616":$clave_acceso) . ".xml";
        print_r($file_path);
        $xml_file = read_file($file_path);
        $args = array('xml' => base64_encode($xml_file));
        $client = $c->call('validarComprobante', $args);
        print_r($client);
    }

    function get_sri_respuesta_comprobante($clave_acceso=null){
        $this->load->helper('file');
        $c = new nusoap_client('https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',true);
        // https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl
        $file_path = 'C:/programas_manual/proyectos/pos/files/sri/signed/2602202001180278423900110010010000116691988668616.xml';
        $xml_file = read_file($file_path);
        $args = array('claveAccesoConsultada' => $clave_acceso,
                        'numeroComprobantes' => "1",
                        'autorizaciones' => "1");
        $client = $c->call('respuestaComprobante', $args);
        var_dump($client);
    }

    function get_sri_respuesta($auth_code = null){
        $c = new nusoap_client('https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',true);
        $auth_code = $auth_code == null?"2602202001180278423900110010010000116691988668616":$auth_code;
        
        $args = array("claveAccesoComprobante" => $auth_code);
        $client = $c->call('autorizacionComprobante', $args);
        var_dump($client);
        // $client = $c->call('autorizacionComprobante', $auth_code);
         /*print_r("se fue");
         $client = $c->autorizacionComprobante($args);*/
        //$client = $c->call('RespuestaComprobante');
        
        print_r($client);
    }

    /**
     * Generate XML file in the SRI format. The invoice shouldn't be less than 43201 minutes (30 days).
     * @param  [int] $sale_id [Identification of sale]
     * @return [xml]          [Invoice in SRI Ecuador format]
     */
    function generate_electronic_document($sale_id) {
        $this->load->helper('MY_xml');
        $sale_info = $this->Sale->get_info($sale_id)->row_array();
        $almacen = $this->Almacen->get_info($sale_info['almacen_id']);
        //2019-01-02 11:20:10
        //ddmmaaaa
        //Make authorization code
        $date =  date('dmY', strtotime($sale_info['sale_time']));
        //Factura 01, LIQUIDACIÓN DE COMPRA DE BIENES Y PRESTACIÓN DE SERVICIOS 03, NOTA DE CRÉDITO 04, NOTA DE DÉBITO 05, GUÍA DE REMISIÓN 06, COMPROBANTE DE RETENCIÓN 07
        $tipo_comprobante = "01";
        $ruc = $this->config->item('identity');
        //1 - Pruebas, 2 - Producción
        $tipo_ambiente =  $this->config->item('fe_ambiente');
        //Longitud 6. Establecimiento 001, por almacen, punto de emisión 001
        // $establecimiento = "001";
        $establecimiento =  str_pad($sale_info['establecimiento'], 3, "0", STR_PAD_LEFT);
        //TODO: By user. By the moment it'll be a store with one emision point. 001 by each store.
        // $punto_emision = "001";
        $punto_emision = str_pad($sale_info['punto_emision'], 3, "0", STR_PAD_LEFT);
        //Secuencial, longitud 9. Ej: 000000001
        // $numero_secuencial = str_pad($sale_id, 9, "0", STR_PAD_LEFT);
        $numero_secuencial = str_pad($sale_info['numero_secuencial'], 9, "0", STR_PAD_LEFT);
        //Generate my own code. For me 19886686 RM
        $codigo_numerico = "19886686";
        //Always
        $tipo_emision = "1";
        $authoriztion_code = $date . $tipo_comprobante . $ruc . $tipo_ambiente . $establecimiento . $punto_emision . $numero_secuencial . $codigo_numerico . $tipo_emision;
        //11 module validation
        $digito_verificador = module11($authoriztion_code);
        //Authorization code. 
        //0201201901180278423900110010010000059601988668619
        $authoriztion_code .= $digito_verificador;
        $this->sale_lib->copy_entire_sale($sale_id);
        $data['cart'] = $this->sale_lib->get_cart();
        $data['payments'] = $this->sale_lib->get_payments();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['receipt_title'] = $this->lang->line('sales_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a', strtotime($sale_info['sale_time']));
        $customer_id = $this->sale_lib->get_customer();
        $emp_info = $this->Employee->get_info($sale_info['employee_id']);
        $data['payment_type'] = $sale_info['payment_type'];
        $data['amount_change'] = to_currency($this->sale_lib->get_amount_due() * -1);
        $data['amount_tendered'] = to_currency($this->sale_lib->get_payments_total() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;

        /*RUC 04, CEDULA 05, PASAPORTE 06, VENTA A CONSUMIDOR 07, IDENTIFICACION DEL EXTERIOR 08*/
        //Consumidor final
        $tipo_id_comprador = '07';
        if ($customer_id != -1) {
            $cust_info = $this->Customer->get_info($customer_id);
            //print_r($cust_info);
            $data['customer'] = $cust_info->first_name . ' ' . $cust_info->last_name;
            if(strlen($cust_info->zip) == 10){
                //Cédula
                $tipo_id_comprador = '05';
            }else if(strlen($cust_info->zip) == 13 && $cust_info->zip != '9999999999999'){
                //RUC
                $tipo_id_comprador = '04';
            }
        }else{
            $data['customer'] = "Consumidor Final";
            $cust_info = new stdClass();
            //Consumidor final
            $cust_info->zip="9999999999999";
        }
        $data['sale_id'] = 'POS ' . $sale_id;
        $data['print_after_sale'] = $this->Appconfig->get('print_after_sale');
        $data['company'] = $this->config->item('company');
        $data['identity'] = $ruc;
        $data['address'] = $this->config->item('address');
        $data['phone'] = $this->config->item('phone');
        $data['return_policy'] = $this->config->item('return_policy');
        $discount = $this->sale_lib->get_total_discount();
        $base_imponible = $this->sale_lib->get_total_imponible();
        $importe_total = $this->sale_lib->get_total_taxes();

        $this->sale_lib->clear_all();
        $dom = xml_dom(LIBXML_NOEMPTYTAG);
        $factura = xml_add_child($dom, 'factura');
        xml_add_attribute($factura, 'id', 'comprobante');
        xml_add_attribute($factura, 'version', '2.0.0');
        $info_tributaria = xml_add_child($factura, 'infoTributaria');
        xml_add_child($info_tributaria, 'ambiente', $tipo_ambiente);
        xml_add_child($info_tributaria, 'tipoEmision', $tipo_emision);
        xml_add_child($info_tributaria, 'razonSocial', $data['company']);
        xml_add_child($info_tributaria, 'ruc', $data['identity']);
        xml_add_child($info_tributaria, 'claveAcceso', $authoriztion_code);
        xml_add_child($info_tributaria, 'codDoc', $tipo_comprobante);
        xml_add_child($info_tributaria, 'estab', $establecimiento);
        xml_add_child($info_tributaria, 'ptoEmi', $punto_emision);
        xml_add_child($info_tributaria, 'secuencial', $numero_secuencial);
        xml_add_child($info_tributaria, 'dirMatriz', $data['address']);
        $info_tributaria = xml_add_child($factura, 'infoFactura');
        xml_add_child($info_tributaria, 'fechaEmision', date('d/m/Y', strtotime($sale_info['sale_time'])));

        xml_add_child($info_tributaria, 'dirEstablecimiento', $almacen->direccion);
        xml_add_child($info_tributaria, 'obligadoContabilidad', 'NO');
        xml_add_child($info_tributaria, 'tipoIdentificacionComprador', $tipo_id_comprador);
        xml_add_child($info_tributaria, 'razonSocialComprador', $data['customer']);
        xml_add_child($info_tributaria, 'identificacionComprador', $cust_info->zip);
        xml_add_child($info_tributaria, 'direccionComprador', $cust_info->address_1);
        xml_add_child($info_tributaria, 'totalSinImpuestos', $data['subtotal']);
        xml_add_child($info_tributaria, 'totalDescuento', $discount);
        $total_con_impuestos = xml_add_child($info_tributaria, 'totalConImpuestos');
        $total_impuesto = xml_add_child($total_con_impuestos, 'totalImpuesto');
        xml_add_child($total_impuesto, 'codigo', '2');
        xml_add_child($total_impuesto, 'codigoPorcentaje', '2');
        xml_add_child($total_impuesto, 'baseImponible', $base_imponible);
        xml_add_child($total_impuesto, 'tarifa', 12);
        xml_add_child($total_impuesto, 'valor', $importe_total);
        xml_add_child($info_tributaria, 'propina', '0.00');
        xml_add_child($info_tributaria, 'importeTotal', $data['total']);
        xml_add_child($info_tributaria, 'moneda', "DOLAR");
        //Detalles
        $detalles = xml_add_child($factura, 'detalles');
        foreach($data['cart'] as $cart){
            $detalle = xml_add_child($detalles, 'detalle');
            xml_add_child($detalle, 'codigoPrincipal', $cart['item_id']);
            if($cart['item_number'])
                xml_add_child($detalle, 'codigoAuxiliar', $cart['item_number']);
            xml_add_child($detalle, 'descripcion', $cart['name']);
            xml_add_child($detalle, 'cantidad', $cart['quantity']);
            xml_add_child($detalle, 'precioUnitario', round($cart['price'],2));
            $discount = $cart['price']*$cart['quantity']*$cart['discount']/100;
            xml_add_child($detalle, 'descuento', $discount>0?$discount:'0');
            xml_add_child($detalle, 'precioTotalSinImpuesto', ($cart['price']*$cart['quantity']-$cart['price']*$cart['quantity']*$cart['discount']/100));
            $cll_taxes = $this->sale_lib->get_taxes_item($cart);
            foreach($cll_taxes as $tax){   
                $impuestos = xml_add_child($detalle, 'impuestos');
                $impuesto = xml_add_child($impuestos, 'impuesto');
                //IVA 2, ICE 3, IRBPNR 5
                xml_add_child($impuesto, 'codigo', '2');
                //0 0, 12 2, 14 3, no objeto de impuesto 6, exento iva 7
                xml_add_child($impuesto, 'codigoPorcentaje', '2');
                xml_add_child($impuesto, 'tarifa', '12');
                xml_add_child($impuesto, 'baseImponible', to_currency_no_money($cart['price']*$cart['quantity']-$cart['price']*$cart['quantity']*$cart['discount']/100));
                xml_add_child($impuesto, 'valor', to_currency_no_money($tax));
            }
            
        }
        $info_adicionales = xml_add_child($factura, 'infoAdicional');
        $info_adicional = xml_add_child($info_adicionales, 'campoAdicional',  $cust_info->address_1);
        $info_adicional->setAttribute('nombre', "Dirección");
        // $info_adicional->setAttribute('nombre', "Direccion");
        if($cust_info->email){
            $info_adicional = xml_add_child($info_adicionales, 'campoAdicional',  $cust_info->email);
            $info_adicional->setAttribute('nombre', "Email");
        }
         $dom->formatOutput = true;
        //file_put_contents(BASEPATH."files/sri/".$authoriztion_code.'.xml', $dom->saveXML());
        file_put_contents(FCPATH."files/sri/".$authoriztion_code.'.xml', $dom->saveXML());
        xml_print($dom);
        return;

        // $cert_store = file_get_contents('D:\firmaElectrónica\MarioTorresTest.pfx');
        $cert_store = file_get_contents('C:\Users\marioT\Google Drive\Proyectos\pos\guayavoz\firma\cd\alex_patricio_lascano_nunez.p12');
        // $status = openssl_pkcs12_read($cert_store, $cert_info, '12345678');
        $status = openssl_pkcs12_read($cert_store, $cert_info, 'Karisia01');
        //var_dump($status);
        //var_dump($cert_info);
        if (!$status) {
            throw new RuntimeException('Invalid pasword');
            // throw new RuntimeException(__('Invalid pasword'));
        }

        $public_key = $cert_info['cert'];
        $private_key = $cert_info['pkey'];

        // Read the private key
        $pkeyid = openssl_get_privatekey($private_key);

        if (!$pkeyid) {
            throw new RuntimeException(__('Invalid private key'));
        }

        // Sign an XML file and save the signature in a new file
        // This method does not save the public key within the XML file.
        // This file cannot be verified unless
        // the verifying code has the key with which it was signed.
        $dom->formatOutput = true;
        file_put_contents('files/sri/'.$authoriztion_code.'.xml', $dom->saveXML());
        xml_print($dom);
        return;

        // Read the xml file content
        $filename = 'fact1.xml';

         $data = file_get_contents($filename);
        //$data = $dom;


         //Inicio firma electrónica
        // Compute signature with SHA-512
        $status = openssl_sign($data, $signature, $pkeyid, OPENSSL_ALGO_SHA512);

        // Free the key from memory
        openssl_free_key($pkeyid);

        if (!$status) {
            throw new RuntimeException(__('Computing of the signature failed'));
        }

        //
        // Create a SignedXml object.
        //
        $xml = new DOMDocument();
        $xml->load($filename);
        $xml->preserveWhiteSpace = true;
        $xml->formatOutput = true;

        // Encode signature
        $signature_value = base64_encode($signature);

        // Calulate and encode digest value
        $digest_value = base64_encode(hash('sha512', $data, true));

        // Get the XML representation of the signature and save
        // it to an XmlElement object.
        $signatureElement = $xml->createElement('Signature');
        $signatureElement->setAttribute('xmlns', 'http://www.w3.org/2000/09/xmldsig#');

        $signedInfoElement = $xml->createElement('SignedInfo');
        $signatureElement->appendChild($signedInfoElement);

        $canonicalizationMethodElement = $xml->createElement('CanonicalizationMethod');
        $canonicalizationMethodElement->setAttribute('Algorithm', 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315');
        $signedInfoElement->appendChild($canonicalizationMethodElement);

        $signatureMethodElement = $xml->createElement('SignatureMethod');
        $signatureMethodElement->setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#rsa-sha512');
        $signedInfoElement->appendChild($signatureMethodElement);

        $referenceElement = $xml->createElement('Reference');
        $referenceElement->setAttribute('URI', '');
        $signedInfoElement->appendChild($referenceElement);

        $transformsElement = $xml->createElement('Transforms');
        $referenceElement->appendChild($transformsElement);

        $transformElement = $xml->createElement('Transform');
        $transformElement->setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#enveloped-signature');
        $transformsElement->appendChild($transformElement);

        $digestMethodElement = $xml->createElement('DigestMethod');
        $digestMethodElement->setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha512');
        $referenceElement->appendChild($digestMethodElement);

        $digestValueElement = $xml->createElement('DigestValue', $digest_value);
        $referenceElement->appendChild($digestValueElement);

        $signatureValueElement = $xml->createElement('SignatureValue', $signature_value);
        $signatureElement->appendChild($signatureValueElement);

        // Append the element to the XML document.
        // We insert the new element as root (child of the document)
        $xml->documentElement->appendChild($signatureElement);

        // Save the signed xml file
        file_put_contents('signedExample.xml', $xml->saveXML());
        /*Fin Firma electrónica*/

        xml_print($dom);

        $this->twig->set($data);

        //$this->twig->display("sales/receipt");
    }

    function edit($sale_id) {
        $data = array();

        $data['customers'] = array('' => 'No Customer');
//		foreach ($this->Customer->get_all()->result() as $customer)
        foreach ($this->Customer->get_all(100, 0) as $customer) {
            $data['customers'][$customer['person_id']] = $customer['first_name'] . ' ' . $customer['last_name'];
        }

        $data['employees'] = array();
        foreach ($this->Employee->get_all() as $employee) {
            $data['employees'][$employee['person_id']] = $employee['first_name'] . ' ' . $employee['last_name'];
        }

        $data['sale_info'] = $this->Sale->get_info($sale_id)->row_array();

        $this->twig->set($data);
        $this->twig->display("sales/edit");
//		$this->load->view('sales/edit', $data);
    }

    function test_factura() {

        $this->twig->display("reports/firma");
//      $this->load->view('sales/edit', $data);
    }

    function por_cobrar($sale_id, $debe, $payment_id) {

        $data = array();
        $data['debe'] = $debe;

        $data['customers'] = array('' => 'No Customer');
        foreach ($this->Customer->get_all()->result() as $customer) {
            $data['customers'][$customer->person_id] = $customer->first_name . ' ' . $customer->last_name;
        }

        $data['employees'] = array();
        foreach ($this->Employee->get_all()->result() as $employee) {
            $data['employees'][$employee->person_id] = $employee->first_name . ' ' . $employee->last_name;
        }

        $data['sale_info'] = $this->Sale->get_info($sale_id)->row_array();
        $data['sale_info']['payment_id'] = $payment_id;
        //tipos de pagos de abono.
        $data['payment_options'] = array(
            $this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
            $this->lang->line('sales_check') => $this->lang->line('sales_check'),
            $this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
            $this->lang->line('sales_credit') => $this->lang->line('sales_credit')
        );


        $this->load->view('sales/por_cobrar', $data);
    }

    function delete($sale_id) {
        $data = array();

        if ($this->Sale->delete($sale_id)) {
            $data['success'] = true;
        } else {
            $data['success'] = false;
        }

        $this->load->view('sales/delete', $data);
    }

    function save($sale_id) {
        $sale_data = array(
            'sale_time' => date('Y-m-d', strtotime($this->input->post('date'))),
            'customer_id' => $this->input->post('customer_id') ? $this->input->post('customer_id') : null,
            'employee_id' => $this->input->post('employee_id'),
            'comment' => $this->input->post('comment')
        );

        if ($this->Sale->update($sale_data, $sale_id)) {
            echo json_encode(array('success' => true, 'message' => $this->lang->line('sales_successfully_updated')));
        } else {
            echo json_encode(array('success' => false, 'message' => $this->lang->line('sales_unsuccessfully_updated')));
        }
    }

    function _reload($data = array()) {
        $person_info = $this->Employee->get_logged_in_employee_info();
        $data['cart'] = $this->sale_lib->get_cart();
        $data['modes'] = array('sale' => $this->lang->line('sales_sale'), 'return' => $this->lang->line('sales_return'));
        $data['mode'] = $this->sale_lib->get_mode();
        $data['almacenes'] = $this->Almacen->get_all_id();
        $data['almacen'] = $this->sale_lib->get_almacen();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['items_module_allowed'] = $this->Employee->has_permission('items', $person_info->person_id);
        //Alain Multiple Payments
        $data['payments_total'] = $this->sale_lib->get_payments_total();
        $data['amount_due'] = $this->sale_lib->get_amount_due();
        $data['payments'] = $this->sale_lib->get_payments();

        $payments_row = array();
        foreach ($this->Payment->get_all() as $row) {
            $payments_row[$row['payment_id']] = $row['payment_type'];
        }
        $data['payment_options'] = $payments_row;

        /* $data['payment_options']=array(
          $this->lang->line('sales_cash') => $this->lang->line('sales_cash'),
          $this->lang->line('sales_check') => $this->lang->line('sales_check'),
          $this->lang->line('sales_debit') => $this->lang->line('sales_debit'),
          $this->lang->line('sales_credit') => $this->lang->line('sales_credit')
          ); */

        $customer_id = $this->sale_lib->get_customer();
        if ($customer_id != -1) {
            $info = $this->Customer->get_info($customer_id);
            $data['customer'] = $info->first_name . ' ' . $info->last_name;
        }

        //Si ya se ha cerrado la caja.
        if ($this->Box->ya_cerrado())
            $data['error'] = $this->lang->line('boxes_close_sale');
//        $this->load->view("sales/register", $data);
        $this->twig->set($data);
        $this->twig->display("sales/register");
    }

    function cancel_sale() {
        $this->sale_lib->clear_all();
        $this->_reload();
    }

    function suspend() {
        $data['cart'] = $this->sale_lib->get_cart();
        $data['subtotal'] = $this->sale_lib->get_subtotal();
        $data['taxes'] = $this->sale_lib->get_taxes();
        $data['total'] = $this->sale_lib->get_total();
        $data['receipt_title'] = $this->lang->line('sales_receipt');
        $data['transaction_time'] = date('m/d/Y h:i:s a');
        $customer_id = $this->sale_lib->get_customer();
        $employee_id = $this->Employee->get_logged_in_employee_info()->person_id;
        $comment = $this->input->post('comment');
        $emp_info = $this->Employee->get_info($employee_id);
        $payment_type = $this->input->post('payment_type');
        $data['payment_id'] = $this->input->post('payment_id');
        //Alain Multiple payments
        $data['payments'] = $this->sale_lib->get_payments();
        $data['amount_change'] = to_currency($this->sale_lib->get_amount_due() * -1);
        $data['employee'] = $emp_info->first_name . ' ' . $emp_info->last_name;

        if ($customer_id != -1) {
            $cust_info = $this->Customer->get_info($customer_id);
            $data['customer'] = $cust_info->first_name . ' ' . $cust_info->last_name;
        }

        $total_payments = 0;

        foreach ($data['payments'] as $payment) {
            $total_payments += $payment['payment_amount'];
        }

        //SAVE sale to database
        $data['sale_id'] = 'POS ' . $this->Sale_suspended->save($data['cart'], $customer_id, $employee_id, $comment, $data['payments']);
        if ($data['sale_id'] == 'POS -1') {
            $data['error_message'] = $this->lang->line('sales_transaction_failed');
        }
        $this->sale_lib->clear_all();
        $this->_reload(array('success' => $this->lang->line('sales_successfully_suspended_sale')));
    }

    function suspended() {
        $data = array();
        $data['suspended_sales'] = $this->Sale_suspended->get_all()->result_array();
        $this->load->view('sales/suspended', $data);
    }

    function unsuspend() {
        $sale_id = $this->input->post('suspended_sale_id');
        $this->sale_lib->clear_all();
        $this->sale_lib->copy_entire_suspended_sale($sale_id);
        $this->Sale_suspended->delete($sale_id);
        $this->_reload();
    }

}
