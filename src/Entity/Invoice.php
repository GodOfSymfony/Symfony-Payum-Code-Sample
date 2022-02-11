<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\CheckInformation as CheckInformationAlias;
use App\ValueObject\InvoiceStatuses;
use App\ValueObject\InvoiceTypes;
use Ecommerce121\UtilBundle\Lib\Check;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ORM\Table(name="invoice")
 * @Gedmo\SoftDeleteable(fieldName="deletedDate", timeAware=false)
 **/
class Invoice
{
    use ReviewCurrentTrait;
    use BlameableEntityTrait;
    use SoftDeleteableEntityTrait;
    use TimestampableEntityTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer", nullable=FALSE)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var ArrayCollection
     *
     * @ORM\ManyToMany(targetEntity="Attachment", inversedBy="invoices", cascade={"persist"})
     * @ORM\OrderBy({"path" = "ASC"})
     * @ORM\JoinTable(
     *    name="invoice_attachment",
     *    joinColumns={@ORM\JoinColumn(name="invoice_id", referencedColumnName="id", onDelete="CASCADE")},
     *    inverseJoinColumns={@ORM\JoinColumn(name="attachment_id", referencedColumnName="id", onDelete="CASCADE")}
     * )
     */
    private $attachments;

    /**
     * @ORM\Column(type="boolean", nullable=FALSE)
     */
    private $inDispute;

    /**
     * @ORM\Column(type="boolean", nullable=FALSE)
     */
    private $dueNotified;

    /**
     * @ORM\Column(type="datetime", nullable=FALSE)
     */
    private $invoiceDate;

    /**
     * @ORM\Column(type="datetime", nullable=FALSE)
     */
    private $dueDate;

    /**
     * @ORM\Column(type="string", length=30, nullable=TRUE)
     */
    private $paymentType;

    /**
     * @ORM\Column(type="datetime", nullable=TRUE)
     */
    private $paymentDate;

    /**
     * @ORM\Column(type="float", nullable=FALSE)
     */
    private $invoiceAmount;

    /**
     * @ORM\Column(type="datetime", nullable=TRUE)
     */
    private $municipalityPaidDate;

    /**
     * @ORM\Column(type="text", nullable=TRUE)
     */
    private $description;

    /**
     * @ORM\Column(type="text", nullable=TRUE)
     */
    private $notes;

    /**
     * @ORM\Column(type="string", length=30, nullable=FALSE)
     */
    private $status;

    /**
     * @ORM\OneToMany(targetEntity="InvoiceReview", orphanRemoval=true, mappedBy="invoice", cascade={"persist", "remove"})
     */
    protected $invoiceReviews;

    /**
     * @ORM\OneToMany(targetEntity="InvoiceSupportTicket", orphanRemoval=true, mappedBy="invoice", cascade={"persist", "remove"})
     */
    protected $invoiceSupportTickets;

    /**
     * @var CheckInformation
     *
     * @ORM\OneToOne(targetEntity="CheckInformation", orphanRemoval=true, cascade={"all"}, fetch="EAGER")
     * @ORM\JoinColumn(name="check_information_id", referencedColumnName="id", nullable=TRUE, onDelete="CASCADE")
     */
    private $checkInformation;

