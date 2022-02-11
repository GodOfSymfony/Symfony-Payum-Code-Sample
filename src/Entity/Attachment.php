<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Ecommerce121\UtilBundle\Lib\Check;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AttachmentRepository")
 * @ORM\Table(name="attachment")
 * @Gedmo\SoftDeleteable(fieldName="deletedDate", timeAware=false)
 **/
class Attachment
{
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
     * @ORM\Column(type="string", length=255, nullable=FALSE)
     */
    private $path;

    /**
     * @ORM\ManyToMany(targetEntity="InspectionFormReview", mappedBy="attachments")
     */
    protected $inspectionFormReviews;

    /**
     * @ORM\ManyToMany(targetEntity="InspectionForm", mappedBy="attachments")
     */
    protected $inspectionForms;

    /**
     * @ORM\ManyToMany(targetEntity="Invoice", mappedBy="attachments")
     */
    protected $invoices;

    /**
     * @ORM\ManyToMany(targetEntity="PropertyFiling", mappedBy="attachments")
     */
    protected $propertyFilings;

    /**
     * Attachment constructor.
     *
     * @param string $path
     */
    public function __construct($path)
    {
        Check::argument('path', $path)->isNotEmpty();

        $this->path = $path;
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
     * Get path.
     *
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    public function getInspectionFormReviews()
    {
        return $this->inspectionFormReviews;
    }

    public function getInspectionForms()
    {
        return $this->inspectionForms;
    }

    public function getInvoices()
    {
        return $this->invoices;
    }

    public function getPropertyFilings()
    {
        return $this->propertyFilings;
    }
}
