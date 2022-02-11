<?php

namespace App\Extension\Payum\Action;

use App\Extension\Payum\Enum\BanquestStatusCodeEnum;
use Payum\Core\Exception\RequestNotSupportedException;
use Payum\Core\Request\GetStatusInterface;
use Payum\Core\Action\ActionInterface;
use Payum\Core\Bridge\Spl\ArrayObject;

/**
 * Class StatusAction
 *
 * @package App\Extension\Payum\Action
 */
class StatusAction implements ActionInterface
{
    /**
     * {@inheritDoc}
     *
     * @param GetStatusInterface $request
     */
    public function execute($request)
    {
        RequestNotSupportedException::assertSupports($this, $request);

        $model = ArrayObject::ensureArrayObject($request->getModel());

        if (null === $model['status_code']) {
            $request->markNew();

            return;
        }

        if (BanquestStatusCodeEnum::APPROVED === $model['status_code']) {
            $request->markCaptured();

            return;
        }

        if (BanquestStatusCodeEnum::PARTIALLY_APPROVED === $model['status_code']) {
            $request->markPending();

            return;
        }

        if (BanquestStatusCodeEnum::DECLINED === $model['status_code']) {
            $request->markCanceled();

            return;
        }

        if (BanquestStatusCodeEnum::ERROR === $model['status_code']) {
            $request->markFailed();

            return;
        }

        $request->markUnknown();
    }

    /**
     * {@inheritDoc}
     */
    public function supports($request)
    {
        return
            $request instanceof GetStatusInterface &&
            $request->getModel() instanceof \ArrayAccess
        ;
    }
}
