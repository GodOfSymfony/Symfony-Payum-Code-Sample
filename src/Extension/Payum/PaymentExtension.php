<?php

namespace App\Extension\Payum;

use Payum\Core\Extension\ExtensionInterface;
use Payum\Core\Extension\Context;
use Payum\Core\Request\RenderTemplate;
use App\Entity\Invoice;

/**
 * Class PaymentExtension
 */
class PaymentExtension implements ExtensionInterface
{
    /**
     * @var Invoice
     */
    protected $invoice;

    /**
     * PaymentExtension constructor.
     *
     * @param Invoice $invoice
     */
    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    /**
     * @param Context $context
     */
    public function onPreExecute(Context $context)
    {
        $request = $context->getRequest();
        if ($request instanceof RenderTemplate) {
            $request->addParameter('invoice', $this->invoice);
        }
    }

    /**
     * @param Context $context
     */
    public function onExecute(Context $context)
    {
        // TODO: Implement onExecute() method.
    }

    /**
     * @param Context $context
     */
    public function onPostExecute(Context $context)
    {
        // TODO: Implement onPostExecute() method.
    }
}
