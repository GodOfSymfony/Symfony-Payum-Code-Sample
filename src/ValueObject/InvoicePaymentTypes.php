<?php

namespace App\ValueObject;

use Ecommerce121\UtilBundle\Lib\Enum;

/**
 * Class InvoicePaymentTypes
 */
final class InvoicePaymentTypes extends Enum
{
    const CHECK = 'check';
    const CREDIT_CARD = 'credit_card';
}
