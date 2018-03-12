<?php

function getData_old(&$model, $aColumnas, $cllAccion = array(), $es_mas = false) {
    $CI = & get_instance();
    $sIndexColumn = "id";
    $controller_name = strtolower($CI->uri->segment(1));

    $aColumns = get_fields($aColumnas);
    /*
     * Ordering
     */
    $sOrder = "";
    if (isset($_GET['iSortCol_0'])) {
        $sOrder = "";
        for ($i = 0; $i < intval($_GET['iSortingCols']); $i++) {
            if ($_GET['bSortable_' . intval($_GET['iSortCol_' . $i])] == "true") {
                $sOrder .= "" . $aColumns[intval($_GET['iSortCol_' . $i])] . " " .
                        ( $_GET['sSortDir_' . $i] ) . ", ";
            }
        }

        $sOrder = substr_replace($sOrder, "", -2);
    }
    /* Filtro de search */
    $sWhere = "";
    if (isset($_GET['sSearch']) && $_GET['sSearch'] != "") {
        $sWhere = '(';
        for ($i = 1; $i < count($aColumns); $i++) {
            $sWhere .= $aColumns[$i] . " LIKE '%" . ( $_GET['sSearch'] ) . "%' OR ";
        }
        $sWhere = substr_replace($sWhere, "", -3);
        $sWhere .= ')';
    }
    /* Individual column filtering */
    for ($i = 1; $i < count($aColumns); $i++) {
        if (isset($_GET['bSearchable_' . $i]) && $_GET['bSearchable_' . $i] == "true" && $_GET['sSearch_' . $i] != '') {
            if ($sWhere == "") {
                $sWhere = " where ";
            } else {
                $sWhere .= " AND ";
            }
            $sWhere .= $aColumns[$i] . " LIKE '%" . ($_GET['sSearch_' . $i]) . "%' ";
        }
    }
    $page = isset($_GET['iDisplayStart']) ? $_GET['iDisplayStart'] : 0;
    $offset = isset($_GET['iDisplayLength']) ? $_GET['iDisplayLength'] : 0;
    //return json_encode($sOrder);
    $rResult = $model->get_all($offset, ($page == null ? 0 : $page), $sWhere, $sOrder);
    $rResult2 = $model->get_all('10000', 0, $sWhere, $sOrder);
    if (gettype($rResult) != 'array') {
        $rResult2 = $rResult2->result_array();
        $rResult = $rResult->result_array();
    }
    $iTotal = count($rResult2);
    $iFilteredTotal = $model->get_total()->total;
    $iFilteredTotal = $model->get_total()->total;
    /*
     * Output
     */
    $output = array(
        "sEcho" => intval($_GET['sEcho']),
        "iTotalRecords" => $iFilteredTotal,
        "iTotalDisplayRecords" => $iTotal,
        "aaData" => array()
    );

    $limit = count($cllAccion) == 0 ? count($aColumns) : count($aColumns) - 1;
    $output['aaData'] = get_data($rResult, $aColumnas, $cllAccion, $es_mas);
    return json_encode($output);
}

function getData($model, $aColumns, $cllAccion = array(), $es_mas = false) {
    $CI = & get_instance();
    $controller_name = strtolower($CI->uri->segment(1));
    /*
     * Ordering
     */
    $sOrder = "";
    $mOrder = array();
//    if (isset($_GET['iSortCol_0'])) {
    $order = $_GET['order'][0];
//    var_dump($order);
    if (isset($order)) {
        $sOrder = "";
//        for ($i = 0; $i < intval($_GET['iSortingCols']); $i++) {
//            if ($_GET['bSortable_' . intval($_GET['iSortCol_' . $i])] == "true") {
        $sOrder .= "" . $aColumns[intval($order['column'])] . " " .
                ( $order['dir'] ) . ", ";
//                 $sOrder .= "" . $aColumns[intval($_GET['iSortCol_' . $i])] . " " .
//                        ( $_GET['sSortDir_' . $i] ) . ", ";

        $sOrder = substr_replace($sOrder, "", -2);
    }
    //echo $sOrder;
    /* Filtro de search */
    $sWhere = "";
    $mWhere = array();
//    if (isset($_GET['sSearch']) && $_GET['sSearch'] != "") {
//    print_r($_GET['search']);
    $search = $_GET['search'];
    if (isset($search['value']) && $search['value'] !== '') {
        $sWhere = '(';
        for ($i = 1; $i < count($aColumns); $i++) {
            if ($_GET['columns'][$i]['searchable'] == 'true') {
                $sWhere .= $aColumns[$i] . " LIKE '%" . ($search['value']) . "%' OR ";
            }
//            $mWhere = array_merge($mWhere, array($aColumns[$i] => new MongoRegex('/' . $search['value'] . '/i')));
        }
        $sWhere = substr_replace($sWhere, "", -3);
        $sWhere .= ')';
    }

    /* Individual column filtering, yet not implemented by MT. */
    for ($i = 1; $i < count($aColumns); $i++) {
        if (isset($_GET['bSearchable_' . $i]) && $_GET['bSearchable_' . $i] == "true" && $_GET['sSearch_' . $i] != '') {
            if ($sWhere == "") {
                $sWhere = " where ";
            } else {
                $sWhere .= " AND ";
            }
            $sWhere .= $aColumns[$i] . " LIKE '%" . ($_GET['sSearch_' . $i]) . "%' ";
        }
    }
    $where_in = isset($_GET['where_in'])?$_GET['where_in']:"";
    //Para where_in 
    if($where_in!=""){
        if ($sWhere != "")
                $sWhere .= " AND ";
        $sWhere.=$where_in;
    }
//    $page = isset($_GET['iDisplayStart']) ? $_GET['iDisplayStart'] : 0;
    $page = isset($_GET['start']) ? $_GET['start'] : 0;
//    $offset = isset($_GET['iDisplayLength']) ? $_GET['iDisplayLength'] : 0;
    $offset = isset($_GET['length']) ? $_GET['length'] : 0;
    //return json_encode($sOrder);
    $rResult = $model->get_all($offset, ($page == null ? 0 : $page), $sWhere, $sOrder);
//    var_dump($rResult);
    $total = $model->get_total($where_in!=""?$where_in:"");

    $filtrados = $model->get_total($sWhere);
    /*
     * Output
     */
    $output = array(
//        "sEcho" => intval(isset($_GET['sEcho']) ? $_GET['sEcho'] : ''),
        "draw" => intval(isset($_GET['draw']) ? $_GET['draw'] : ''),
//        "iTotalRecords" => $iTotal,
        "recordsTotal" => $total,
//        "iTotalDisplayRecords" => $iFilteredTotal,
        "recordsFiltered" => $filtrados,
//        "aaData" => array()
        "data" => array()
    );

//    $output['aaData'] = get_data($rResult, $aColumns, $cllAccion, $es_mas);
    $output['data'] = get_data($rResult, $aColumns, $cllAccion, $es_mas);


    return json_encode($output);
}

