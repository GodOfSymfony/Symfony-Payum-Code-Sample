<?php

namespace App\Extension\Payum\Exception;

/**
 * Class EmptyEncoderException
 *
 * @package App\Extension\Payum\Exception
 */
class EmptyEncoderException extends \Exception
{
    /**
     * EmptyEncoderException constructor.
     *
     * @param string $message
     * @param int    $code
     */
    public function __construct($message = 'Empty Encoder provided.', $code = 500)
    {
        parent::__construct($message, $code);
    }
}
