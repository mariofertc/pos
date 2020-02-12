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

/**
 * Get the digit control of module11 control
 *
 * @param      <string>  $text   The text of 48 length to module11 proccess.
 */
function module11($text){
  $cadenaInvertida = strrev($text);
  $pivote = 2;
  $longitudCadena = strlen($cadenaInvertida);
  $cantidadTotal = 0;
  $b = 1;
  for($i = 0; $i < $longitudCadena; $i++) {
      if ($pivote == 8)
          $pivote = 2;
      $temp = substr($cadenaInvertida, $i, 1);
      $b++;
      //echo $temp . "x" . $pivote . " ";
      $temp *= $pivote;
      $pivote++;
      $cantidadTotal += $temp;
  }
  $cantidadTotal = 11 - $cantidadTotal % 11;
  if($cantidadTotal == 11){
    return 0;
  }else if($cantidadTotal == 10){
    return 1;
  }
  return $cantidadTotal;
}

/* End of file common.php */
/* Location: ./helpers/common.php */