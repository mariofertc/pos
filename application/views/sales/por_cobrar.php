<?php $this->load->view("partial/header"); ?>
<div id="edit_sale_wrapper">
	<h1><?php echo $this->lang->line('sales_edit_sale'); ?> POS <?php echo $sale_info['sale_id']; ?></h1>
	
	<?php echo form_open("abonos/save/".$sale_info['sale_id']."/".$sale_info['payment_id'],array('id'=>'abonos_edit_form')); ?>
	<ul id="error_message_box"></ul>
	
	<div class="field_row clearfix">
	<?php echo form_label($this->lang->line('sales_receipt').':', 'customer'); ?>
		<div class='form_field'>
			<?php echo anchor('sales/receipt/'.$sale_info['sale_id'], 'POS '.$sale_info['sale_id'], array('target' => '_blank'));?>
		</div>
	</div>
	
	<div class="field_row clearfix">
	<?php echo form_label($this->lang->line('sales_date').':', 'date'); ?>
		<div class='form_field'>
			<?php echo form_input(array('name'=>'date','value'=>date('m/d/Y'), 'id'=>'date'));?>
		</div>
	</div>
	
	<div class="field_row clearfix">
	<?php echo form_label($this->lang->line('sales_customer').':', 'customer'); ?>
		<div class='form_field'>
			<?php echo $customers[$sale_info['customer_id']];?>
			<?php //echo anchor('customers/view/'.$sale_info['customer_id']."/width:$width", $customers[$sale_info['customer_id']]);?>
			<?php echo form_hidden('employee_id', $sale_info['employee_id']);?>
			<?php echo form_hidden('customer_id', $sale_info['customer_id']);?>
		</div>
	</div>
	
	<div class="field_row clearfix">
	<?php echo form_label($this->lang->line('sales_payment').':', 'customer'); ?>
		<div class='form_field'>
			<?php echo form_dropdown('abono_type', $payment_options);?>
		</div>
	</div>
	
	<div class="field_row clearfix">
	<?php echo form_label($this->lang->line('sales_amount_tendered').':', 'customer'); ?>
		<div class='form_field'>
			<?php echo form_input(array(
		'name'=>'abono_amount',
		'id'=>'abono_amount',
		'size'=>'10',
		'value'=>$debe)
		);?>
		</div>
	</div>
	
	<div class="field_row clearfix">
	<?php echo form_label($this->lang->line('sales_comment').':', 'comment'); ?>
		<div class='form_field'>
			<?php echo form_textarea(array('name'=>'abono_comment','value'=>null,'rows'=>'4','cols'=>'23', 'id'=>'comment'));?>
		</div>
	</div>
	
	<?php
	echo form_submit(array(
		'name'=>'submit',
		'id'=>'submit',
		'value'=>$this->lang->line('common_submit'),
		'class'=>'submit_button float_left')
	);
	?>
	</form>
		
	</form>
</div>
<div id="feedback_bar"></div>
<?php $this->load->view("partial/footer"); ?>

<script type="text/javascript" language="javascript">
$(document).ready(function()
{	
	$('#date').datePicker({startDate: '01/01/1970'});
	$("#sales_delete_form").submit(function()
	{
		if (!confirm('<?php echo $this->lang->line("sales_delete_confirmation"); ?>'))
		{
			return false;
		}
	});
	
	$('#abonos_edit_form').validate({
		submitHandler:function(form)
		{
			$(form).ajaxSubmit({
			success:function(response)
			{
				if(response.success)
				{
					set_feedback(response.message,'success_message',false);
				}
				else
				{
					set_feedback(response.message,'error_message',true);	
					
				}
			},
			dataType:'json'
		});

		},
		errorLabelContainer: "#error_message_box",
 		wrapper: "li",
		rules: 
		{
   		},
		messages: 
		{
		}
	});
});
</script>