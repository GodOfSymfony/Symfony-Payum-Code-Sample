<?php

namespace App\Extension\Payum\Exception;

/**
 * Class UndefinedFieldNameException
 *
 * @package App\Extension\Payum\Exception
 */
class UndefinedFieldNameException extends CorePaymentException
{
    /**
     * UndefinedFieldNameException constructor.
     *
     * @param string $message
     * @param int    $code
     */
    public function __construct($message = 'Undefined field name.', $code = 500)
    {
        parent::__construct($message, $code);
    }
}
