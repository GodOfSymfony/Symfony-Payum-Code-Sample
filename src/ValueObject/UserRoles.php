<?php

namespace App\ValueObject;

use Ecommerce121\UtilBundle\Lib\Enum;

/**
 * Class UserRoles
 */
final class UserRoles extends Enum
{
    const ROLE_MUNIREG = 'ROLE_MUNIREG';
    const ROLE_MUNICIPAL = 'ROLE_MUNICIPALITY';
    const ROLE_REGISTER = 'ROLE_REGISTER_PARTY';
    const ROLE_ADMIN_MUNIREG = 'ROLE_ADMIN_MUNIREG';
    const ROLE_ADMIN_MUNICIPAL = 'ROLE_ADMIN_MUNICIPAL';
    const ROLE_ADMIN_REGISTER = 'ROLE_ADMIN_REGISTER_PARTY';
    const ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN';
}
