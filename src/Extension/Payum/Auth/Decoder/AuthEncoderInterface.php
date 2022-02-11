<?php

namespace App\Extension\Payum\Auth\Decoder;

/**
 * Interface AuthEncoderInterface
 *
 * @package App\Extension\Payum\Auth\Decoder
 */
interface AuthEncoderInterface
{
    /**
     * @param string $sourceKey
     * @param null   $sourcePin
     *
     * @return string
     */
    public function decode(string $sourceKey, $sourcePin = null): string;
}
