<?php

namespace App\Extension\Payum\Core;

use App\Extension\Payum\Response\UniversalPaymentResponse;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Class BanquestGateway
 *
 * @package App\Extension\Payum\Core
 */
class BanquestGateway extends AbstractBanquestGateway
{
    /**
     * BanquestGateway constructor.
     *
     * @param array $options
     */
    public function __construct(array $options)
    {
        parent::__construct($options);
    }

    /**
     * @inheritDoc
     */
    protected function configureOptions(OptionsResolver $optionsResolver)
    {
        $optionsResolver
            ->setDefaults([
                'source_key' => '',
                'source_pin' => null,
                'sandbox' => false
            ])
            ->setRequired(['source_key'])
            ->setAllowedTypes('source_key', 'string')
            ->setAllowedTypes('source_pin', ['null', 'int'])
            ->setAllowedTypes('sandbox', 'bool');
    }

    /**
     * @inheritDoc
     */
    protected function handleResponse($string)
    {
        return new UniversalPaymentResponse($string);
    }
}
