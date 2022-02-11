<?php

namespace Tests\AppBundle\Controller;

/**
 * Class ContactControllerTest
 */
class ContactControllerTest extends ControllerBaseTest
{
    /**
     * Test index action
     */
    public function testIndexActionAsSuperAdminMunireg()
    {
        $this->logInAsSuperAdminMunireg();
        $this->client->request('GET', '/contacts');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test index action
     */
    public function testIndexActionAsAdminMunireg()
    {
        $this->logInAsAdminMunireg();
        $this->client->request('GET', '/contacts');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test index action
     */
    public function testIndexActionAsMunireg()
    {
        $this->logInAsMunireg();
        $this->client->request('GET', '/contacts');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test index action
     */
    public function testIndexActionAsAdminMunicipality()
    {
        $this->logInAsAdminMunicipality();
        $this->client->request('GET', '/contacts');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test index action
     */
    public function testIndexActionAsMunicipality()
    {
        $this->logInAsMunicipality();
        $this->client->request('GET', '/contacts');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test index action
     */
    public function testIndexActionAsAdminRegisterParty()
    {
        $this->logInAsAdminRegisterParty();
        $this->client->request('GET', '/contacts');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test index action
     */
    public function testIndexActionAsRegisterParty()
    {
        $this->logInAsRegisterParty();
        $this->client->request('GET', '/contacts');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test form action
     */
    public function testFormActionAsSuperAdminMunireg()
    {
        $this->logInAsSuperAdminMunireg();
        $this->client->request('GET', '/contacts/form');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test form action
     */
    public function testFormActionAsAdminMunireg()
    {
        $this->logInAsAdminMunireg();
        $this->client->request('GET', '/contacts/form');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test form action
     */
    public function testFormActionAsMunireg()
    {
        $this->logInAsMunireg();
        $this->client->request('GET', '/contacts/form');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test form action
     */
    public function testFormActionAsAdminMunicipality()
    {
        $this->logInAsAdminMunicipality();
        $this->client->request('GET', '/contacts/form');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test form action
     */
    public function testFormActionAsMunicipality()
    {
        $this->logInAsMunicipality();
        $this->client->request('GET', '/contacts/form');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test form action
     */
    public function testFormActionAsAdminRegisterParty()
    {
        $this->logInAsAdminRegisterParty();
        $this->client->request('GET', '/contacts/form');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test form action
     */
    public function testFormActionAsRegisterParty()
    {
        $this->logInAsRegisterParty();
        $this->client->request('GET', '/contacts/form');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }
}
