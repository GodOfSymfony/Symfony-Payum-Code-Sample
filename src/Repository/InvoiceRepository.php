<?php

namespace App\Repository;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use App\Repository\RepositoryInterface\InvoiceRepositoryInterface;
use App\ValueObject\InvoiceStatuses;
use App\ValueObject\SearchCriteria\InvoiceSearchCriteria;
use Ecommerce121\UtilBundle\Repository\EntityRepository;
use Ecommerce121\UtilBundle\Repository\OrderDirections;
use Ecommerce121\UtilBundle\Repository\QueryOptions;

/**
 * Class InvoiceRepository
 */
class InvoiceRepository extends EntityRepository implements InvoiceRepositoryInterface
{
    /**
     * InvoiceRepository constructor.
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct($em, $em->getClassMetadata(Invoice::class));
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

    /**
     * {@inheritdoc}
     */
    public function getFilterResults($invoicesId)
    {
        $dql = '
                SELECT
                    COUNT(i) AS invoicesTotal,
                    SUM(i.invoiceAmount) AS invoicesTotalAmount 
                FROM
                    Invoice i
                WHERE
                    i.id IN (:invoicesId)
        ';

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameters([':invoicesId' => $invoicesId]);

        return $query->getOneOrNullResult();
    }

    /**
     * {@inheritdoc}
     */
    public function getFilterResultsPaid($invoicesId)
    {
        $dql = '
                SELECT
                    COUNT(i) AS invoicesPaid 
                FROM
                    Invoice i
                WHERE
                    i.id IN (:invoicesId) AND i.status = \'paid\'
                ';

        $query = $this->getEntityManager()->createQuery($dql);
        $query->setParameters([':invoicesId' => $invoicesId]);

        return $query->getOneOrNullResult();
    }


    /**
     * Get require form.
     *
     * @param string $type
     * @param int    $id
     *
     * @return array
     */
    public function getRequirePayment($type, $id = null)
    {
        $em = $this->getEntityManager();

        $rawQuery = 'SELECT p.id as property_id ';
        $rawQuery .= 'FROM invoice i ';
        $rawQuery .= 'INNER JOIN form f ON i.form_id = f.id ';
        $rawQuery .= 'INNER JOIN property p ON f.property_id = p.id ';
        $rawQuery .= 'WHERE status = \'unpaid\' AND type = \''.$type.'\' ';
        if ($id) {
            $rawQuery .= 'AND i.organization_id = '.$id.' ';
        }
        $rawQuery .= 'GROUP BY property_id';

        $statement = $em->getConnection()->prepare($rawQuery);

        return $statement->executeQuery()->fetchAllAssociative();
    }

    /**
     * Get last months info.
     *
     * @param int $months
     *
     * @return array
     */
    public function getLastMonthsInfo($months)
    {
        $em = $this->getEntityManager();

        $rawQuery = 'SELECT SUM(invoice_amount) as info_total, Year(payment_date) as info_year, Month(payment_date) as info_month 
                 FROM invoice
                 WHERE payment_date >= date_sub(now(), interval '.$months.' month)
                 GROUP BY info_year, info_month 
                 ORDER BY info_year DESC, info_month DESC;';

        $statement = $em->getConnection()->prepare($rawQuery);
        return $statement->executeQuery()->fetchAllAssociative();
    }

