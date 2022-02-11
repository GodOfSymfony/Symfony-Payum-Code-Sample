<?php

namespace App\Repository\RepositoryInterface;

use App\ValueObject\SearchCriteria\UserSearchCriteria;
use Ecommerce121\UtilBundle\Repository\EntityRepositoryInterface;
use Ecommerce121\UtilBundle\Repository\QueryOptions;

/**
 * Interface UserRepositoryInterface.
 */
interface UserRepositoryInterface extends EntityRepositoryInterface
{
    /**
     * @param UserSearchCriteria|null $criteria
     *
     * @return int
     */
    public function countByCriteria(UserSearchCriteria $criteria = null);

    /**
     * @param UserSearchCriteria|null $criteria
     * @param QueryOptions|null       $options
     *
     * @return mixed
     */
    public function search(UserSearchCriteria $criteria = null, QueryOptions $options = null);
}
