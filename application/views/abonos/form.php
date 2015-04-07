<div id="required_fields_message"><?php echo $this->lang->line('common_fields_required_message'); ?></div>
<ul id="error_message_box"></ul>
<?php
echo form_open('items/find_item_info/1',array('id'=>'item_number_form'));
?>
<?php
echo form_close();
echo form_open('abonos/save/'.$sale_id.'/'.$payment_id,array('id'=>'item_form'));
?>
<fieldset id="item_basic_info">
<legend><?php echo $this->lang->line("abonos_basic_information"); ?></legend>

<div class="field_row clearfix">
<?php echo form_label($this->lang->line('sales_date').':', 'name',array('class'=>'required wide')); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'date',
		'id'=>'date',
		'value'=>date('m/d/Y'))
	);?>
	</div>
</div>

<div class="field_row clearfix">
<?php echo form_label($this->lang->line('sales_payment').':', 'name',array('class'=>'wide')); ?>
	<div class='form_field'>
	<?php echo form_dropdown('abono_type', $payment_options);?>
	</div>
</div>

<div class="field_row clearfix">
<?php echo form_label($this->lang->line('sales_amount_tendered').':', 'abono_amount_l',array('class'=>'required wide')); ?>
	<div class='form_field'>
	<?php echo form_input(array(
		'name'=>'abono_amount',
		'id'=>'abono_amount',
		// 'value'=>to_currency_no_money($debe))
		'value'=>$debe)
	);?>
	</div>
</div>

<div class="field_row clearfix">
<?php echo form_label($this->lang->line('sales_comment').':', 'abono_comment_l',array('class'=>'small_wide')); ?>
	<div class='form_field'>
	<?php echo form_textarea(array('name'=>'abono_comment','value'=>null,'rows'=>'4','cols'=>'17', 'id'=>'comment'));?>
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
	$('#date').datePicker({startDate: '01/01/1970'});
	//$("submit").attr("target","_blank");

	//$("#category").autocomplete("<?php echo site_url('items/suggest_category');?>",{max:100,minChars:0,delay:10});
    //$("#category").result(function(event, data, formatted){});
	//$("#category").search();


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
				post_abono_form_submit(response);
				//PrinterJob job = PrinterJob.getPrinterJob();
				// jQuery(".page_item a").attr("target","_blank");
			},
			dataType:'json'
		});

		},
		errorLabelContainer: "#error_message_box",
 		wrapper: "li",
		rules:
		{
			date:
			{
				required:true,
				date:true
			},
			abono_amount:
			{
				required:true,
				number:true,
				//min:0.001
			}
   		},
		messages:
		{
			date:"<?php echo $this->lang->line('abonos_date_required'); ?>",
			abono_amount:
			{
				required:"<?php echo $this->lang->line('abonos_amount_tendered_required'); ?>",
				number:"<?php echo $this->lang->line('abonos_amount_tendered_number'); ?>",
				//min:"<?php echo $this->lang->line('items_cost_price_number'); ?>"
			}
		}
	});
	
});
</script>