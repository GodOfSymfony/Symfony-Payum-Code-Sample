<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trait SoftDeleteableEntityTrait
 */
trait SoftDeleteableEntityTrait
{
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $deletedDate;

    /**
     * Set deleted date.
     *
     * @param DateTime $deletedDate
     *
     * @return $this
     */
    public function setDeletedDate(DateTime $deletedDate)
    {
        $this->deletedDate = $deletedDate;

        return $this;
    }

    /**
     * Get deleted date.
     *
     * @return DateTime
     */
    public function getDeletedDate()
    {
        return $this->deletedDate;
    }
}
