<?php

namespace App\ValueObject;

use Ecommerce121\UtilBundle\Lib\Enum;

/**
 * Class UserTypes
 */
final class UserTypes extends Enum
{
    const MUNIREG = 'munireg';
    const MUNICIPALITY = 'municipality';
    const REGISTER_PARTY = 'register_party';
}
