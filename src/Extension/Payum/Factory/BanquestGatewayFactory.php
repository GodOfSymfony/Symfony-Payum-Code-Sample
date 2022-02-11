<?php

namespace App\Extension\Payum\Factory;

use App\Extension\Payum\Auth\Decoder\AuthBanquestEncoder;
use App\Extension\Payum\Action\ConvertPaymentAction;
use App\Extension\Payum\Enum\BanquestGatewayEnum;
use App\Extension\Payum\Action\CaptureAction;
use App\Extension\Payum\Core\BanquestGateway;
use App\Extension\Payum\Action\StatusAction;
use Payum\Core\Bridge\Spl\ArrayObject;
use Payum\Core\GatewayFactory;

/**
 * Class BanquestGatewayFactory
 *
 * @package App\Extension\Payum\Factory
 */
class BanquestGatewayFactory extends GatewayFactory
{
    /**
     * {@inheritDoc}
     */
    protected function populateConfig(ArrayObject $config)
    {
        $config->defaults(array(
            'payum.factory_name' => BanquestGatewayEnum::BANQUEST_GATEWAY_PAYMENT,
            'payum.factory_title' => 'Banquest Gateway',
            'payum.action.capture' => new CaptureAction(),
            'payum.action.status' => new StatusAction(),
            'payum.action.convert_payment' => new ConvertPaymentAction()
        ));

        if (false == $config['payum.api']) {
            $config['payum.default_options'] = [
                'source_key' => '',
                'source_pin' => '',
                'sandbox' => true
            ];

            $config->defaults($config['payum.default_options']);

            $config['payum.required_options'] = ['source_key'];
            $config['payum.api'] = function (ArrayObject $config) {
                $config->validateNotEmpty($config['payum.required_options']);

                $arrayConfig = $config->toUnsafeArray();

                return (new BanquestGateway([
                    'source_key' => $arrayConfig['source_key'],
                    'source_pin' => $arrayConfig['source_pin'],
                    'sandbox' => $arrayConfig['sandbox']
                ]))
                    ->setDecoder(new AuthBanquestEncoder());
            };
        }
    }
}
