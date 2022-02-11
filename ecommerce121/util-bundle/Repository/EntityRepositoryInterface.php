<?php

namespace Ecommerce121\UtilBundle\Repository;

use Doctrine\Common\Collections\Selectable;
use Doctrine\Persistence\ObjectRepository;

/**
 * Interface for domain entities repositories.
 *
 * Provides the interface for domain entities repositories
 */
interface EntityRepositoryInterface extends Selectable, ObjectRepository
{
    /**
     * Clears the repository, causing all managed entities to become detached.
     */
    public function clear();
}
