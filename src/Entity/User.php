<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use App\ValueObject\UserRoles;
use App\ValueObject\UserTypes;
use Ecommerce121\UtilBundle\Lib\Check;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\Role\Role;
use Symfony\Component\Security\Core\User\EquatableInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 *
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="user")
 * @UniqueEntity(fields="email", message="The email is already in use.")
 * @Gedmo\SoftDeleteable(fieldName="deletedDate", timeAware=false)
 */
class User implements UserInterface, EquatableInterface, \Serializable
{
    use ReviewCurrentTrait;
    use BlameableEntityTrait;
    use SoftDeleteableEntityTrait;
    use TimestampableEntityTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer", nullable=FALSE)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=30, nullable=FALSE)
     */
    private $type;

    /**
     * @ORM\Column(type="boolean", nullable=TRUE)
     */
    private $isAdmin;

    /**
     * @ORM\Column(type="boolean", nullable=TRUE)
     */
    private $isSuperAdmin;

    /**
     * @ORM\Column(type="boolean", nullable=TRUE)
     */
    private $isVerified;

    /**
     * @ORM\Column(type="string", length=100, nullable=FALSE)
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=100, nullable=FALSE)
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=100, nullable=FALSE, unique=TRUE)
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=20, nullable=FALSE)
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=100, nullable=FALSE)
     */
    private $encodedPassword;

    /**
     * @ORM\Column(type="string", length=32, nullable=FALSE)
     */
    private $salt;

    /**
     * @ORM\Column(type="string", length=100, nullable=TRUE)
     */
    private $addressFirst;

    /**
     * @ORM\Column(type="string", length=100, nullable=TRUE)
     */
    private $addressSecond;

    /**
     * @ORM\Column(type="string", length=100, nullable=TRUE)
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=20, nullable=TRUE)
     */
    private $zipCode;

    /**
     * @ORM\OneToMany(targetEntity="Contact", orphanRemoval=true, mappedBy="user", cascade={"persist", "remove"})
     */
    protected $contacts;

