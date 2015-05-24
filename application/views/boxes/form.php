<div id="required_fields_message"><?php echo $this->lang->line('common_fields_required_message'); ?></div>
<ul id="error_message_box"></ul>
<?php
echo form_open('boxes/find_box_info/'.$box_info->box_id,array('id'=>'box_number_form'));
?>
<?php
echo form_close();
echo form_open('boxes/save/'.$box_info->box_id,array('id'=>'box_form'));
?>
<fieldset id="box_basic_info">
<legend><?php echo $this->lang->line("module_close_box_desc"); ?></legend>
<div class="field_row clearfix">
<?php echo form_label($this->lang->line('sales_total_day').':', 'tot_venta_lbl',array('class'=>'wide')); ?>
	<div class='form_field'>
	<?php ?>
	<?php echo form_label('$'.$tot_venta['total'], 'tot_venta',array('class'=>'required wide'));?>
	</div>
</div>

<div class="field_row clearfix">
<?php echo form_label($this->lang->line('boxes_comment').':', 'comment',array('class'=>'wide')); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'comment',
		'id'=>'comment',
		'value'=>$box_info->comment)
	);?>
	</div>
</div>

<div class="form_field">
<?php echo form_label($this->lang->line('module_close_box_confirm')); ?>
</div>
<div class="field_row clearfix">
<?php echo form_label('Estoy deacuerdo.', 'is_agree',array('class'=>'required wide')); ?>
	<div class='form_field'>
	<?php echo form_checkbox(array(
		'name'=>'is_agree',
		'id'=>'is_agree',
		'value'=>1,
		'checked'=> null )
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
	//$("#category").autocomplete("<?php echo site_url('items/suggest_category');?>",{max:100,minChars:0,delay:10});
    //$("#category").result(function(event, data, formatted){});
	//$("#category").search();
	
	$('#box_form').validate({
		submitHandler:function(form)
		{
		   //$('#box_number').val($('#scan_box_number').val());
			$(form).ajaxSubmit({
			success:function(response)
			{
				tb_remove();
				post_box_form_submit(response);
			},
			dataType:'json'
		});

		},
		errorLabelContainer: "#error_message_box",
 		wrapper: "li",
		rules:
		{
			name:"required",
			is_agree:
			{
				required:true,
				number:true
			},
			cost_price:
			{
				required:true,
				number:true
			}
   		},
		messages:
		{
			name:"Vamos",
			is_agree:
			{
				required:"Tiene que estar deacuerdo para continuar.",
				//number:"nu"
			},
			cost_price:
			{
				required:"jjj",
				number:"hhh"
			}
		}
	});
	//window.print();
});

</script>