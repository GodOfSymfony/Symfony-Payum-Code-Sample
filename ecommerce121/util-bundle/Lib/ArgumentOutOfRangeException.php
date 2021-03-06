<?php

namespace Ecommerce121\UtilBundle\Lib;

/**
 * ArgumentOutOfRangeException.
 */
class ArgumentOutOfRangeException extends ArgumentException
{
    /**
     * @param string     $argumentName   Argument name
     * @param string     $message        The error message
     * @param \Exception $innerException An inner exception
     */
    public function __construct($argumentName, $message = '', \Exception $innerException = null)
    {
        if ($message == '') {
            $message = $argumentName.' is out of range';
        }

        parent::__construct($argumentName, $message, $innerException);
    }
}
