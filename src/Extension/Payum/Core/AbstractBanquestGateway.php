<?php

namespace App\Extension\Payum\Core;

use App\Extension\Payum\Request\UniversalPaymentRequestInterface;
use App\Extension\Payum\Auth\Decoder\AuthEncoderInterface;
use App\Extension\Payum\Exception\EmptyEncoderException;
use App\Extension\Payum\Exception\EmptyRequestException;
use App\Extension\Payum\Exception\CorePaymentException;
use App\Extension\Payum\Enum\BanquestGatewayBaseEnum;
use Symfony\Component\OptionsResolver\OptionsResolver;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;

/**
 * Class AbstractBanquestGateway
 *
 * @package App\Extension\Payum\Core
 */
abstract class AbstractBanquestGateway
{
    /**
     * @var OptionsResolver
     */
    private $options;

    /**
     * @var AuthEncoderInterface|null
     */
    private $encoder = null;

    /**
     * @var UniversalPaymentRequestInterface|null
     */
    private $request = null;

    /**
     * AbstractBanquestGateway constructor.
     *
     * @param array $options
     */
    public function __construct(array $options)
    {
        $resolver = new OptionsResolver();
        $this->configureOptions($resolver);
        $this->options = $resolver->resolve($options);
    }

    /**
     * @param AuthEncoderInterface $authDecoder
     *
     * @return self
     */
    public function setDecoder(AuthEncoderInterface $authDecoder): self
    {
        $this->encoder = $authDecoder;

        return $this;
    }

    /**
     * @param UniversalPaymentRequestInterface $request
     *
     * @return self
     */
    public function setRequest(UniversalPaymentRequestInterface $request): self
    {
        $this->request = $request;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSandBox(): bool
    {
        return $this->options['sandbox'];
    }

    /**
     * @return mixed
     *
     * @throws CorePaymentException
     * @throws EmptyEncoderException
     * @throws EmptyRequestException
     */
    public function capture()
    {
        if (null === $this->request) {
            throw new EmptyRequestException();
        }

        if (null === $this->encoder) {
            throw new EmptyEncoderException();
        }

        $this->request->resolve();

        $client = new Client();

        try {
            $result = $client->request(
                $this->request->getMethod(),
                $this->getBaseUri() . $this->request->getRequestPath(),
                [
                    'json' => $this->request->getFields(),
                    'headers' => [
                        'Authorization' => 'Basic ' . $this->encoder->decode(
                                $this->options['source_key'], $this->options['source_pin']
                            )
                    ]
                ]
            );
        } catch (GuzzleException $e) {
            throw new CorePaymentException($e->getMessage());
        }

        return $this->handleResponse($result->getBody()->getContents());
    }

    /**
     * @return string
     */
    private function getBaseUri(): string
    {
        if ($this->isSandBox()) {
            return BanquestGatewayBaseEnum::API_URL_SANDBOX;
        }

        return BanquestGatewayBaseEnum::API_URL;
    }

    /**
     * @param OptionsResolver $optionsResolver
     *
     * @return void
     */
    abstract protected function configureOptions(OptionsResolver $optionsResolver);


    /**
     * Handle The response
     *
     * @param $string
     *
     * @return mixed
     */
    abstract protected function handleResponse($string);
}
