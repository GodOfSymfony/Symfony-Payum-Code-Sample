<?php

namespace App\Repository\RepositoryInterface;

use App\ValueObject\SearchCriteria\InvoiceSearchCriteria;
use Ecommerce121\UtilBundle\Repository\EntityRepositoryInterface;
use Ecommerce121\UtilBundle\Repository\QueryOptions;

/**
 * Interface InvoiceRepositoryInterface.
 */
interface InvoiceRepositoryInterface extends EntityRepositoryInterface
{
    /**
     * @param InvoiceSearchCriteria|null $criteria
     *
     * @return int
     */
    public function countByCriteria(InvoiceSearchCriteria $criteria = null);

    /**
     * @param InvoiceSearchCriteria|null $criteria
     * @param QueryOptions|null          $options
     *
     * @return mixed
     */
    public function search(InvoiceSearchCriteria $criteria = null, QueryOptions $options = null);

    /**
     * Gets filter result of invoices.
     *
     * @param array $invoicesId
     *
     * @return array
     */
    public function getFilterResults($invoicesId);

    /**
     * Gets filter result paid of invoices.
     *
     * @param array $invoicesId
     *
     * @return array
     */
    public function getFilterResultsPaid($invoicesId);

    /**
     * @param array $ids forms ids
     *
     * @return array
     */
    public function deleteInIds($ids);
}
