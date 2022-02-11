<?php

namespace Ecommerce121\UtilBundle\Lib;

use ReflectionClass;

/**
 * Class ReflectionUtil.
 */
final class ReflectionUtil
{
    private function __construct()
    {
    }

    /**
     * @param mixed  $object
     * @param string $property
     * @param mixed  $value
     */
    public static function setInaccesibleProperty($object, $property, $value)
    {
        $reflectionClass = new ReflectionClass(get_class($object));
        $property = $reflectionClass->getProperty($property);
        $property->setAccessible(true);
        $property->setValue($object, $value);
        $property->setAccessible(false);
    }
}
