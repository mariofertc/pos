<?php
echo form_open('almacenes/save/'.$almacen_info->almacen_id,array('id'=>'almacen_form'));
?>
<div id="required_fields_message"><?php echo $this->lang->line('common_fields_required_message'); ?></div>
<ul id="error_message_box"></ul>
<fieldset id="supplier_basic_info">
<legend><?php echo $this->lang->line("almacenes_basic_information"); ?></legend>

<div class="field_row required">	
<?php echo form_label($this->lang->line('almacenes_nombre').':', 'nombre', array('class'=>'required')); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'nombre',
		'id'=>'company_name_input',
		'value'=>$almacen_info->nombre)
	);?>
	</div>
</div>

<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('almacenes_direccion').':', 'direccion'); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'direccion',
		'id'=>'direccion',
		'value'=>$almacen_info->direccion)
	);?>
	</div>
</div>

<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('almacenes_utilidad').':', 'utilidad'); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'utilidad',
		'id'=>'utilidad',
		'value'=>$almacen_info->utilidad)
	);?>
	</div>
</div>
<?php
echo form_submit(array(
	'name'=>'submit',
	'id'=>'submit',
	'value'=>$this->lang->line('common_submit'),
	'class'=>'submit_button float_right')
);
?>
</fieldset>
<?php 
echo form_close();
?>
<script type='text/javascript'>

//validation and submit handling
$(document).ready(function()
{
	$('#almacen_form').validate({
		submitHandler:function(form)
		{
			$(form).ajaxSubmit({
			success:function(response)
			{
				tb_remove();
				post_almacen_form_submit(response);
			},
			dataType:'json'
		});

		},
		errorLabelContainer: "#error_message_box",
 		wrapper: "li",
		rules: 
		{
			nombre: "required",
			utilidad: 
			{
				range: [0, 100],
				number:true
			}
   		},
		messages: 
		{
     		nombre: "<?php echo $this->lang->line('almacenes_name_required'); ?>",
			utilidad: 
			{
				range: "<?php echo $this->lang->line('almacenes_utilidad_range'); ?>",
				number: "<?php echo $this->lang->line('almacenes_utilidad_number'); ?>"
			}
		}
	});
});
</script>