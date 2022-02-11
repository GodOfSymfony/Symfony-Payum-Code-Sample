<?php

namespace App\Extension\Payum\Request;

use App\Extension\Payum\Enum\RequestPathEnum;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Class ChargeRequest
 *
 * @package App\Extension\Payum\Request
 */
class ChargeRequest extends UniversalPaymentRequest
{
    /**
     * @inheritDoc
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver
            ->setRequired(['amount', 'card', 'expiry_month', 'expiry_year', 'name', 'cvv2'])
        ;
    }

    /**
     * @inheritDoc
     */
    public function getRequestPath(): string
    {
        return RequestPathEnum::CHARGE_PATH;
    }

    /**
     * @inheritDoc
     */
    public function getMethod(): string
    {
        return 'POST';
    }
}
