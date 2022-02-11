<?php

namespace App\Extension\Payum\Request;

use App\Extension\Payum\Exception\UndefinedFieldNameException;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Class UniversalPaymentRequest
 *
 * @package App\Extension\Payum\Request
 */
abstract class UniversalPaymentRequest implements UniversalPaymentRequestInterface
{
    /**
     * @var array
     */
    private $fields = [];

    /**
     * @var OptionsResolver
     */
    private $resolver;

    /**
     * UniversalPaymentRequest constructor.
     */
    final public function __construct()
    {
        $this->resolver = new OptionsResolver();
        $this->configureOptions($this->resolver);
    }

    /**
     * @param $name
     *
     * @param $value
     */
    public function __set($name, $value)
    {
        $this->fields[$name] = $value;
    }

    /**
     * @param $name
     *
     * @return mixed
     *
     * @throws UndefinedFieldNameException
     */
    public function __get($name)
    {
        if(!empty($this->fields[$name])) {
            return $this->fields[$name];
        } else {
            throw new UndefinedFieldNameException('Undefined filed '. $name. ' referenced.');
        }
    }

    /**
     * @inheritDoc
     */
    public function getFields(): array
    {
        return $this->fields;
    }

    /**
     * @inheritDoc
     */
    public function resolve(): UniversalPaymentRequestInterface
    {
        $this->resolver->resolve($this->fields);

        return $this;
    }
}
