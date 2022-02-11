<?php

namespace Tests\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Client;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

/**
 * Class ControllerBaseTest
 */
abstract class ControllerBaseTest extends WebTestCase
{
    /**
     * @var Client
     */
    protected $client;

    /**
     * Set up tests.
     */
    public function setUp()
    {
        $this->client = static::createClient();
    }

    /**
     * Login as super admin munireg.
     */
    protected function logInAsSuperAdminMunireg()
    {
        $this->logIn('superadmin@munireg.com', '121ecommerce');
    }

    /**
     * Login as admin munireg.
     */
    protected function logInAsAdminMunireg()
    {
        $this->logIn('admin@munireg.com', '121ecommerce');
    }

    /**
     * Login as munireg.
     */
    protected function logInAsMunireg()
    {
        $this->logIn('user@munireg.com', '121ecommerce');
    }

    /**
     * Login as admin municipality.
     */
    protected function logInAsAdminMunicipality()
    {
        $this->logIn('admin@municipal.com', '121ecommerce');
    }

    /**
     * Login as municipality.
     */
    protected function logInAsMunicipality()
    {
        $this->logIn('admin@municipal.com', '121ecommerce');
    }

    /**
     * Login as admin register party.
     */
    protected function logInAsAdminRegisterParty()
    {
        $this->logIn('admin@register.com', '121ecommerce');
    }

    /**
     * Login as register party.
     */
    protected function logInAsRegisterParty()
    {
        $this->logIn('user@register.com', '121ecommerce');
    }

    /**
     * Generate a login
     *
     * @param string $username
     * @param string $password
     *
     */
    private function logIn($username, $password)
    {
        $session = $this->client->getContainer()->get('session');

        $firewallName = 'user';
        $firewallContext = 'user';

        $token = new UsernamePasswordToken($username, $password, $firewallName);
        $session->set('_security_'.$firewallContext, serialize($token));
        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        $this->client->getCookieJar()->set($cookie);
    }
}
