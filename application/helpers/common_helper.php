<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
  |==========================================================
  | Language
  |==========================================================
  |
 */
function host() {
    return $_SERVER['HTTP_HOST'];
}

function line($text) {
    $CI = & get_instance();
    return $CI->lang->line($text);
}

function config($var){
    $CI = & get_instance();
    return $CI->config->item($var);
}

function retirar_etiquetas_html($text){
  return strip_tags($text);
}

/* End of file common.php */
/* Location: ./helpers/common.php */