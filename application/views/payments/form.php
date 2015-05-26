<?php
echo form_open('payments/save/'.$payment_info->payment_id,array('id'=>'payment_form'));
?>
<div id="required_fields_message"><?php echo $this->lang->line('common_fields_required_message'); ?></div>
<ul id="error_message_box"></ul>
<fieldset id="supplier_basic_info">
<legend><?php echo $this->lang->line("payments_basic_information"); ?></legend>

<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('payments_type').':', 'payment_types', array('class'=>'required')); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'payment_type',
		'id'=>'payment_type_input',
		'value'=>$payment_info->payment_type)
	);?>
	</div>
</div>

<?php //$this->load->view("payment/form_basic_info"); ?>
<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('payments_por_cobrar').':', 'por_cobrar_l'); ?>
	<div class='form_field'>
	<?php echo form_checkbox(array(
		'name'=>'por_cobrar',
		'id'=>'por_cobrar_input',
		'value'=>1,
		'checked'=>($payment_info->por_cobrar)? 1 : 0)
	);?>
	</div>
</div>
<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('payments_time_limit').':', 'have_plazo_l'); ?>
	<div class='form_field'>
	<?php echo form_checkbox(array(
		'name'=>'have_plazo',
		'id'=>'have_plazo_input',
		'value'=>1,
		'checked'=>($payment_info->have_plazo)? 1 : 0)
	);?>
	</div>
</div>
<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('payments_days').':', 'payment_day'); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'payment_days',
		'id'=>'payment_days_input',
		'value'=>$payment_info->payment_days)
	);?>
	</div>
</div>
<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('payments_months').':', 'payment_month'); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'payment_months',
		'id'=>'payment_months_input',
		'value'=>$payment_info->payment_months)
	);?>
	</div>
</div>
<div class="field_row clearfix">	
<?php echo form_label($this->lang->line('payments_shares').':', 'shares'); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'share',
		'id'=>'share_input',
		'value'=>$payment_info->share)
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
	$('#payment_form').validate({
		submitHandler:function(form)
		{
			$(form).ajaxSubmit({
			success:function(response)
			{
				tb_remove();
				post_payment_form_submit(response);
			},
			dataType:'json'
		});

		},
		errorLabelContainer: "#error_message_box",
 		wrapper: "li",
		rules: 
		{
			payment_type: "required",
   		},
		messages: 
		{
     		payment_type: "<?php echo $this->lang->line('payments_type_required'); ?>",
     		last_name: "<?php echo $this->lang->line('common_last_name_required'); ?>",
     		email: "<?php echo $this->lang->line('common_email_invalid_format'); ?>"
		}
	});
});
</script>