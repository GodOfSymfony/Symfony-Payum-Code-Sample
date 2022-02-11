<?php

namespace App\Extension\Payum\Action;

use Payum\Core\Exception\RequestNotSupportedException;
use Payum\Core\Action\ActionInterface;
use Payum\Core\Bridge\Spl\ArrayObject;
use Payum\Core\Model\PaymentInterface;
use Payum\Core\GatewayAwareInterface;
use Payum\Core\Request\GetCurrency;
use Payum\Core\GatewayAwareTrait;
use Payum\Core\Request\Convert;

/**
 * Class ConvertPaymentAction
 *
 * @package App\Extension\Payum\Action
 */
class ConvertPaymentAction implements ActionInterface, GatewayAwareInterface
{
    use GatewayAwareTrait;

    /**
     * {@inheritDoc}
     *
     * @param Convert $request
     */
    public function execute($request)
    {
        RequestNotSupportedException::assertSupports($this, $request);

        /** @var PaymentInterface $payment */
        $payment = $request->getSource();

        $this->gateway->execute($currency = new GetCurrency($payment->getCurrencyCode()));

        $details = ArrayObject::ensureArrayObject($payment->getDetails());
        $details['amount'] = $payment->getTotalAmount();
        $details['invoice_num'] = $payment->getNumber();
        $details['description'] = $payment->getDescription();
        $details['email'] = $payment->getClientEmail();
        $details['cust_id'] = $payment->getClientId();

        $request->setResult((array)$details);
    }

    /**
     * {@inheritDoc}
     */
    public function supports($request)
    {
        return
            $request instanceof Convert &&
            $request->getSource() instanceof PaymentInterface &&
            $request->getTo() == 'array';
    }
}