    /**
     * @ORM\Column(type="text", nullable=TRUE)
     */
    private $notes;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=150, nullable=TRUE)
     */
    private $forgetPasswordCode;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", nullable=TRUE)
     */
    private $forgetPasswordValidUntil;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime", nullable=TRUE)
     */
    private $lastLoginDate;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=15, nullable=TRUE)
     */
    private $lastLoginIp;

    /**
     * @ORM\Column(type="boolean", nullable=FALSE)
     */
    private $enabled;

    /**
     * @ORM\OneToMany(targetEntity="UserChangeLog", orphanRemoval=true, mappedBy="user", cascade={"persist", "remove"})
     */
    protected $changeLogs;

    /**
     * @ORM\OneToMany(targetEntity="UserNotification", orphanRemoval=true, mappedBy="user", cascade={"persist", "remove"})
     */
    protected $notifications;

    /**
     * @ORM\OneToMany(targetEntity="UserReview", orphanRemoval=true, mappedBy="user", cascade={"persist", "remove"})
     */
    protected $reviews;

    /**
     * User constructor.
     *
     * @param string $type
     * @param string $firstname
     * @param string $lastname
     * @param string $email
     * @param string $phone
     */
    public function __construct(
        $type,
        $firstname,
        $lastname,
        $email,
        $phone
    ) {
        Check::argument('type', $type)->isEnumValue(UserTypes::class);
        Check::argument('firstname', $firstname)->isNotEmpty();
        Check::argument('lastname', $lastname)->isNotEmpty();
        Check::argument('email', $email)->isNotEmpty();
        Check::argument('phone', $phone)->isNotEmpty();

        $this->type = $type;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->email = $email;
        $this->phone = $phone;
        $this->enabled = true;
        $this->isAdmin = false;
        $this->isSuperAdmin = false;
        $this->isVerified = false;
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set if is admin.
     *
     * @param bool $isAdmin
     *
     * @return User
     */
    public function setIsAdmin($isAdmin)
    {
        $this->isAdmin = $isAdmin;

        return $this;
    }

    /**
     * Get type.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Get if is admin.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->isAdmin;
    }

    /**
     * Set if is super admin.
     *
     * @param bool $isSuperAdmin
     *
     * @return User
     */
    public function setIsSuperAdmin($isSuperAdmin)
    {
        $this->isSuperAdmin = $isSuperAdmin;

        return $this;
    }

    /**
     * Get if is super admin.
     *
     * @return bool
     */
    public function isSuperAdmin()
    {
        return $this->isSuperAdmin;
    }

    /**
     * Set if is verified.
     *
     * @param bool $isVerified
     *
     * @return User
     */
    public function setIsVerified($isVerified)
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    /**
     * Get if is verified.
     *
     * @return bool
     */
    public function isVerified()
    {
        return $this->isVerified;
    }

    /**
     * Set firstname.
     *
     * @param string $firstname
     *
     * @return User
     */
    public function setFirstname($firstname)
    {
        Check::argument('firstname', $firstname)->isNotEmpty();
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get firstname.
     *
     * @return string
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set lastname.
     *
     * @param string $lastname
     *
     * @return User
     */
    public function setLastname($lastname)
    {
        Check::argument('lastname', $lastname)->isNotEmpty();
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get lastname.
     *
     * @return string
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * Get fullname.
     *
     * @return string
     */
    public function getFullname()
    {
        return $this->getFirstname().' '.$this->getLastname();
    }

    /**
     * Set email.
     *
     * @param string $email
     *
     * @return User
     */
    public function setEmail($email)
    {
        Check::argument('email', $email)->isNotEmpty();
        $this->email = $email;

        return $this;
    }

    /**
     * Get email.
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set phone.
     *
     * @param string $phone
     *
     * @return User
     */
    public function setPhone($phone)
    {
        Check::argument('phone', $phone)->isNotEmpty();
        $this->phone = $phone;

        return $this;
    }

    /**
     * Get phone.
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set address first.
     *
     * @param string $addressFirst
     *
     * @return User
     */
    public function setAddressFirst($addressFirst)
    {
        Check::argument('address1', $addressFirst)->isNotEmpty();
        $this->addressFirst = $addressFirst;

        return $this;
    }

    /**
     * Get address first.
     *
     * @return string
     */
    public function getAddressFirst()
    {
        return $this->addressFirst;
    }

    /**
     * Set address second.
     *
     * @param string $addressSecond
     *
     * @return User
     */
    public function setAddressSecond($addressSecond)
    {
        $this->addressSecond = $addressSecond;

        return $this;
    }

    /**
     * Get address second.
     *
     * @return string
     */
    public function getAddressSecond()
    {
        return $this->addressSecond;
    }

    /**
     * Set city.
     *
     * @param string $city
     *
     * @return User
     */
    public function setCity($city)
    {
        Check::argument('city', $city)->isNotEmpty();
        $this->city = $city;

        return $this;
    }

    /**
     * Get city.
     *
     * @return string
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Set zip code.
     *
     * @param string $zipCode
     *
     * @return User
     */
    public function setZipCode($zipCode)
    {
        Check::argument('zipCode', $zipCode)->isNotEmpty();
        $this->zipCode = $zipCode;

        return $this;
    }

    /**
     * Get zip code.
     *
     * @return string
     */
    public function getZipCode()
    {
        return $this->zipCode;
    }

    /**
     * Set state name.
     *
     * @param string $stateName
     *
     * @return User
     */
    public function setStateName($stateName)
    {
        $this->stateName = $stateName;

        return $this;
    }

    /**
     * Get state name.
     *
     * @return string
     */
    public function getStateName()
    {
        return $this->stateName;
    }

    /**
     * Set notes.
     *
     * @param string $notes
     *
     * @return User
     */
    public function setNotes($notes)
    {
        $this->notes = $notes;

        return $this;
    }

    /**
     * Get notes.
     *
     * @return string
     */
    public function getNotes()
    {
        return $this->notes;
    }

    /**
     * Change administrator password.
     *
     * @param string $encodedPassword
     *
     * @return User
     */
    public function changePassword($encodedPassword)
    {
        Check::argument('encodedPassword', $encodedPassword)->isNotEmpty();
        $this->encodedPassword = $encodedPassword;

        return $this;
    }

    /**
     * Set forgetPasswordCode.
     *
     * @param string $forgetPasswordCode
     *
     * @return User
     */
    public function setForgetPasswordCode($forgetPasswordCode)
    {
        $this->forgetPasswordCode = $forgetPasswordCode;

        return $this;
    }

    /**
     * Get forgetPasswordCode.
     *
     * @return string
     */
    public function getForgetPasswordCode()
    {
        return $this->forgetPasswordCode;
    }

    /**
     * Set forgetPasswordValidUntil.
     *
     * @param DateTime|null $forgetPasswordValidUntil
     *
     * @return User
     */
    public function setForgetPasswordValidUntil(DateTime $forgetPasswordValidUntil = null)
    {
        $this->forgetPasswordValidUntil = $forgetPasswordValidUntil;

        return $this;
    }

    /**
     * Get forgetPasswordValidUntil.
     *
     * @return DateTime
     */
    public function getForgetPasswordValidUntil()
    {
        return $this->forgetPasswordValidUntil;
    }

    /**
     * Checks if forget password code is valid.
     *
     * @param string $code Code
     *
     * @return bool
     */
    public function isForgetPasswordCodeValid($code)
    {
        $now = new DateTime('now');

        return $this->getForgetPasswordValidUntil() >= $now && $this->getForgetPasswordCode() === $code;
    }

    /**
     * Set lastLoginDate.
     *
     * @param DateTime $lastLoginDate
     *
     * @return User
     */
    public function setLastLoginDate(DateTime $lastLoginDate)
    {
        $this->lastLoginDate = $lastLoginDate;

        return $this;
    }

    /**
     * Get lastLoginDate.
     *
     * @return DateTime
     */
    public function getLastLoginDate()
    {
        return $this->lastLoginDate;
    }

    /**
     * Set lastLoginIp.
     *
     * @param string $lastLoginIp
     *
     * @return User
     */
    public function setLastLoginIp($lastLoginIp)
    {
        $this->lastLoginIp = $lastLoginIp;

        return $this;
    }

    /**
     * Get lastLoginIp.
     *
     * @return string
     */
    public function getLastLoginIp()
    {
        return $this->lastLoginIp;
    }

    /**
     * @return bool
     */
    public function isEnabled()
    {
        return $this->enabled;
    }

    /**
     * @return User
     */
    public function enable()
    {
        $this->enabled = true;

        return $this;
    }

    /**
     * @return User
     */
    public function disable()
    {
        $this->enabled = false;

        return $this;
    }

    /**
     * Get salt.
     *
     * @return string
     */
    public function getSalt()
    {
        return $this->salt;
    }

    /**
     * Get username.
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->email;
    }

    /**
     * (PHP 5 &gt;= 5.1.0)<br/>
     * String representation of object.
     *
     * @link http://php.net/manual/en/serializable.serialize.php
     *
     * @return string the string representation of the object or null
     */
    public function serialize()
    {
        return serialize([$this->id]);
    }

    /**
     * (PHP 5 &gt;= 5.1.0)<br/>
     * Constructs the object.
     *
     * @link http://php.net/manual/en/serializable.unserialize.php
     *
     * @param string $serialized <p>
     *                           The string representation of the object.
     *                           </p>
     */
    public function unserialize($serialized)
    {
        list($this->id) = unserialize($serialized);
    }

    /**
     * Returns the password used to authenticate the user.
     *
     * This should be the encoded password. On authentication, a plain-text
     * password will be salted, encoded, and then compared to this value.
     *
     * @return string The password
     */
    public function getPassword()
    {
        return $this->encodedPassword;
    }

    /**
     * Removes sensitive data from the user.
     *
     * This is important if, at any given point, sensitive information like
     * the plain-text password is stored on this object.
     */
    public function eraseCredentials()
    {
    }

    /**
     * The equality comparison should neither be done by referential equality
     * nor by comparing identities (i.e. getId() === getId()).
     *
     * However, you do not need to compare every attribute, but only those that
     * are relevant for assessing whether re-authentication is required.
     *
     * Also implementation should consider that $user instance may implement
     * the extended user interface `AdvancedUserInterface`.
     *
     * @param UserInterface $user
     *
     * @return bool
     */
    public function isEqualTo(UserInterface $user)
    {
        /** @var User $user */

        return $this->id === $user->getId();
    }

    /**
     * Returns the roles granted to the user.
     *
     * Alternatively, the roles might be stored on a ``roles`` property,
     * and populated in any number of different ways when the user object
     * is created.
     *
     * @return Role[] The user roles
     */
    public function getRoles()
    {
        $roles = [];
        $uType = 'ROLE_'.strtoupper($this->type);

        switch ($uType) {
            case UserRoles::ROLE_MUNICIPAL:
                if ($this->isAdmin) {
                    $roles[] = UserRoles::ROLE_ADMIN_MUNICIPAL;
                } else {
                    $roles[] = UserRoles::ROLE_MUNICIPAL;
                }

                break;
            case UserRoles::ROLE_REGISTER:
                if ($this->isAdmin) {
                    $roles[] = UserRoles::ROLE_ADMIN_REGISTER;
                } else {
                    $roles[] = UserRoles::ROLE_REGISTER;
                }

                break;
            case UserRoles::ROLE_MUNIREG:
                if ($this->isSuperAdmin) {
                    $roles[] = UserRoles::ROLE_SUPER_ADMIN;
                } elseif ($this->isAdmin) {
                    $roles[] = UserRoles::ROLE_ADMIN_MUNIREG;
                } else {
                    $roles[] = UserRoles::ROLE_MUNIREG;
                }

                break;
        }

        return $roles;
    }

    public function getChangeLogs()
    {
        return $this->changeLogs;
    }

    public function getNotifications()
    {
        return $this->notifications;
    }

    public function getReviews()
    {
        return $this->reviews;
    }
}
