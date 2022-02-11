<?php

namespace App\Extension\Payum\Auth\Decoder;

/**
 * Class AuthBanquestEncoder
 *
 * @package App\Extension\Payum\Auth\Decoder
 */
class AuthBanquestEncoder implements AuthEncoderInterface
{
    /**
     * @param string $sourceKey
     * @param null $sourcePin
     *
     * @return string
     */
    public function decode(string $sourceKey, $sourcePin = null): string
    {
        $pin = '';

        if (null !== $sourcePin) {
            $pin = $sourcePin;
        }

        return base64_encode($sourceKey . ':' . $pin);
    }
}
