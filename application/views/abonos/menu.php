<?php $this->load->view("partial/header"); ?>
<div id="title_bar">
	<div id="title" class="float_left"><?php echo $this->lang->line('common_list_of').' '.$this->lang->line('module_'.$controller_name); ?></div>
</div>
<div>
<a href="<?php echo site_url('abonos').'/abonos' ?>">Abonos</a>
<a href="<?php echo site_url('abonos').'/abonos_por_persona' ?>">Abonos por Personas</a>
</div>
<?php $this->load->view("partial/footer"); ?>