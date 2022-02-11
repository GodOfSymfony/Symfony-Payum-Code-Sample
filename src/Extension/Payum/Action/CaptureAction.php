<?php

namespace App\Extension\Payum\Action;

use App\Extension\Payum\Enum\BanquestStatusCodeEnum;
use Payum\Core\Exception\RequestNotSupportedException;
use App\Extension\Payum\Core\BanquestGateway;
use App\Extension\Payum\Request\ChargeRequest;
use Payum\Core\Request\ObtainCreditCard;
use Payum\Core\Exception\LogicException;
use Payum\Core\Security\SensitiveValue;
use Payum\Core\Action\ActionInterface;
use Payum\Core\Bridge\Spl\ArrayObject;
use Payum\Core\GatewayAwareInterface;
use Payum\Core\ApiAwareInterface;
use Payum\Core\GatewayAwareTrait;
use App\Entity\Payment;
use Payum\Core\Request\Capture;
use Payum\Core\ApiAwareTrait;

/**
 * Class CaptureAction
 *
 * @package App\Extension\Payum\Action
 */
class CaptureAction implements ActionInterface, GatewayAwareInterface, ApiAwareInterface
{
    use ApiAwareTrait;
    use GatewayAwareTrait;

    /**
     * CaptureAction constructor.
     */
    public function __construct()
    {
        $this->apiClass = BanquestGateway::class;
    }

    /**
     * @param mixed $request
     *
     * @return mixed
     */
    public function execute($request)
    {
        RequestNotSupportedException::assertSupports($this, $request);

        $model = ArrayObject::ensureArrayObject($request->getModel());

        if (false == $model->validateNotEmpty(array('card_num', 'exp_date'), false)) {
            try {
                /** @var Payment $payment */
                $payment = $request->getFirstModel();

                $obtainCreditCard = new ObtainCreditCard($request->getToken());
                $obtainCreditCard->setModel($request->getFirstModel());
                $obtainCreditCard->setModel($request->getModel());

                $this->gateway->execute($obtainCreditCard);

                $card = $obtainCreditCard->obtain();

                $model['exp_date'] = SensitiveValue::ensureSensitive($card->getExpireAt()->format('m/y'));
                $model['card_num'] = SensitiveValue::ensureSensitive($card->getNumber());
                $model['card_code'] = SensitiveValue::ensureSensitive($card->getSecurityCode());
            } catch (RequestNotSupportedException $e) {
                throw new LogicException('Credit card details has to be set explicitly or there has to be an action that supports ObtainCreditCard request.');
            }
        }

        /**
         * @var $api BanquestGateway
         */
        $api = clone $this->api;

        /** @var ChargeRequest $chargeRequest */
        $chargeRequest = new ChargeRequest();
        $chargeRequest->amount = $payment->getTotalAmount();
        $chargeRequest->card = $card->getNumber();
        $chargeRequest->expiry_month = (int)$card->getExpireAt()->format('m');
        $chargeRequest->expiry_year = (int)$card->getExpireAt()->format('Y');
        $chargeRequest->name = $card->getHolder();
        $chargeRequest->cvv2 = $card->getSecurityCode();

        try {
            $response = $api
                ->setRequest($chargeRequest)
                ->capture();

            $model->replace(json_decode($response->getResponse(), true));

            return $response;
        } catch (\Exception $e) {
            $model->replace(['status_code' => BanquestStatusCodeEnum::ERROR]);
        }
    }

    /**
     * @param mixed $request
     *
     * @return bool
     */
    public function supports($request)
    {
        return
            $request instanceof Capture &&
            $request->getModel() instanceof \ArrayAccess;
    }
}
