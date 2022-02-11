<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\QueryBuilder;
use App\Repository\RepositoryInterface\UserRepositoryInterface;
use App\ValueObject\SearchCriteria\UserSearchCriteria;
use Ecommerce121\UtilBundle\Repository\EntityRepository;
use Ecommerce121\UtilBundle\Repository\OrderDirections;
use Ecommerce121\UtilBundle\Repository\QueryOptions;

/**
 * Class UserRepository
 */
class UserRepository extends EntityRepository implements UserRepositoryInterface
{
    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct($em, $em->getClassMetadata(User::class));
    }

    /**
     * {@inheritdoc}
     */
    public function countByCriteria(UserSearchCriteria $criteria = null)
    {
        return $this->countQuery($criteria);
    }

    /**
     * {@inheritdoc}
     */
    public function search(UserSearchCriteria $criteria = null, QueryOptions $options = null)
    {
        $options = QueryOptions::from($options)
            ->defaultOrder('createdDate', OrderDirections::ASCENDING);

        return $this->searchQuery($criteria, $options);
    }

    protected function configureAliases()
    {
        $this->aliases = [
            '' => 'u',
            'country' => 'c',
            'organization' => 'o',
            'municipality' => 'm'
        ];
    }

    /**
     * {@inheritdoc}
     */
    protected function defaultJoinedRelations()
    {
        return ['country', 'municipality', 'organization'];
    }

    /**
     * {@inheritdoc}
     */
    protected function applySearchCriteriaToQueryBuilder(QueryBuilder $qb, $criteria)
    {
        /** @var $criteria UserSearchCriteria */
        if (null !== $criteria->type) {
            $qb->andWhere($this->rootAlias().'.type = :type');
            $qb->setParameter(':type', $criteria->type);
        }

        if (null !== $criteria->inTypes) {
            $qb->andWhere($this->rootAlias().'.type IN (:types)');
            $qb->setParameter(':types', $criteria->inTypes);
        }

        if (null !== $criteria->isAdmin) {
            $qb->andWhere($this->rootAlias().'.isAdmin = :isAdmin');
            $qb->setParameter(':isAdmin', $criteria->isAdmin);
        }

        if (!empty($criteria->fullname)) {
            $orWhere[] = $this->rootAlias().'.firstname LIKE :firstname';
            $orWhere[] = $this->rootAlias().'.lastname LIKE :lastname';
            $qb->andWhere('('.join(' OR ', $orWhere).')');
            $nameList = preg_split('/ +/', $criteria->fullname);
            if (count($nameList) == 1) {
                $qb->setParameter(':firstname', '%'.$criteria->fullname.'%');
                $qb->setParameter(':lastname', '%'.$criteria->fullname.'%');
            } else {
                $firstName = array_shift($nameList);
                $lastName = join(' ', $nameList);
                $qb->setParameter(':firstname', '%'.$firstName.'%');
                $qb->setParameter(':lastname', '%'.$lastName.'%');
            }
        }

        if (!empty($criteria->firstname)) {
            $qb->andWhere($this->rootAlias().'.firstname LIKE :firstname');
            $qb->setParameter(':firstname', '%'.$criteria->firstname.'%');
        }

        if (!empty($criteria->lastname)) {
            $qb->andWhere($this->rootAlias().'.lastname LIKE :lastname');
            $qb->setParameter(':lastname', '%'.$criteria->lastname.'%');
        }

        if (!empty($criteria->email)) {
            $qb->andWhere($this->rootAlias().'.email LIKE :email');
            $qb->setParameter(':email', '%'.$criteria->email.'%');
        }

        if (!empty($criteria->phone)) {
            $qb->andWhere($this->rootAlias().'.phone LIKE :phone');
            $qb->setParameter(':phone', '%'.$criteria->phone.'%');
        }

        if (null !== $criteria->organization) {
            $qb->andWhere($this->rootAlias().'.organization = :organization');
            $qb->setParameter(':organization', $criteria->organization);
        }

        if (null !== $criteria->municipality) {
            $qb->andWhere($this->rootAlias().'.municipality = :municipality');
            $qb->setParameter(':municipality', $criteria->municipality);
        }

        if (!empty($criteria->jobTitle)) {
            $qb->andWhere($this->rootAlias().'.jobTitle = :jobTitle');
            $qb->setParameter(':jobTitle', $criteria->jobTitle);
        }

        if (!empty($criteria->department)) {
            $qb->andWhere($this->rootAlias().'.department LIKE :department');
            $qb->setParameter(':department', '%'.$criteria->department.'%');
        }

        if (null !== $criteria->isDepartment) {
            $qb->andWhere($this->rootAlias().'.isDepartment = :isDepartment');
            $qb->setParameter(':isDepartment', $criteria->isDepartment);
        }

        if (null !== $criteria->registerAsIndividual) {
            $qb->andWhere($this->rootAlias().'.registerAsIndividual = :registerAsIndividual');
            $qb->setParameter(':registerAsIndividual', $criteria->registerAsIndividual);
        }

        if (!empty($criteria->addressFirst)) {
            $qb->andWhere($this->rootAlias().'.addressFirst LIKE :addressFirst');
            $qb->setParameter(':addressFirst', '%'.$criteria->addressFirst.'%');
        }

        if (!empty($criteria->addressSecond)) {
            $qb->andWhere($this->rootAlias().'.addressSecond LIKE :addressSecond');
            $qb->setParameter(':addressSecond', '%'.$criteria->addressSecond.'%');
        }

        if (!empty($criteria->city)) {
            $qb->andWhere($this->rootAlias().'.city LIKE :city');
            $qb->setParameter(':city', '%'.$criteria->city.'%');
        }

        if (null !== $criteria->state) {
            $qb->andWhere($this->rootAlias().'.state = :state');
            $qb->setParameter(':state', $criteria->state);
        }

        if (!empty($criteria->stateName)) {
            $qb->andWhere($this->rootAlias().'.stateName LIKE :stateName');
            $qb->setParameter(':stateName', '%'.$criteria->stateName.'%');
        }

        if (null !== $criteria->country) {
            $qb->andWhere($this->rootAlias().'.country = :country');
            $qb->setParameter(':country', $criteria->country);
        }

        if (!empty($criteria->notes)) {
            $qb->andWhere($this->rootAlias().'.notes LIKE :notes');
            $qb->setParameter(':notes', '%'.$criteria->notes.'%');
        }

        if (null !== $criteria->enabled) {
            $qb->andWhere($this->rootAlias().'.enabled = :enabled');
            $qb->setParameter(':enabled', $criteria->enabled);
        }

        if (!empty($criteria->forgetPasswordCode)) {
            $qb->andWhere($this->rootAlias().'.forgetPasswordCode = :forgetPasswordCode');
            $qb->setParameter(':forgetPasswordCode', $criteria->forgetPasswordCode);
        }

        if (null !== $criteria->forgetPasswordValidUntilFrom) {
            $qb->andWhere($this->rootAlias().'.forgetPasswordValidUntil <= :forgetPasswordValidUntilFrom');
            $qb->setParameter(':forgetPasswordValidUntilFrom', $criteria->forgetPasswordValidUntilFrom);
        }

        if (null !== $criteria->forgetPasswordValidUntilTo) {
            $qb->andWhere($this->rootAlias().'.forgetPasswordValidUntil >= :forgetPasswordValidUntilTo');
            $qb->setParameter(':forgetPasswordValidUntilTo', $criteria->forgetPasswordValidUntilTo);
        }

        if (!empty($criteria->quickSearch)) {
            $qsFilter = [
                $this->rootAlias().'.firstname LIKE :searchValue',
                $this->rootAlias().'.lastname LIKE :searchValue',
                $this->rootAlias().'.addressFirst LIKE :searchValue',
                $this->rootAlias().'.addressSecond LIKE :searchValue',
            ];

            $qb->andWhere('('.implode(' OR ', $qsFilter).')');
            $qb->setParameter(':searchValue', '%'.$criteria->quickSearch.'%');
        }
    }
}
