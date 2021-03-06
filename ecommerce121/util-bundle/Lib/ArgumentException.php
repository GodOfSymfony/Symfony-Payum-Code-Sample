<?php

namespace Ecommerce121\UtilBundle\Lib;

/**
 * ArgumentException.
 */
class ArgumentException extends \LogicException
{
    private $argumentName;

    /**
     * Constructor.
     *
     * @param string     $argumentName   Argument name
     * @param string     $message        The error message
     * @param \Exception $innerException An inner exception
     */
    public function __construct($argumentName, $message = '', \Exception $innerException = null)
    {
        $this->argumentName = $argumentName;

        parent::__construct($message, 0, $innerException);
    }

    /**
     * Gets argument name.
     *
     * @return string
     */
    public function getArgumentName()
    {
        return $this->argumentName;
    }
}
