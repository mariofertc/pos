<?php 
//OJB: Check if for excel export process
if($export_excel == 1){
	ob_start();
	$this->load->view("partial/header_excel");
}else{
	$this->load->view("partial/header");
} 
?>
<script type="text/javascript">
  //enable_search('<?php echo site_url("reports/suggest")?>','<?php echo $this->lang->line("common_confirm_search")?>');
</script>

<div id="page_title" style="margin-bottom:8px;"><?php echo $title ?></div>
<div id="page_subtitle" style="margin-bottom:8px;"><?php echo $subtitle ?></div>

<div id="table_action_header">
<ul>
<li class="float_right">
		<img src='<?php echo base_url()?>images/spinner_small.gif' alt='spinner' id='spinner' />
		<?php 	if(isset($inventario)){if($inventario=='low')
					echo form_open("reports/search",array('id'=>'search_form')); 
				else
					echo form_open("reports/search_general",array('id'=>'search_form')); }
				?>
		<input type="text" name ='search' id='search'/>
		</form>
		</li>
</ul></div>

<div id="table_holder">
	<table class="tablesorter report" id="sortable_table">
		<thead>
			<tr>
				<?php foreach ($headers as $header) { ?>
				<th><?php echo $header; ?></th>
				<?php } ?>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($data as $row) { ?>
			<tr>
				<?php foreach ($row as $cell) { ?>
				<!--verifica si hay menos cantidad que en inventario.-->
				    <?php $paint = "<td";?>
					<?php if(count($row)>2) { ?>
						<?php if(is_numeric($row[count($row)-3]) and is_numeric($row[count($row)-2]))  { ?>
						<?php  if($row[count($row)-3]<=$row[count($row)-2]) $paint .= " class='paint'";?>
						<?php }?>
					<?php }?>
				<?php echo $paint.">"; ?>
				<?php echo $cell; ?></td>
				<?php } ?>
			</tr>
			<?php } ?>
		</tbody>
	</table>
</div>
<div id="report_summary">
<?php foreach($summary_data as $name=>$value) { ?>
	<div class="summary_row"><?php echo $this->lang->line('reports_'.$name). ': '.($name=="items"?$value:to_currency($value)); ?></div>
<?php }?>
</div>
<?php 
if($export_excel == 1){
	$this->load->view("partial/footer_excel");
	$content = ob_end_flush();
	
	$filename = trim($filename);
	$filename = str_replace(array(' ', '/', '\\'), '', $title);
	$filename .= "_Export.xls";
	header('Content-type: application/ms-excel');
	header('Content-Disposition: attachment; filename='.$filename);
	echo $content;
	die();
	
}else{
	$this->load->view("partial/footer"); 
?>

<script type="text/javascript" language="javascript">

function init_table_sorting()
{
	//Only init if there is more than one row
	if($('.tablesorter tbody tr').length >1)
	{
		$("#sortable_table").tablesorter(); 
	}
}
$(document).ready(function()
{
	init_table_sorting();
});
</script>
<?php 
} // end if not is excel export 
?>