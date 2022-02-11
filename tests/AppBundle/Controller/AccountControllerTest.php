<?php

namespace Tests\AppBundle\Controller;

/**
 * Class AccountControllerTest
 */
class AccountControllerTest extends ControllerBaseTest
{
    /**
     * Test my action
     */
    public function testMyActionAsSuperAdminMunireg()
    {
        $this->logInAsSuperAdminMunireg();
        $this->client->request('GET', '/account');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test my action
     */
    public function testMyActionAsAdminMunireg()
    {
        $this->logInAsAdminMunireg();
        $this->client->request('GET', '/account');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test my action
     */
    public function testMyActionAsMunireg()
    {
        $this->logInAsMunireg();
        $this->client->request('GET', '/account');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test my action
     */
    public function testMyActionAsAdminMunicipality()
    {
        $this->logInAsAdminMunicipality();
        $this->client->request('GET', '/account');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test my action
     */
    public function testMyActionAsMunicipality()
    {
        $this->logInAsMunicipality();
        $this->client->request('GET', '/account');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test my action
     */
    public function testMyActionAsAdminRegisterParty()
    {
        $this->logInAsAdminRegisterParty();
        $this->client->request('GET', '/account');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test my action
     */
    public function testMyActionAsRegisterParty()
    {
        $this->logInAsRegisterParty();
        $this->client->request('GET', '/account');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }
}
