<?php

namespace App\ValueObject\SearchCriteria;

use App\Entity\User;

/**
 * Class UserChangeLogSearchCriteria
 */
final class UserChangeLogSearchCriteria
{
    /**
     * @var User
     */
    public $user;
    public $action;
    /**
     * @var User
     */
    public $userChanged;
}
