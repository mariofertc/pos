<?php
echo form_open('abonos/find_abonos_info/1',array('id'=>'item_number_form'));
?>
<?php
echo form_close();
echo form_open('abonos/save_inventory/1',array('id'=>'item_form'));
?>
<fieldset id="inv_item_basic_info">
<legend><?php echo $this->lang->line("items_basic_information"); ?></legend>

<table align="center" border="0" bgcolor="#CCCCCC">
<div class="field_row clearfix">
<tr>
<td>	
<?php echo form_label($this->lang->line('sales_amount_tendered').':', 'name',array('class'=>'wide')); 
?>
</td>
<td>
	<?php $inumber = array (
		'name'=>'item_number',
		'id'=>'item_number',
		'value'=>to_currency($tot_pagado),
		'style'       => 'border:none',
		'readonly' => 'readonly'
	);
	
		echo form_input($inumber)
	?>
</td>
</tr>

</div>	
</table>

<div class="field_row clearfix">
  <div class='form_field'></div>
</div>
</fieldset>
<?php 
echo form_close();
?>

<?php echo $controller_name; ?>