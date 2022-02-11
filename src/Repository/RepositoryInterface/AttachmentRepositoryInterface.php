<?php

namespace App\Repository\RepositoryInterface;

use App\ValueObject\SearchCriteria\AttachmentSearchCriteria;
use Ecommerce121\UtilBundle\Repository\EntityRepositoryInterface;
use Ecommerce121\UtilBundle\Repository\QueryOptions;

/**
 * Interface AttachmentRepositoryInterface.
 */
interface AttachmentRepositoryInterface extends EntityRepositoryInterface
{
    /**
     * @param AttachmentSearchCriteria|null $criteria
     *
     * @return int
     */
    public function countByCriteria(AttachmentSearchCriteria $criteria = null);

    /**
     * @param AttachmentSearchCriteria|null $criteria
     * @param QueryOptions|null             $options
     *
     * @return mixed
     */
    public function searchByCriteria(AttachmentSearchCriteria $criteria = null, QueryOptions $options = null);
}
