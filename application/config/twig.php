<?php  if(!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Twiggy - Twig template engine implementation for CodeIgniter
 *
 * Twiggy is not just a simple implementation of Twig template engine 
 * for CodeIgniter. It supports themes, layouts, templates for regular
 * apps and also for apps that use HMVC (module support).
 * 
 * @package   			CodeIgniter
 * @subpackage			Twiggy
 * @category  			Config
 * @author    			Edmundas Kondrašovas <as@edmundask.lt>
 * @license   			http://www.opensource.org/licenses/MIT
 * @version   			0.8.5
 * @copyright 			Copyright (c) 2012 Edmundas Kondrašovas <as@edmundask.lt>
 */

/*
|--------------------------------------------------------------------------
| Template file extension
|--------------------------------------------------------------------------
|
| This lets you define the extension for template files. It doesn't affect
| how Twiggy deals with templates but this may help you if you want to
| distinguish different kinds of templates. For example, for CodeIgniter
| you may use *.html.twig template files and *.html.jst for js templates.
|
*/

$config['twig']['template_file_ext'] = '.html.twig';


/*
|--------------------------------------------------------------------------
| Syntax Delimiters
|--------------------------------------------------------------------------
|
| If you don't like the default Twig syntax delimiters or if they collide 
| with other languages (for example, you use handlebars.js in your
| templates), here you can change them.
|
| Ruby erb style:
|
|	'tag_comment' 	=> array('<%#', '#%>'),
|	'tag_block'   	=> array('<%', '%>'),
|	'tag_variable'	=> array('<%=', '%>')
|
| Smarty style:
|
|    'tag_comment' 	=> array('{*', '*}'),
|    'tag_block'   	=> array('{', '}'),
|    'tag_variable'	=> array('{$', '}'),
|
*/

$config['twig']['delimiters'] = array
(
	'tag_comment' 	=> array('{#', '#}'),
	'tag_block'   	=> array('{%', '%}'),
	'tag_variable'	=> array('{{', '}}')
);


/*
|--------------------------------------------------------------------------
| Environment Options
|--------------------------------------------------------------------------
|
| These are all twig-specific options that you can set. To learn more about
| each option, check the official documentation.
|
| NOTE: cache option works slightly differently than in Twig. In Twig you
| can either set the value to FALSE to disable caching, or set the path
| to where the cached files should be stored (which means caching would be
| enabled in that case). This is not entirely convenient if you need to 
| switch between enabled or disabled caching for debugging or other reasons.
|
| Therefore, here the value can be either TRUE or FALSE. Cache directory
| can be set separately.
|
*/

$config['twig']['environment']['cache']              	= FALSE;
$config['twig']['environment']['debug']              	= TRUE;
$config['twig']['environment']['charset']            	= 'utf-8';
$config['twig']['environment']['base_template_class']	= 'Twig_Template';
$config['twig']['environment']['auto_reload']        	= NULL;
$config['twig']['environment']['strict_variables']   	= FALSE;
$config['twig']['environment']['autoescape']         	= FALSE;
$config['twig']['environment']['optimizations']      	= -1;


/*
|--------------------------------------------------------------------------
| Twig Cache Dir
|--------------------------------------------------------------------------
|
| Path to the cache folder for compiled twig templates. It is relative to
| CodeIgniter's base directory.
|
*/

$config['twig']['twig_cache_dir'] = APPPATH . 'cache/twig/';

/*
|--------------------------------------------------------------------------
| Themes Base Dir
|--------------------------------------------------------------------------
|
| Directory where themes are located at. This path is relative to 
| CodeIgniter's base directory OR module's base directory. For example:
|
| $config['themes_base_dir'] = 'themes/';
|
| It will actually mean that themes should be placed at:
|
| {APPPATH}/themes/ and {APPPATH}/modules/{some_module}/themes/.
|
| NOTE: modules do not necessarily need to be in {APPPATH}/modules/ as
| Twiggy will figure out the paths by itself. That way you can package 
| your modules with themes.
|
| Also, do not forget the trailing slash!
|
*/

$config['twig']['themes_base_dir'] = 'themes/';


/*
|--------------------------------------------------------------------------
| Include APPPATH
|--------------------------------------------------------------------------
|
| This lets you include the APPPATH for the themes base directory (only for
| the application itself, not the modules). See the example below.
|
| Suppose you have:
| $config['themes_base_dir'] = 'themes/'
| $config['include_apppath'] = TRUE
|
| Then the path will be {APPPATH}/themes/ but if you set this option to
| FALSE, then you will have themes/.
|
| This is useful for when you want to have the themes folder outside the
| application (APPPATH) folder.
|
*/

$config['twig']['include_apppath'] = TRUE;


/*
|--------------------------------------------------------------------------
| Default theme
|--------------------------------------------------------------------------
*/

$config['twig']['default_theme'] = 'default';


/*
|--------------------------------------------------------------------------
| Default layout
|--------------------------------------------------------------------------
*/

$config['twig']['default_layout'] = 'index';


/*
|--------------------------------------------------------------------------
| Default template
|--------------------------------------------------------------------------
*/

$config['twig']['default_template'] = 'index';


/*
|--------------------------------------------------------------------------
| Auto-reigster functions
|--------------------------------------------------------------------------
|
| Here you can list all the functions that you want Twiggy to automatically
| register them for you.
|
| NOTE: only registered functions can be used in Twig templates. 
|
*/

$config['twig']['functions_asis'] = array(
	'site_url', 'base_url','js_url', 'asset_url','css_url',
	'language',
	'set_value',
	'line',
	'date',
	'getBasePath',
	'uri_string',
	'current_url',
	'has_permiso',
	'has_visibility',
	'is_login',
	'is_admin',
	'info_user',
	'get_server',
	'get_menu_programas',
	'get_menu_quienes_somos',
	'asistio',
	'explode',
	'to_currency',
	'to_currency_no_money',
	'check_user_pmp',
	'tipos_de_incidencia',
	'get_gravatar_url',
	'get_tags_documentos',
	'retirar_etiquetas_html',
	'hex2RGB',
	'config',
	'host',
	'validation_errors'
);
$config['twig']['functions_safe'] = array(
	'anchor', 'form_open_multipart',
	'form_open',
	'form_label',
	'form_input',
	'form_textarea',
	'form_multiselect',
	'form_checkbox',
	'form_password',
	'form_upload',
	'form_submit',
	'form_close',
	'img',
	'form_dropdown',
	'form_hidden',
	'getWaitLoader',
	'collection_size',
	'form_button'
);


/*
|--------------------------------------------------------------------------
| Auto-reigster filters
|--------------------------------------------------------------------------
|
| Much like with functions, list filters that you want Twiggy to 
| automatically register them for you.
|
| NOTE: only registered filters can be used in Twig templates. Also, keep
| in mind that a filter is nothing more than just a regular function that
| acceps a string (value) as a parameter and outputs a modified/new string.
|
*/

$config['twig']['register_filters'] = array
(

);

/*
|--------------------------------------------------------------------------
| Title separator
|--------------------------------------------------------------------------
|
| Lets you specify the separator used in separating sections of the title 
| variable.
|
*/

$config['twig']['title_separator'] = '|';