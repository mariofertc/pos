<?php
function to_dia($number)
{
	if($number > 1)
	{
		return $number . ' días';
    }
    else if($number == 1)
    {
    	return $number . ' día';
    }
	else
	{
		return '';
	}
}


// function to_currency_no_money($number)
// {
	// return number_format(str_replace(',','.',$number), 2, '.', '');
// }
?>