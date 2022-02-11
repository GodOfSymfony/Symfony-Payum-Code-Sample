<?php

namespace App\Extension\Payum\Request;

use Symfony\Component\OptionsResolver\OptionsResolver;

interface UniversalPaymentRequestInterface
{
    /**
     * @return array
     */
    public function getFields(): array;

    /**
     * @param OptionsResolver $resolver
     *
     * @return void
     */
    public function configureOptions(OptionsResolver $resolver);

    /**
     * @return UniversalPaymentRequestInterface
     */
    public function resolve(): UniversalPaymentRequestInterface;

    /**
     * @return string
     */
    public function getRequestPath(): string;

    /**
     * @return string
     */
    public function getMethod(): string;
}
