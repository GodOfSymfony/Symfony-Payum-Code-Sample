<?php

namespace App\Extension\Payum\Exception;

/**
 * Class EmptyRequestException
 *
 * @package App\Extension\Payum\Exception
 */
class EmptyRequestException extends \Exception
{
    /**
     * EmptyRequestException constructor.
     *
     * @param string $message
     * @param int    $code
     */
    public function __construct($message = 'Empty Request provided.', $code = 500)
    {
        parent::__construct($message, $code);
    }
}
