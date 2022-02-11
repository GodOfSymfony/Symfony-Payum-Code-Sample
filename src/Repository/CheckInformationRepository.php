<?php

namespace App\Repository;

use App\Entity\CheckInformation;
use App\ValueObject\SearchCriteria\InvoiceSearchCriteria;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use Ecommerce121\UtilBundle\Repository\OrderDirections;
use Ecommerce121\UtilBundle\Repository\QueryOptions;

/**
 * Class CheckInformationRepository
 *
 * @package App\Repository
 */
class CheckInformationRepository extends \Ecommerce121\UtilBundle\Repository\EntityRepository
{
    /**
     * CheckInformationRepository constructor.
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct($em, $em->getClassMetadata(CheckInformation::class));
    }

    /**
     * {@inheritdoc}
     */
    public function countByCriteria(InvoiceSearchCriteria $criteria = null)
    {
        return $this->countQuery($criteria);
    }

    /**
     * {@inheritdoc}
     */
    public function search(InvoiceSearchCriteria $criteria = null, QueryOptions $options = null)
    {
        $options = QueryOptions::from($options)
            ->defaultOrder('createdDate', OrderDirections::ASCENDING);

        return $this->searchQuery($criteria, $options);
    }

    protected function configureAliases()
    {
        $this->aliases = [
            '' => 'i',
            'organization' => 'o',
            'form' => 'f'
        ];
    }

    /**
     * {@inheritdoc}
     */
    protected function defaultJoinedRelations()
    {
        return ['organization', 'form'];
    }
}
