<?php

namespace App\ValueObject\SearchCriteria;

use DateTime;

/**
 * Class UserSearchCriteria
 */
final class UserSearchCriteria
{
    public $type;
    public $inTypes;
    public $isAdmin;
    public $firstname;
    public $lastname;
    public $fullname;
    public $email;
    public $phone;
    public $title;
    public $quickSearch;
    public $jobTitle;
    public $department;
    public $isDepartment;
    public $registerAsIndividual;
    public $addressFirst;
    public $addressSecond;
    public $city;
    public $zipCode;
    public $stateName;
    public $notes;
    public $forgetPasswordCode;
    /**
     * @var DateTime
     */
    public $forgetPasswordValidUntilFrom;
    /**
     * @var DateTime
     */
    public $forgetPasswordValidUntilTo;
    public $enabled;
}
