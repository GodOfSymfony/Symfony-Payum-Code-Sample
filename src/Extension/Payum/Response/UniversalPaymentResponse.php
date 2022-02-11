<?php

namespace App\Extension\Payum\Response;

use App\Extension\Payum\Request\UniversalPaymentRequestInterface;

/**
 * Class UniversalPaymentResponse
 *
 * @package App\Extension\Payum\Response
 */
class UniversalPaymentResponse
{
    /**
     * @var UniversalPaymentRequestInterface
     */
    protected $response;

    /**
     * UniversalPaymentResponse constructor.
     *
     * @param $response
     */
    public function __construct($response)
    {
        $this->response = $response;
    }

    /**
     * @return mixed
     */
    public function getResponse()
    {
        return $this->response;
    }
}