    /**
     * @param int    $orgId
     * @param string $status
     *
     * @return array
     */
    public function getAmountValue($orgId, $status)
    {
        $em = $this->getEntityManager();

        $rawQuery = 'SELECT SUM(invoice_amount) as total ';
        $rawQuery .= 'FROM invoice ';
        $rawQuery .= 'WHERE organization_id = '.$orgId;
        $rawQuery .= ' AND status = \''.$status.'\';';

        $statement = $em->getConnection()->prepare($rawQuery);

        return $statement->executeQuery()->fetchAllAssociative();
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

    /**
     * {@inheritdoc}
     */
    protected function applySearchCriteriaToQueryBuilder(QueryBuilder $qb, $criteria)
    {
        /** @var $criteria InvoiceSearchCriteria */
        if (!empty($criteria->id)) {
            $qb->andWhere($this->rootAlias().'.id = :id');
            $qb->setParameter(':id', $criteria->id);
        }

        if ($criteria->form) {
            $qb->andWhere($this->rootAlias().'.form = :form');
            $qb->setParameter(':form', $criteria->form);
        }

        if ($criteria->organization) {
            $qb->andWhere($this->rootAlias().'.organization = :organization');
            $qb->setParameter(':organization', $criteria->organization);
        }

        if (!empty($criteria->type)) {
            $qb->andWhere($this->rootAlias().'.type = :type');
            $qb->setParameter(':type', $criteria->type);
        }

        if (!empty($criteria->vprNumber)) {
            $qb->andWhere($this->rootAlias().'.vprNumber = :vprNumber');
            $qb->setParameter(':vprNumber', $criteria->vprNumber);
        }

        if (!empty($criteria->inDispute)) {
            $qb->andWhere($this->rootAlias().'.inDispute = :inDispute');
            $qb->setParameter(':inDispute', $criteria->inDispute);
        }

        if (null !== $criteria->invoiceDateFrom) {
            $qb->andWhere($this->rootAlias().'.invoiceDate <= :invoiceDateFrom');
            $qb->setParameter(':invoiceDateFrom', $criteria->invoiceDateFrom);
        }

        if (null !== $criteria->invoiceDateTo) {
            $qb->andWhere($this->rootAlias().'.invoiceDate >= :invoiceDateTo');
            $qb->setParameter(':invoiceDateTo', $criteria->invoiceDateTo);
        }

        if (null !== $criteria->dueDateFrom) {
            $qb->andWhere($this->rootAlias().'.dueDate >= :dueDateFrom');
            $qb->setParameter(':dueDateFrom', $criteria->dueDateFrom);
        }

        if (null !== $criteria->dueDateTo) {
            $qb->andWhere($this->rootAlias().'.dueDate <= :dueDateTo');
            $qb->setParameter(':dueDateTo', $criteria->dueDateTo);
        }

        if (!empty($criteria->paymentType)) {
            $qb->andWhere($this->rootAlias().'.paymentType = :paymentType');
            $qb->setParameter(':paymentType', $criteria->paymentType);
        }

        if (null !== $criteria->paymentDateFrom) {
            $qb->andWhere($this->rootAlias().'.paymentDate <= :paymentDateFrom');
            $qb->setParameter(':paymentDateFrom', $criteria->paymentDateFrom);
        }

        if (null !== $criteria->paymentDateTo) {
            $qb->andWhere($this->rootAlias().'.paymentDate >= :paymentDateTo');
            $qb->setParameter(':paymentDateTo', $criteria->paymentDateTo);
        }

        if (!empty($criteria->invoiceAmount)) {
            $qb->andWhere($this->rootAlias().'.invoiceAmount = :invoiceAmount');
            $qb->setParameter(':invoiceAmount', $criteria->invoiceAmount);
        }

        if (null !== $criteria->municipalityPaidDateFrom) {
            $qb->andWhere($this->rootAlias().'.municipalityPaidDate <= :municipalityPaidDateFrom');
            $qb->setParameter(':municipalityPaidDateFrom', $criteria->municipalityPaidDateFrom);
        }

        if (null !== $criteria->municipalityPaidDateTo) {
            $qb->andWhere($this->rootAlias().'.municipalityPaidDate >= :municipalityPaidDateTo');
            $qb->setParameter(':municipalityPaidDateTo', $criteria->municipalityPaidDateTo);
        }

        if (!empty($criteria->description)) {
            $qb->andWhere($this->rootAlias().'.description LIKE :description');
            $qb->setParameter(':description', $criteria->description);
        }

        if (!empty($criteria->notes)) {
            $qb->andWhere($this->rootAlias().'.notes LIKE :notes');
            $qb->setParameter(':notes', $criteria->notes);
        }

        if (!empty($criteria->status)) {
            $qb->andWhere($this->rootAlias().'.status LIKE :status');
            $qb->setParameter(':status', $criteria->status);
        }

        if (null !== $criteria->createdDateFrom) {
            $qb->andWhere($this->rootAlias().'.createdDate >= :createdDateFrom');
            $qb->setParameter(':createdDateFrom', $criteria->createdDateFrom);
        }

        if (null !== $criteria->createdDateTo) {
            $qb->andWhere($this->rootAlias().'.createdDate <= :createdDateTo');
            $qb->setParameter(':createdDateTo', $criteria->createdDateTo);
        }

        if (!empty($criteria->inInvoices)) {
            $qb->andWhere($this->rootAlias().'.id IN (:inInvoices)');
            $qb->setParameter(':inInvoices', $criteria->inInvoices);
        }

        if (!empty($criteria->isPastDue) && $criteria->isPastDue) {
            $qb->andWhere($this->rootAlias().'.status LIKE :status');
            $qb->setParameter(':status', InvoiceStatuses::UNPAID);
            $qb->andWhere($this->rootAlias().'.dueDate <= :dueDateTo');
            $qb->setParameter(':dueDateTo', new \DateTime());
        }

        if (!empty($criteria->dueNotified)) {
            $qb->andWhere($this->rootAlias().'.dueNotified = :dueNotified');
            $qb->setParameter(':dueNotified', $criteria->dueNotified);
        }

        if ($criteria->propertyNumber) {
            $qb->andWhere($this->getAliasFor('form').'.property = :propertyNumber');
            $qb->setParameter(':propertyNumber', $criteria->propertyNumber);
        }

        if ($criteria->internalReferenceNumber) {
            $qb->andWhere($this->getAliasFor('form').'.internalReferenceNumber = :internalReferenceNumber');
            $qb->setParameter(':internalReferenceNumber', $criteria->internalReferenceNumber);
        }

        if (!empty($criteria->quickSearch)) {

            $qsFilter = [
                $this->getAliasFor('form').'.internalReferenceNumber LIKE :searchValue',
                $this->getAliasFor('form').'.property = :propNumber',
                $this->rootAlias().'.id = :id'
            ];

            $qb->andWhere('('.implode(' OR ', $qsFilter).')');
            $qb->setParameter(':searchValue', '%'.$criteria->quickSearch.'%');
            $qb->setParameter(':propNumber', $criteria->quickSearch);
            $qb->setParameter(':id', $criteria->quickSearch);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function deleteInIds($ids)
    {
        $connection = $this->getEntityManager()->getConnection();

        $rawQuery = 'SELECT i.id ';
        $rawQuery .= 'FROM invoice i ';
        $rawQuery .= 'WHERE i.form_id IN ('.implode(',', $ids).')';

        $statement = $connection->prepare($rawQuery);
        $statement->execute();

        $invoiceIds = $statement->fetchAll(\PDO::FETCH_COLUMN);

        $date = new \DateTime();
        $qry = $connection->prepare("UPDATE invoice SET deleted_date = ? WHERE form_id  IN (".implode(',', $ids).")");
        $qry->bindValue(1, $date, "datetime");

        if ($qry->execute()) {
            return $invoiceIds;
        }

        return [];
    }
}
