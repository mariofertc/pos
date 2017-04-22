<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once './vendor/autoload.php';

use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Address;
use PayPal\Api\Authorization;
use PayPal\Api\Amount;
use PayPal\Api\AmountDetails;
use PayPal\Api\CreditCard;
use PayPal\Api\CreditCardToken;
use PayPal\Api\Payer;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use PayPal\Api\FundingInstrument;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use PayPal\Api\Presentation;
use PayPal\Api\InputFields;
use PayPal\Api\WebProfile;
use PayPal\Rest\ApiContext;
use PayPal\Api\OpenIdUserinfo;

class PaypalRest {
 
    private $endpoints = array ('test' => 'api.sandbox.paypal.com', 'live' => 'api.paypal.com');
    private $clientIds = array ('test' => 'AYWUPDFsda-iKaYG_Yvsski78T6QUXGAnmmEU36CW6QABelNsFapDkJJULFlGdjej6E278WQr1aK_EU5', 'live' => 'AYWUPDFsda-iKaYG_Yvsski78T6QUXGAnmmEU36CW6QABelNsFapDkJJULFlGdjej6E278WQr1aK_EU5');
    private $secrets = array ('test' => 'EN4OokvUtbGv5BGOU-pRc5_0WOuLra87UwTZY9xf0E4tigA6Qix42jgDctt1MKEK7EzMParxaE9AmZSb', 'live' => 'EN4OokvUtbGv5BGOU-pRc5_0WOuLra87UwTZY9xf0E4tigA6Qix42jgDctt1MKEK7EzMParxaE9AmZSb');
 
    private $live = false;
    private $endpoint;
    private $clientId;
    private $secret;
    private $CI;
    private $apiContext;

    public function __construct() {
        try {
            if ($this->live == false) {
                $this->endpoint = $this->endpoints['test'];
                $this->clientId = $this->clientIds['test'];
                $this->secret = $this->secrets['test'];
            } else {
                $this->endpoint = $this->endpoints['live'];
                $this->clientId = $this->clientIds['live'];
                $this->secret = $this->secrets['live'];
            }
 
            $this->CI = &get_instance();

            $this->apiContext = new ApiContext(new OAuthTokenCredential(
                $this->clientId,
                $this->secret
            ));

            //NO se setean :( , por eso el PP_CONFIG_PATH
            $this->apiContext->setConfig(array(
                'http.ConnectionTimeOut' => 30,
                'http.Retry' => 1,
                'mode' => 'sandbox',
                'log.LogEnabled' => true,
                'log.FileName' => 'logs/PayPal.log',
                'log.LogLevel' => 'INFO'        
            ));
        } catch (Exception $e) {
            throw new Exception("Paypal Rest error in constructor : " . $e->getMessage());
        }
    }
 
    public function getAccessToken() {
        $oauthCredential = new OAuthTokenCredential($this->clientId, $this->secret);
        $accessToken     = $oauthCredential->getAccessToken(array('mode' => 'sandbox'));
 
        return $accessToken;
    }

    /**
     * Save a credit card with paypal
     * 
     * This helps you avoid the hassle of securely storing credit
     * card information on your site. PayPal provides a credit card
     * id that you can use for charging future payments.
     * 
     * @param array $params credit card parameters
     */

    function saveCard($params) {
        
        $card = new CreditCard();
        $card->setType($params['type']);
        $card->setNumber($params['number']);
        $card->setExpireMonth($params['expire_month']);
        $card->setExpireYear($params['expire_year']);
        $card->setCvv2($params['cvv2']);
        $card->create($this->apiContext);
        return $card->getId();
    }

    /**
     * 
     * @param string $cardId credit card id obtained from 
     * a previous create API call.
     */
    function getCreditCard($cardId) {
        return CreditCard::get($cardId, $this->apiContext);
    }
    
    /**
     * Create a payment using a previously obtained
     * credit card id. The corresponding credit
     * card is used as the funding instrument.
     * 
     * @param string $creditCardId credit card id
     * @param string $total Payment amount with 2 decimal points
     * @param string $currency 3 letter ISO code for currency
     * @param string $paymentDesc
     */
    function makePaymentUsingCC($creditCardId, $total, $currency, $paymentDesc,$itemList) {
            
        $ccToken = new CreditCardToken();
        $ccToken->setCreditCardId($creditCardId);   
        
        $fi = new FundingInstrument();
        $fi->setCreditCardToken($ccToken);
        
        $payer = new Payer();
        $payer->setPaymentMethod("credit_card");
        $payer->setFundingInstruments(array($fi));  
        
        // Specify the payment amount.
        $amount = new Amount();
        $amount->setCurrency($currency);
        $amount->setTotal($total);
        // ###Transaction
        // A transaction defines the contract of a
        // payment - what is the payment for and who
        // is fulfilling it. Transaction is created with
        // a `Payee` and `Amount` types
        $transaction = new Transaction();
        $transaction->setAmount($amount);
        $transaction->setDescription($paymentDesc);
        $transaction->setItemList($itemList);
        
        $payment = new Payment();
        $payment->setIntent("sale");
        $payment->setPayer($payer);
        $payment->setTransactions(array($transaction));

        $payment->create($this->apiContext);
        return $payment;
    }

