<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use App\Extension\Payum\Enum\BanquestGatewayEnum;
use Ecommerce121\UtilBundle\Controller\ControllerBase;
use Ecommerce121\UtilBundle\Controller\ControllerUtil;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use App\ValueObject\InvoicePaymentTypes;
use App\Extension\Payum\PaymentExtension;
use App\ValueObject\InvoiceStatuses;
use Symfony\Component\HttpFoundation\Request;
use Payum\Core\Request\GetHumanStatus;
use App\Entity\Invoice;
use Payum\Core\Request\Capture;
use Payum\Core\Gateway;
use Payum\Core\Payum;
use DateTime;

/**
 * Class with payment related actions.
 *
 * @Route("/payment")
 */
class PaymentController extends ControllerBase
{
    const AUTHORIZE_NET = 'authorize_net';

    /**
     * @var Payum
     */
    private $payum;

    /**
     * PaymentController constructor.
     *
     * @param ControllerUtil $controllerUtil
     * @param Payum          $payum
     */
    public function __construct(ControllerUtil $controllerUtil, Payum $payum)
    {
        parent::__construct($controllerUtil);

        $this->payum = $payum;
    }

    /**
     * Pay a payment using check.
     *
     * @Route("/{id}/check", name="app_payment_check", requirements={"id" = "\d+"})
     *
     * @param Request $request HTTP request
     * @param int $id Id of the payment.
     *
     * @return RedirectResponse
     *
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function checkAction(Request $request, $id)
    {
        /** @var Invoice $invoice */
        $invoice = $this->getEntityManager()->getRepository(Invoice::class)->find($id);
        $this->forward404Unless($invoice);

        $invoice->setPaymentDate(new DateTime());
        $invoice->setPaymentType(InvoicePaymentTypes::CHECK);
        $invoice->setStatus(InvoiceStatuses::PAID);

        $this->getEntityManager()->flush();

        if ($request->query->get('back') === 'detail') {
            return $this->redirect($this->generateUrl('app_invoice_detail', [ 'id' => $invoice->getId() ]));
        }

        return $this->redirect($this->generateUrl('app_invoice_list'));
    }

    /**
     * Pay a payment using credit card.
     *
     * @Route("/{id}/creditCard", name="app_payment_credit_card", requirements={"id" = "\d+"})
     *
     * @param int $id
     */
    public function creditCardAction($id)
    {
        /** @var Invoice $invoice */
        $invoice = $this->getEntityManager()->getRepository(Invoice::class)->find($id);
        $this->forward404Unless($invoice);

        $this->forward404Unless($invoice->getInvoiceAmount() > 0);

        $this->processCreditCard([$invoice], $invoice->getInvoiceAmount());
    }

    /**
     * Pay massive a payment using credit card.
     *
     * @Route("/creditCardMassive", name="app_payment_credit_card_massive")
     *
     * @param Request $request
     */
    public function creditCardMassiveAction(Request $request)
    {
        $invoicesIds = $request->get('invoices');
        $amount = 0;
        $invoices = [];
        foreach ($invoicesIds as $invoiceId) {
            /** @var Invoice $invoice */
            $invoice = $this->getEntityManager()->getRepository(Invoice::class)->find($invoiceId);
            $this->forward404Unless($invoice);

            $invoices[] = $invoice;
            $amount += $invoice->getInvoiceAmount();
        }

        $this->forward404Unless($amount > 0);

        $this->processCreditCard($invoices, $amount);
    }

    /**
     *
     * @Route("/done", name="app_payment_done")
     *
     * @param Request $request
     *
     * @return RedirectResponse
     *
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function doneAction(Request $request)
    {
        $token = $this->payum->getHttpRequestVerifier()->verify($request);
        $gateway = $this->payum->getGateway($token->getGatewayName());

        $gateway->execute($status = new GetHumanStatus($token));
        $payment = $status->getFirstModel();

        if ($status->isCaptured()) {
            $invoices = explode(',', $payment->getInvoiceId());

            foreach ($invoices as $invoiceId) {
                /** @var Invoice $invoice */
                $invoice = $this->getEntityManager()->getRepository(Invoice::class)->find($invoiceId);

                $invoice->setPaymentDate(new DateTime());
                $invoice->setPaymentType(InvoicePaymentTypes::CREDIT_CARD);
                $invoice->setStatus(InvoiceStatuses::PAID);

                $this->getEntityManager()->persist($invoice);
                $this->getEntityManager()->flush();
            }

            $msg = 'The Payment is complete!';
        } else {
            $msg = 'The Payment has not been paid! (' . $status->getValue() . ') Tray again Later.';
        }

        /** @var Session $session */
        $session = $request->getSession();
        $session->getFlashBag()->add(
            'message',
            $msg
        );

        $detailUrl = $this->generateUrl('app_invoice_list');

        return $this->redirect($detailUrl);
    }

    /**
     * Process a credit card request.
     *
     * @param array $invoices
     * @param int   $amount
     */
    private function processCreditCard($invoices, $amount)
    {
        $user = $this->getUser();
        $gatewayName = BanquestGatewayEnum::BANQUEST_GATEWAY_PAYMENT;

        /** @var Gateway $gateway */
        $gateway = $this->payum->getGateway($gatewayName);
        $gateway->addExtension(new PaymentExtension($invoices[0]));

        $storage = $this->payum->getStorage('App\Entity\Payment');

        $payment = $storage->create();
        $payment->setNumber(uniqid());
        $payment->setCurrencyCode('USD');
        $payment->setTotalAmount($amount);

        $invoicesId = [];
        foreach ($invoices as $invoice) {
            $invoicesId[] = $invoice->getId();
        }

        if (count($invoices) > 1) {
            $description = 'Invoices paid ' . implode(', ', $invoicesId);
        } else {
            $description = $this->generateUrl('app_invoice_detail', [ 'id' => $invoices[0]->getId() ]);
        }

        $payment->setDescription($description);
        $payment->setClientId($user->getId());
        $payment->setClientEmail($user->getEmail());
        $payment->setInvoiceId(implode(',', $invoicesId));

        $storage->update($payment);

        $captureToken = $this->payum->getTokenFactory()->createCaptureToken(
            $gatewayName,
            $payment,
            'app_payment_done'
        );

        $gateway->execute(new Capture($captureToken));
    }
}
