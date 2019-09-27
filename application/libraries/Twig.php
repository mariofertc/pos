<?php
/**
 * Part of CodeIgniter Simple and Secure Twig
 *
 * @author     Kenji Suzuki <https://github.com/kenjis>
 * @license    MIT License
 * @copyright  2015 Kenji Suzuki
 * @link       https://github.com/kenjis/codeigniter-ss-twig
 */

class Twig
{
	/*private $functions_asis = [
		'base_url', 'site_url'
	];
	private $functions_safe = [
		'form_open', 'form_close', 'form_error', 'set_value', 'form_hidden'
	];*/

	private $twig;
	private $loader;
	private $CI;
	private $_template_locations = array();
	private $_themes_base_dir;
	private $_module;
	private $_globals = array();
	private $_data = array();
	private $config;

	public function __construct()
	{
		if (ENVIRONMENT === 'production')
		{
			$debug = FALSE;
		}
		else
		{
			$debug = TRUE;
		}
		$this->CI =& get_instance();
		$this->config = $this->CI->config->item('twig');
		$this->_themes_base_dir = APPPATH . $this->config['themes_base_dir'];
		$this->setTemplateLocations($this->config['default_theme']);

		if ($this->loader === null) {
			$this->loader = new \Twig_Loader_Filesystem($this->_template_locations);
//			$this->loader = new \Twig_Loader_Filesystem([VIEWPATH]);
		}

		$twig = new \Twig_Environment($this->loader, [
			'cache'      => APPPATH . '/cache/twig',
			'debug'      => $debug,
			'autoescape' => TRUE,
		]);

		if ($debug)
		{
			$twig->addExtension(new \Twig_Extension_Debug());
		}
		$this->twig = $twig;
		
		$this->theme($this->config['default_theme'])
			 ->layout($this->config['default_layout']);
			 //->template($this->_config['default_template']);

		$this->addCIFunctions();
	}
	
	public function theme($theme)
	{
		if(!is_dir(realpath($this->_themes_base_dir. $theme)))
		{
			log_message('error', 'Twiggy: requested theme '. $theme .' has not been loaded because it does not exist.');
			show_error("Theme does not exist in {$this->_themes_base_dir}{$theme}.");
		}

		$this->_theme = $theme;
		$this->setTemplateLocations($theme);

		return $this;
	}
	public function layout($name)
	{
		$this->_layout = $name;
		//$this->_twig->addGlobal('_layout', '_layouts/'. $this->_layout . $this->config['template_file_ext']);
		$this->twig->addGlobal('_layout', '_layouts/'. $this->_layout . $this->config['template_file_ext']);

		return $this;
	}
	
	/**
	* Set template locations
	*
	* @access	private
	* @param 	string	name of theme to load
	* @return	void
	*/
	private function setTemplateLocations($theme)
	{
		// Reset template locations array since we loaded a different theme
		$this->_template_locations = array();
		
		// Check if HMVC is installed.
		// NOTE: there may be a simplier way to check it but this seems good enough.
		if(method_exists($this->CI->router, 'fetch_module'))
		{
			$this->_module = $this->CI->router->fetch_module();

			// Only if the current page is served from a module do we need to add extra template locations.
			if(!empty($this->_module))
			{
				$module_locations = Modules::$locations;

				foreach($module_locations as $loc => $offset)
				{
					/* Only add the template location if the same exists, otherwise
					you'll need always a directory for your templates, even your module
					won't use templates */
					if ( is_dir($loc . $this->_module . '/' . $this->config['themes_base_dir'] . $theme) )
						$this->_template_locations[] = $loc . $this->_module . '/' . $this->config['themes_base_dir'] . $theme;
				}
			}
		}

		$this->_template_locations[] =  $this->_themes_base_dir . $theme;

		// Reset the paths if needed.
		if(is_object($this->loader))
		{
			$this->loader->setPaths($this->_template_locations);
		}
	}

	public function setLoader($loader)
	{
		$this->loader = $loader;
	}

	public function display($view, $params = [])
	{ 
		$params = array_merge($this->_data,$params);
		
		$view = $view . '.html.twig';
		$CI =& get_instance();
		$CI->output->set_output($this->twig->display($view, $params));
	}
	
	public function render($view, $params = [])
	{ 
		$params = array_merge($this->_data,$params);
		$view = $view . '.html.twig';
		$CI =& get_instance();
		return $CI->output->set_output($this->twig->render($view, $params));
	}
	public function renderView($view, $params = [])
	{ 
		$params = array_merge($this->_data,$params);
		$view = $view . '.html.twig';
		$CI =& get_instance();
		return $this->twig->render($view, $params);
	}

	private function addCIFunctions()
	{
		// as is functions
		foreach ($this->config['functions_asis'] as $function)
		{
			if (function_exists($function))
			{
				$this->twig->addFunction(
					new \Twig_SimpleFunction(
						$function,
						$function
					)
				);
			}
		}

		// safe functions
		foreach ($this->config['functions_safe'] as $function)
		{
			if (function_exists($function))
			{
				$this->twig->addFunction(
					new \Twig_SimpleFunction(
						$function,
						$function,
						['is_safe' => ['html']]
					)
				);
			}
		}

		// customized functions
		if (function_exists('anchor'))
		{
			$this->twig->addFunction(
				new \Twig_SimpleFunction(
					'anchor',
					[$this, 'safe_anchor'],
					['is_safe' => ['html']]
				)
			);
		}
	}

	/**
	 * @param string $uri
	 * @param string $title
	 * @param array $attributes [changed] only array is acceptable
	 * @return string
	 */
	public function safe_anchor($uri = '', $title = '', $attributes = [])
	{
		$uri = html_escape($uri);
		$title = html_escape($title);
		
		$new_attr = [];
		foreach ($attributes as $key => $val)
		{
			$new_attr[html_escape($key)] = html_escape($val);
		}

		return anchor($uri, $title, $new_attr);
	}

	/**
	 * @return \Twig_Environment
	 */
	public function getTwig()
	{
		return $this->twig;
	}
	
	/**
	 * Set data
	 * 
	 * @access	public
	 * @param 	mixed  	key (variable name) or an array of variable names with values
	 * @param 	mixed  	data
	 * @param 	boolean	(optional) is this a global variable?
	 * @return	object 	instance of this class
	 */

	public function set($key, $value = false, $global = FALSE)
	{
		if(is_array($key))
		{
			foreach($key as $k => $v) $this->set($k, $v, $global);
		}
		else
		{
			if($global)
			{
				$this->twig->addGlobal($key, $value);
				$this->_globals[$key] = $value;
			}
			else
			{
			 	$this->_data[$key] = $value;
			}	
		}

		return $this;
	}
}