    /**
     * Invoice constructor.
     *
     * @param string       $type
     * @param DateTime     $invoiceDate
     * @param DateTime     $dueDate
     * @param float        $invoiceAmount
     */
    public function __construct(
        $type,
        DateTime $invoiceDate,
        DateTime $dueDate,
        $invoiceAmount
    ) {
        Check::argument('type', $type)->isEnumValue(InvoiceTypes::class);
        Check::argument('invoiceDate', $invoiceDate)->isNotNull();
        Check::argument('dueDate', $dueDate)->isNotNull();
        Check::argument('invoiceAmount', $invoiceAmount)->isNumeric();

        $this->type = $type;
        $this->invoiceDate = $invoiceDate;
        $this->dueDate = $dueDate;
        $this->invoiceAmount = $invoiceAmount;
        $this->inDispute = false;
        $this->dueNotified = false;

        $this->attachments = new ArrayCollection();
        $this->status = InvoiceStatuses::UNPAID;
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Add attachment.
     *
     * @param Attachment $attachment
     *
     * @return Invoice
     */
    public function addAttachment(Attachment $attachment)
    {
        $this->attachments[] = $attachment;

        return $this;
    }

    /**
     * Remove attachment.
     *
     * @param Attachment $attachment
     */
    public function removeAttachment(Attachment $attachment)
    {
        $this->attachments->removeElement($attachment);
    }

    /**
     * Indicates whether the invoice is associated to the specified attachment
     *
     * @param Attachment $attachment
     *
     * @return bool
     */
    public function hasAttachment(Attachment $attachment)
    {
        return $this->attachments->contains($attachment);
    }

    /**
     * Get attachments.
     *
     * @return Collection
     */
    public function getAttachments()
    {
        return $this->attachments;
    }

    /**
     * Get type.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param string $type
     *
     * @return Invoice
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get is in dispute.
     *
     * @return bool
     */
    public function isInDispute()
    {
        return $this->inDispute;
    }

    /**
     * Set the invoice is in dispute.
     *
     * @return Invoice
     */
    public function inDispute()
    {
        $this->inDispute = true;

        return $this;
    }

    /**
     * Set the invoice is not in dispute.
     *
     * @return Invoice
     */
    public function notInDispute()
    {
        $this->inDispute = false;

        return $this;
    }

    /**
     * Get invoice date.
     *
     * @return DateTime
     */
    public function getInvoiceDate()
    {
        return $this->invoiceDate;
    }

    /**
     * @param DateTime $date
     *
     * @return Invoice
     */
    public function setInvoiceDate($date)
    {
        $this->invoiceDate = $date;

        return $this;
    }

    /**
     * Get due date.
     *
     * @return DateTime
     */
    public function getDueDate()
    {
        return $this->dueDate;
    }

    /**
     * @param DateTime $date
     *
     * @return Invoice
     */
    public function setDueDate($date)
    {
        $this->dueDate = $date;

        return $this;
    }

    /**
     * Set payment type.
     *
     * @param string $paymentType
     *
     * @return Invoice
     */
    public function setPaymentType($paymentType)
    {
        $this->paymentType = $paymentType;

        return $this;
    }

    /**
     * Get payment type.
     *
     * @return string
     */
    public function getPaymentType()
    {
        return $this->paymentType;
    }

    /**
     * Set payment date.
     *
     * @param DateTime|null $paymentDate
     *
     * @return Invoice
     */
    public function setPaymentDate(DateTime $paymentDate = null)
    {
        $this->paymentDate = $paymentDate;

        return $this;
    }

    /**
     * Get payment date.
     *
     * @return DateTime
     */
    public function getPaymentDate()
    {
        return $this->paymentDate;
    }

    /**
     * Get invoice amount.
     *
     * @return float
     */
    public function getInvoiceAmount()
    {
        return $this->invoiceAmount;
    }

    /**
     * Get amount.
     *
     * @param float $amount
     *
     * @return Invoice
     */
    public function setInvoiceAmount($amount)
    {
        $this->invoiceAmount = $amount;

        return $this;
    }

    /**
     * Set municipality paid date.
     *
     * @param DateTime|null $municipalityPaidDate
     *
     * @return Invoice
     */
    public function setMunicipalityPaidDate(DateTime $municipalityPaidDate = null)
    {
        $this->municipalityPaidDate = $municipalityPaidDate;

        return $this;
    }

    /**
     * Get municipality paid date.
     *
     * @return DateTime
     */
    public function getMunicipalityPaidDate()
    {
        return $this->municipalityPaidDate;
    }

    /**
     * Set description.
     *
     * @param string $description
     *
     * @return Invoice
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description.
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set notes.
     *
     * @param string $notes
     *
     * @return Invoice
     */
    public function setNotes($notes)
    {
        $this->notes = $notes;

        return $this;
    }

    /**
     * Get notes.
     *
     * @return string
     */
    public function getNotes()
    {
        return $this->notes;
    }

    /**
     * Set status.
     *
     * @param string $status
     *
     * @return Invoice
     */
    public function setStatus($status)
    {
        Check::argument('status', $status)->isEnumValue(InvoiceStatuses::class);

        $this->status = $status;

        return $this;
    }

    /**
     * Get is due notified.
     *
     * @return bool
     */
    public function isDueNotified()
    {
        return $this->dueNotified;
    }

    /**
     * Set the invoice as due notified.
     *
     * @return Invoice
     */
    public function setDueNotified()
    {
        $this->dueNotified = true;

        return $this;
    }

    /**
     * Get status.
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    public function getInvoiceReviews()
    {
        return $this->invoiceReviews;
    }

    public function getInvoiceSupportTickets()
    {
        return $this->invoiceSupportTickets;
    }

    /**
     * Set checkInformation
     *
     * @param CheckInformationAlias $checkInformation
     *
     * @return Invoice
     */
    public function setCheckInformation(CheckInformationAlias $checkInformation = null): Invoice
    {
        $this->checkInformation = $checkInformation;

        return $this;
    }

    /**
     * Get checkInformation
     *
     * @return CheckInformation|null
     */
    public function getCheckInformation()
    {
        return $this->checkInformation;
    }
}