function getColumnAccion($cllAccion, $id, $data = null) {
    $CI = & get_instance();
    $controller_name = strtolower($CI->uri->segment(1));
    if (count($cllAccion) == 0)
        return;

    $accion = "";
    foreach ($cllAccion as $acc) {
        $funcion = $acc['function'];
        if ($data !== null && strpos($funcion, "$") !== false) {
            //$id = mb_strtolower(reset($data));
            extract($data);
            eval("\$funcion = \"$funcion\";");
        } else {
            $funcion .= "/$id";
        }


        $accion.=anchor($controller_name . "/" . $funcion . "?width=" . (isset($acc['width']) ? $acc['width'] : 300) . "&height=" . (isset($acc['height']) ? $acc['height'] : 450), $CI->lang->line($acc['common_language']), array('class' => 'thickbox', 'title' => $CI->lang->line($controller_name . $acc['language']))) . nbs();
    }
    return $accion;
}

function get_data($rows, $aColumns, $cllAccion, $es_mas = false) {
    $resp = array();
    $id = "";
//        var_dump($rows);
    foreach ($rows as $aRow) {
//        var_dump($aRow);
        $row = array();
        for ($i = 0; $i < count($aColumns); $i++) {
//			echo gettype($aColumns[$i]);
            if (gettype($aColumns[$i]) == "string") {
                if ($i == 0) {
//                    var_dump($aRow);
                    $id = mb_strtolower($aRow[$aColumns[$i]]);
                    $row[] = (!$es_mas) ? "<input type='checkbox' id='empleado_$id' value='" . $id . "'/>" : '<img src="' . asset_url() . '/images/table/add.png">';
                } else if ($aColumns[$i] == "email") {
                    $row[] = mailto($aRow['email'], character_limiter($aRow['email'], 10));
                } else if (trim($aColumns[$i]) != '') {
                    /* General output */
//                    $row[] = '-';                    
                    $row[] = get_value($aRow, $aColumns[$i]);
                }
            } else {
                $row[] = get_value($aRow, $aColumns[$i], $id);
            }
        }

        //$acciones = getColumnAccion($cllAccion, $id);
        $acciones = getColumnAccion($cllAccion, $id, $aRow);
        if (count($cllAccion))
            $row[] = $acciones;

        $resp[] = $row;
    }
    return $resp;
}

function get_value($row, $column_key, $id = null) {
    if (gettype($column_key) == 'array') {
        $value = $row[$column_key[0]];
        $object = $column_key[1];
        $tag = sprintf($object[1], $id);
        //tag - styles
        return '<' . $object[0] . ' ' . $tag . '>' . $value . '</' . $object[0] . '>';
    } elseif (array_key_exists($column_key, $row)) {
        $dato = $row[$column_key];
        if (gettype($dato) == "object") {
            if (get_class($dato) == 'MongoDate')
                return date('Y-M-d H:i:s.u', $dato->sec);
            if (get_class($dato) == 'MongoId')
                return (string) $dato;
        }

        return trim($dato) == '' ? '-' : $dato;
    } else
        return "-";
}
