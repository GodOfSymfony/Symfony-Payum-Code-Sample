<?php

namespace App\ValueObject\SearchCriteria;

use DateTime;

/**
 * Class InvoiceSearchCriteria
 */
final class InvoiceSearchCriteria
{
    /**
     * @var int
     */
    public $id;
    /**
     * @var array
     */
    public $attachments;
    public $type;
    public $inDispute;
    public $dueNotified;
    public $vprNumber;
    public $internalReferenceNumber;
    public $propertyNumber;
    /**
     * @var DateTime
     */
    public $invoiceDateFrom;
    /**
     * @var DateTime
     */
    public $invoiceDateTo;
    /**
     * @var DateTime
     */
    public $dueDateFrom;
    /**
     * @var DateTime
     */
    public $dueDateTo;
    public $paymentType;
    /**
     * @var DateTime
     */
    public $paymentDateFrom;
    /**
     * @var DateTime
     */
    public $paymentDateTo;
    public $invoiceAmount;
    /**
     * @var DateTime
     */
    public $municipalityPaidDateFrom;
    /**
     * @var DateTime
     */
    public $municipalityPaidDateTo;
    public $description;
    public $notes;
    public $status;

    /**
     * @var array
     */
    public $inInvoices;
    public $quickSearch;
    public $isPastDue;
}
