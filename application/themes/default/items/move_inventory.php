<div id="required_fields_message"><?php echo $this->lang->line('common_fields_required_message'); ?></div>
<ul id="error_message_box"></ul>
<?php
echo form_open('items/find_item_info/'.$item_info->item_id,array('id'=>'item_number_form'));
?>
<?php
echo form_close();
echo form_open('items/update_inventory/'.$item_info->item_id,array('id'=>'item_form'));
?>
<fieldset id="item_basic_info">
<legend><?php echo $this->lang->line("items_basic_information"); ?></legend>
<!-- <fieldset id="item_basic_info">-->

<table align="center" border="0" bgcolor="#CCCCCC">
<div class="field_row clearfix">
<tr>
<td>	
<?php echo form_label($this->lang->line('items_item_number').':', 'name',array('class'=>'wide')); ?>
</td>
<td>
	<?php $inumber = array (
		'name'=>'item_number',
		'id'=>'item_number',
		'value'=>$item_info->item_number,
		'style'       => 'border:none',
		'readonly' => 'readonly'
	);
	
		echo form_input($inumber)
	?>
</td>
</tr>
<tr>
<td>	
<?php echo form_label($this->lang->line('items_name').':', 'name',array('class'=>'wide')); ?>
</td>
<td>	
	<?php $iname = array (
		'name'=>'name',
		'id'=>'name',
		'value'=>$item_info->name,
		'style'       => 'border:none',
		'readonly' => 'readonly'
	);
		echo form_input($iname);
		?>
</td>
</tr>
<tr>
<td>	
<?php echo form_label($this->lang->line('items_category').':', 'category',array('class'=>'wide')); ?>
</td>
<td>	
	<?php $cat = array (
		
		'name'=>'category',
		'id'=>'category',
		'value'=>$item_info->category,
		'style'       => 'border:none',
		'readonly' => 'readonly'
		);
	
		echo form_input($cat);
		?>
</td>
</tr>
<tr>
<td>
<?php echo form_label($this->lang->line('items_current_quantity').':', 'quantity',array('class'=>'wide')); ?>
</td>
<td>
	<?php $qty = array (
	
		'name'=>'quantity',
		'id'=>'quantity',
		'value'=>$item_info->quantity,
		'style'       => 'border:none',
		'readonly' => 'readonly'
		);
	
		echo form_input($qty);
	?>
</td>
</tr>


<?php foreach($almacenes_det as $alm){?>
<tr>
<td>
<?php echo form_label($alm['nombre'].':', 'quantity',array('class'=>'important wide')); ?>
</td>
<td>
	<?php $qty = array (
	
		'name'=>'q-'.$alm['id'],
		'id'=>'q-'.$alm['id'],
		'value'=>$alm['cantidad'],
		'style'       => 'border:none',
		'readonly' => 'readonly'
		);
	
		echo form_input($qty);
	?>
</td>
</tr>
<?php }?>

</div>	
</table>
<!--</fieldset>-->
<div class="field_row clearfix">
<?php echo form_label($this->lang->line('almacenes_origen').':', 'almacen_label',array('class'=>'required ssmall_wide')); ?>
	<div class='form_field'>	
		<?php echo form_dropdown('almacen_id_origen', $almacenes, $selected_almacen,"id = 'almacen_id' style='width: 163px;'");?>
	</div>
</div>

<div class="field_row clearfix">
<?php echo form_label($this->lang->line('almacenes_destino').':', 'almacen_label',array('class'=>'required ssmall_wide')); ?>
	<div class='form_field'>	
		<?php echo form_dropdown('almacen_id_destino', $almacenes, $selected_almacen,"id = 'almacen_id' style='width: 163px;'");?>
	</div>
</div>

<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('items_quantity').':', 'quantity',array('class'=>'required ssmall_wide')); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'newquantity',
		'id'=>'newquantity',
		// 'value'=>0
		)
	);?>
	</div>
</div>

<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('items_inventory_comments').':', 'description',array('class'=>'ssmall_wide')); ?>
	<div class='form_field'>
	<?php echo form_textarea(array(
		'name'=>'trans_comment',
		'id'=>'trans_comment',
		//'value'=>$item_info->description,
		'rows'=>'3',
		'cols'=>'17')		
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
	$('#item_form').validate({
		submitHandler:function(form)
		{
			/*
			make sure the hidden field #item_number gets set
			to the visible scan_item_number value
			*/
			//$('#item_number').val($('#scan_item_number').val());
			$(form).ajaxSubmit({
			success:function(response)
			{
				tb_remove();
				post_item_form_submit(response);
			},
			dataType:'json'
		});

		},
		errorLabelContainer: "#error_message_box",
 		wrapper: "li",
		rules: 
		{
			newquantity:
			{
				required:true,
				number:true
			}
   		},
		messages: 
		{
			
			newquantity:
			{
				required:"<?php echo $this->lang->line('items_quantity_required'); ?>",
				number:"<?php echo $this->lang->line('items_quantity_number'); ?>"
			}
		}
	});
});
</script>