    /**
     * Create a payment using the buyer's paypal
     * account as the funding instrument. Your app
     * will have to redirect the buyer to the paypal 
     * website, obtain their consent to the payment
     * and subsequently execute the payment using
     * the execute API call. 
     * 
     * @param string $total payment amount in DDD.DD format
     * @param string $currency  3 letter ISO currency code such as 'USD'
     * @param string $paymentDesc   A description about the payment
     * @param ItemList $itemList Items of cart
     * @param string $returnUrl The url to which the buyer must be redirected
     *              to on successful completion of payment
     * @param string $cancelUrl The url to which the buyer must be redirected
     *              to if the payment is cancelled
     * @return \PayPal\Api\Payment
     */

    function makePaymentUsingPayPal($total, $currency, $paymentDesc, $itemList, $returnUrl, $cancelUrl) {
        
        $payer = new Payer();
        $payer->setPaymentMethod("paypal");
        
        // Specify the payment amount.
        $amount = new Amount();
        $amount->setCurrency($currency);
        $amount->setTotal($total);
        
        // ###Transaction
        // A transaction defines the contract of a
        // payment - what is the payment for and who
        // is fulfilling it. Transaction is created with
        // a `Payee` and `Amount` types
        $transaction = new Transaction();
        $transaction->setAmount($amount);
        $transaction->setDescription($paymentDesc);
        $transaction->setItemList($itemList);
        
        $redirectUrls = new RedirectUrls();
        $redirectUrls->setReturnUrl($returnUrl);
        $redirectUrls->setCancelUrl($cancelUrl);
        
        $payment = new Payment();
        $payment->setRedirectUrls($redirectUrls);
        $payment->setIntent("sale");
        $payment->setPayer($payer);
        $payment->setExperienceProfileId($this->createOrGetProfileExperienceId());

        $payment->setTransactions(array($transaction));
        
        $payment->create($this->apiContext);
      return $payment;
    }


    /**
     * Completes the payment once buyer approval has been
     * obtained. Used only when the payment method is 'paypal'
     * 
     * @param string $paymentId id of a previously created
     *      payment that has its payment method set to 'paypal'
     *      and has been approved by the buyer.
     * 
     * @param string $payerId PayerId as returned by PayPal post
     *      buyer approval.
     */
    function executePayment($paymentId, $payerId) {
        
        $payment = $this->getPaymentDetails($paymentId);
        $paymentExecution = new PaymentExecution();
        $paymentExecution->setPayerId($payerId);    
        $payment = $payment->execute($paymentExecution, $this->apiContext);   
        
        return $payment;
    }

    /**
     * Retrieves the payment information based on PaymentID from Paypal APIs
     *
     * @param $paymentId
     *
     * @return Payment
     */
    function getPaymentDetails($paymentId) {
        $payment = Payment::get($paymentId, $this->apiContext);
        return $payment;
    }


    /**
     * Utility method that returns the first url of a certain
     * type. Returns empty string if no match is found
     * 
     * @param array $links
     * @param string $type 
     * @return string
     */
    function getLink(array $links, $type) {
        foreach($links as $link) {
            if($link->getRel() == $type) {
                return $link->getHref();
            }
        }
        return "";
    }

    /**
     * Utility function to pretty print API error data
     * @param string $errorJson
     * @return string
     */
    function parseApiError($errorJson) {
        $msg = '';
        
        $data = json_decode($errorJson, true);
        if(isset($data['name']) && isset($data['message'])) {
            $msg .= $data['name'] . " : " .  $data['message'] . "<br/>";
        }
        if(isset($data['details'])) {
            $msg .= "<ul>";
            foreach($data['details'] as $detail) {
                $msg .= "<li>" . $detail['field'] . " : " . $detail['issue'] . "</li>"; 
            }
            $msg .= "</ul>";
        }
        if($msg == '') {
            $msg = $errorJson;
        }   
        return $msg;
    }

    function  createOrGetProfileExperienceId(){
        $webProfile = new WebProfile();

        $profiles = $webProfile->get_list($this->apiContext);

        //Si ya existen perfiles creador previamente, tomo el ID del primero
        if(count($profiles)>0){
            $prof = $profiles[0];
            return $prof->id;
        }
        $presentation = new Presentation();
        $presentation->setLogoImage(site_url('images/home').'/logo.png');
        $presentation->setBrandName(config('company'));
        //valores posibles para Ecuador es_XC,en_US,fr_XC
        //$presentation->setLocaleCode('es_XC');

        $inputFields = new InputFields();
        $inputFields->setAllowNote(true);
        $inputFields->setNoShipping(2);
        $inputFields->setAddressOverride(1);

        $webProfile->setName(config('company'). uniqid());
        $webProfile->setPresentation($presentation);
        $webProfile->setInputFields($inputFields);

        $profile= $webProfile->create($this->apiContext);
        return $profile->id;
    }
    /**
     * Creates a list of items to send them as details of payment
     * @param  array  $items Items cart
     * @return ItemList        Item list
     */
    function createItemsList($items = array()){
        $list = new ItemList();
        if(!is_null($items))
            foreach ($items as $key => $item) {
                $ppItem = new Item();
                $ppItem->setName($item->name);
                $ppItem->setQuantity($item->cantidad);
                $ppItem->setDescription($item->description);
                $ppItem->setPrice($item->unit_price);
                $ppItem->setSku($item->item_id);
                $ppItem->setCurrency("USD");
               // $ppItem->setUrl(site_url('web/market/producto/'.$item->item_id));
                //$ppItem->setWeight();
                $list->addItem($ppItem);
            }
        return $list;
    }
}

