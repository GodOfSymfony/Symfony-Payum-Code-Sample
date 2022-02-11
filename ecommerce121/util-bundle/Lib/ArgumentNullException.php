<?php

namespace Ecommerce121\UtilBundle\Lib;

/**
 * ArgumentNullException.
 */
class ArgumentNullException extends ArgumentException
{
    /**
     * Constructor.
     *
     * @param string     $argumentName   Argument name
     * @param string     $message        The error message
     * @param \Exception $innerException An inner exception
     */
    public function __construct($argumentName, $message = '', \Exception $innerException = null)
    {
        if ($message == '') {
            $message = $argumentName.' cannot be null';
        }

        parent::__construct($argumentName, $message, $innerException);
    }
}
