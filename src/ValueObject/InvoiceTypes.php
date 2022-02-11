<?php

namespace App\ValueObject;

use Ecommerce121\UtilBundle\Lib\Enum;

/**
 * Class InvoiceTypes
 */
final class InvoiceTypes extends Enum
{
    const VPR_REGISTRATION = 'vpr_registration';
    const VPR_RENEWAL = 'vpr_renewal';
    const VPR_UPDATE = 'vpr_update';
    const VPR_FINE_PENALTY = 'vpr_fine_penalty';
    const OTHER = 'other';
}
