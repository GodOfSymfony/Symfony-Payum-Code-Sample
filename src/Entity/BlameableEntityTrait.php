<?php

namespace App\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait BlameableEntityTrait.
 */
trait BlameableEntityTrait
{
    /**
     * @Gedmo\Blameable(on="create")
     * @ORM\Column(type="string", length=50, nullable=TRUE)
     */
    private $createdBy;

    /**
     * @Gedmo\Blameable(on="update")
     * @ORM\Column(type="string", length=50, nullable=TRUE)
     */
    private $updatedBy;

    /**
     * Get created by.
     *
     * @return string
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Get updated by.
     *
     * @return string
     */
    public function getUpdatedBy()
    {
        return $this->updatedBy;
    }
}
