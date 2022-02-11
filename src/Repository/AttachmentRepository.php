<?php

namespace App\Repository;

use App\Entity\Attachment;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use App\Repository\RepositoryInterface\AttachmentRepositoryInterface;
use App\ValueObject\SearchCriteria\AttachmentSearchCriteria;
use Ecommerce121\UtilBundle\Repository\EntityRepository;
use Ecommerce121\UtilBundle\Repository\OrderDirections;
use Ecommerce121\UtilBundle\Repository\QueryOptions;

/**
 * Class AttachmentRepository
 */
class AttachmentRepository extends EntityRepository implements AttachmentRepositoryInterface
{
    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct($em, $em->getClassMetadata(Attachment::class));
    }

    /**
     * {@inheritdoc}
     */
    public function countByCriteria(AttachmentSearchCriteria $criteria = null)
    {
        return $this->countQuery($criteria);
    }

    /**
     * {@inheritdoc}
     */
    public function searchByCriteria(AttachmentSearchCriteria $criteria = null, QueryOptions $options = null)
    {
        $options = QueryOptions::from($options)
            ->defaultOrder('path', OrderDirections::ASCENDING);

        return $this->searchQuery($criteria, $options);
    }

    protected function configureAliases()
    {
        $this->aliases = [
            '' => 'a',
        ];
    }

    /**
     * {@inheritdoc}
     */
    protected function defaultJoinedRelations()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    protected function applySearchCriteriaToQueryBuilder(QueryBuilder $qb, $criteria)
    {
        /** @var $criteria AttachmentSearchCriteria */
        if (!empty($criteria->path)) {
            $qb->andWhere($this->rootAlias().'.path LIKE :path');
            $qb->setParameter(':path', '%'.$criteria->path.'%');
        }
    }
}
