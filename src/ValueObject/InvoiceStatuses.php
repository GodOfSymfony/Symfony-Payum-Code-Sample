<?php

namespace App\ValueObject;

use Ecommerce121\UtilBundle\Lib\Enum;

/**
 * Class InvoiceStatuses
 */
final class InvoiceStatuses extends Enum
{
    const UNPAID = 'unpaid';
    const PAID = 'paid';
}
