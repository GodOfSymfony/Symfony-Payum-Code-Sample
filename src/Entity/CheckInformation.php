<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Ecommerce121\UtilBundle\Lib\Check;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * CheckInformation
 *
 * @ORM\Table(name="check_information")
 * @ORM\Entity(repositoryClass="App\Repository\CheckInformationRepository")
 * @Gedmo\SoftDeleteable(fieldName="deletedDate", timeAware=false)
 */
class CheckInformation
{
    use SoftDeleteableEntityTrait;
    use TimestampableEntityTrait;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="number", type="string", length=255)
     */
    private $number;

    /**
     * @var float
     *
     * @ORM\Column(name="amount", type="float")
     */
    private $amount;

    /**
     * @var string
     *
     * @ORM\Column(name="notes", type="text")
     */
    private $notes;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="payer_id", referencedColumnName="id", nullable=FALSE)
     */
    private $user;

    /**
     * CheckInformation constructor.
     *
     * @param $number
     * @param $amount
     * @param $notes
     */
    public function __construct($number, $amount, $notes)
    {
        Check::argument('number', $number)->isNotNull();
        Check::argument('amount', $amount)->isNotNull();
        Check::argument('notes', $notes)->isNotNull();

        $this->number = $number;
        $this->amount = $amount;
        $this->notes  = $notes;
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set number
     *
     * @param string $number
     *
     * @return CheckInformation
     */
    public function setNumber($number)
    {
        $this->number = $number;

        return $this;
    }

    /**
     * Get number
     *
     * @return string
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * Set amount
     *
     * @param float $amount
     *
     * @return CheckInformation
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * Get amount
     *
     * @return float
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * Set notes
     *
     * @param string $notes
     *
     * @return CheckInformation
     */
    public function setNotes($notes)
    {
        $this->notes = $notes;

        return $this;
    }

    /**
     * Get notes
     *
     * @return string
     */
    public function getNotes()
    {
        return $this->notes;
    }

    /**
     * Set createdDate
     *
     * @param \DateTime $createdDate
     *
     * @return CheckInformation
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;

        return $this;
    }

    /**
     * Set updatedDate
     *
     * @param \DateTime $updatedDate
     *
     * @return CheckInformation
     */
    public function setUpdatedDate($updatedDate)
    {
        $this->updatedDate = $updatedDate;

        return $this;
    }

    /**
     * Set user
     *
     * @param \App\Entity\User $user
     *
     * @return CheckInformation
     */
    public function setUser(\App\Entity\User $user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \App\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
}
