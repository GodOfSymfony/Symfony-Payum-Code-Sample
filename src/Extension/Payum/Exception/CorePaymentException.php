<?php

namespace App\Extension\Payum\Exception;

/**
 * Class CorePaymentException
 *
 * @package App\Extension\Payum\Exception
 */
class CorePaymentException extends \Exception
{
    /**
     * CorePaymentException constructor.
     *
     * @param string $message
     * @param int    $code
     */
    public function __construct($message = '', $code = 500)
    {
        parent::__construct($message, $code);
    }
}
