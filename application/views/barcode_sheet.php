<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
        "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title><?php echo $this->lang->line('items_generate_barcodes'); ?></title>
</head>
<body>
<table width='50%' align='center' cellpadding='20'>
<tr>
<?php 
$count = 0;
foreach($items as $item)
{
	$barcode = $item['id'];
	$text = $item['name'];
	
	if ($count % 5 ==0 and $count!=0)
	{
		echo '</tr><tr>';
	}
	//Prueba
	//echo "<td><IMG SRC='index.php?c=barcode&barcode=123456&width=320&height=200'></td>";
	 // echo "<td><img src='index.php?c=barcode&barcode=$barcode&text=$text&width=256' /></td>";
	
	//Este valio.
	// echo "<td><img src='http://mitoyo/sutienda/web/index.php/barcode?barcode=$barcode&text=$text&width=256' /></td>";
	echo "<td><img src='http://mitoyo/SuTienda/SuTienda/index.php/barcode?barcode=$barcode&text=$text&width=220&height=80' /></td>";
	//Hasta aqui.
	
	//echo "<td><img src='http://mitoyo/sutienda/web/index.php/barcode/barcode=$barcode/text=$text/width=256' /></td>";
	//echo "<td><img src='index.php?c=barcode&barcode=$barcode&text=$text&width=256' /></td>";
	//echo "c=barcode&barcode=$barcode&text=$text&width=256'";
	// echo "<IMG SRC='index.php/c:barcodes/barcode:HELLO/quality:75' />";
	$count++;
}
?>
</tr>
</table>
</body>
</html>
