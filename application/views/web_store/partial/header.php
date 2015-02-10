<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<base href="<?php echo base_url();?>" />
	<title><?php echo $this->config->item('company').' -- '.$this->lang->line('common_powered_by').' PHP Point Of Sale'; ?></title>
	<link rel="stylesheet" rev="stylesheet" href="<?php echo base_url();?>css/phppos.css" />
	<link rel="stylesheet" rev="stylesheet" href="<?php echo base_url();?>css/phppos_print.css"  media="print"/>

	<link href='http://fonts.googleapis.com/css?family=Roboto:400,300' rel='stylesheet' type='text/css'/>
<style type="text/css">
html {
    overflow: auto;
}
</style>
</head>
<body><div id="menubar">
	<div id="menubar_container">
		<div id="menubar_company_info">
		<span id="company_title"><?php echo $this->config->item('company'); ?></span><br />
		<span style='font-size:8pt;'><?php echo $this->lang->line('common_powered_by').' PHP Point Of Sale'; ?></span>
	</div>
		<div id="menubar_navigation">
			<div class="menu_item">
				<a href="<?php echo site_url($controller_name);?>">
				<img src="<?php echo base_url().'images/menubar/home.png';?>" border="0" alt="Menubar Image" /></a><br />
				<a href="<?php echo site_url($controller_name);?>"><?php echo $this->lang->line("module_home") ?></a>
			</div>

			
		</div>

		<div id="menubar_footer">
		<?//php echo $this->lang->line('common_welcome')." $user_info->first_name $user_info->last_name! | "; ?>
		<?php echo $this->lang->line('common_welcome')."Guest! | "; ?>
		<?php echo anchor("home/logout",$this->lang->line("common_logout")); ?>
		</div>

		<div id="menubar_date">
		<span style='font-size:8pt;'>
		<?php echo strftime("%d de %B del %Y %H:%M"); //echo date('F d, Y h:i a');?>
		<?php //echo strftime("%A %d de %B del %Y %H:%M"); //echo date('F d, Y h:i a');?>
		<?php //echo date('d-m-Y h:i a') ?>
		</span>
		</div>

	</div>
</div>
<?php //echo getCwd();?>
<?php //echo var_dump($controller_name);?>
<div id="content_area_wrapper">
<?php if($controller_name === "items"){
echo "<div id='content_area_items'>";
}else
 { echo "<div id='content_area'>"; } ?>