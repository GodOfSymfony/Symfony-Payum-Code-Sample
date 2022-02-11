<?php

namespace App\Controller\CreditCard;

use Payum\Core\Request\Capture;
use Symfony\Component\HttpFoundation\Request;
use Payum\Bundle\PayumBundle\Controller\CaptureController as BaseController;

/**
 * Class CaptureController
 */
class CaptureController extends BaseController
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     * @throws \Exception
     */
    public function doAction(Request $request)
    {
        $cc = $request->get('credit_card');
        $number = preg_replace('/\s+/', '', $cc['number']);
        $cc['number'] = $number;
        $request->request->set('credit_card', $cc);

        $token = $this->getPayum()->getHttpRequestVerifier()->verify($request);

        $gateway = $this->getPayum()->getGateway($token->getGatewayName());
        $gateway->execute(new Capture($token));

        $this->getPayum()->getHttpRequestVerifier()->invalidate($token);

        return $this->redirect($token->getAfterUrl());
    }
}
