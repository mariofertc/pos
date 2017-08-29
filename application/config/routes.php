<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/
$route['default_controller'] = "login";
$route['no_access/(:any)'] = "no_access/index/$1";
$route['reports/(summary_:any)/(:any)/(:any)'] = "reports/$1/$2/$3";
$route['reports/summary_:any'] = "reports/date_input_excel_export";
$route['reports/(graphical_:any)/(:any)/(:any)'] = "reports/$1/$2/$3";
$route['reports/graphical_:any'] = "reports/date_input";
//$route['reports/(inventory_:any)/(:any)'] = "reports/$1/$2";
//$route['reports/inventory_:any'] = "reports/excel_export";

$route['web_market'] = "web/market";

//Para inventario por almacenes.
$route['reports/(inventory_summary_almacen)/(:any)'] = "reports/$1/$2/$3/$4";
$route['reports/inventory_summary_almacen'] = "reports/specific_summary_almacen_input";

$route['reports/(inventory_low_almacen)/(:any)'] = "reports/$1/$2/$3/$4";
$route['reports/inventory_low_almacen'] = "reports/specific_summary_almacen_input";

//Cambio de ruta para Reportes detallados ventas. Adherir almacen.
// $route['reports/(specific_:any)/(:any)/(:any)/(:any)'] = "reports/$1/$2/$3/$4";
$route['reports/summary_sales'] = "reports/specific_summary_sale_input";

$route['reports/(detailed_sales)/(:any)/(:any)'] = "reports/$1/$2/$3";
$route['reports/detailed_sales'] = "reports/date_input";
$route['reports/(detailed_receivings)/(:any)/(:any)'] = "reports/$1/$2/$3";
$route['reports/detailed_receivings'] = "reports/date_input";
$route['reports/(specific_:any)/(:any)/(:any)/(:any)'] = "reports/$1/$2/$3/$4";
$route['reports/specific_customer'] = "reports/specific_customer_input";
$route['reports/specific_employee'] = "reports/specific_employee_input";

$route['reports/(detailed_por_cobrar)/(:any)/(:any)'] = "reports/$1/$2/$3";
$route['reports/detailed_por_cobrar'] = "reports/date_input";

$route['reports/(detailed_porpagar)/(:any)/(:any)'] = "reports/$1/$2/$3";
$route['reports/detailed_porpagar'] = "reports/date_input";

// $route['items/show/(&per_page=:num)'] = "items/show/$1";
//$route['items/show/(:num)'] = "items/show/$1";
//$route['items/show'] = "items/show";

$route['scaffolding_trigger'] = "";


/* End of file routes.php */
/* Location: ./application/config/routes.php */