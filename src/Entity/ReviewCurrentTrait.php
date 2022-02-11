<?php

namespace App\Entity;

/**
 * Class ReviewCurrentTrait
 */
trait ReviewCurrentTrait
{
    /**
     * Allows to get the field by key
     *
     * @param string $prop
     *
     * @return mixed
     */
    public function getCurrent($prop)
    {
        if (property_exists($this, $prop)) {
            return $this->$prop;
        }

        return false;
    }
}
