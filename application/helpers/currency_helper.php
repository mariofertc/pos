<?php
function to_currency($number) {
    if ($number >= 0) {
        return '$' . number_format($number, config('precision'), '.', '');
    } else {
        return '-$' . number_format(abs($number), config('precision'), '.', '');
    }
}

function to_currency_no_money($number) {
    return number_format(str_replace(',', '.', $number), config('precision'), '.', '');
}