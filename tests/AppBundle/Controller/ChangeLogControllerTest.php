<?php

namespace Tests\AppBundle\Controller;

/**
 * Class ChangeLogControllerTest
 */
class ChangeLogControllerTest extends ControllerBaseTest
{
    /**
     * Test my action
     */
    public function testIndexActionAsSuperAdminMunireg()
    {
        $this->logInAsSuperAdminMunireg();
        $this->client->request('GET', '/changelogs');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test my action
     */
    public function testIndexActionAsAdminMunireg()
    {
        $this->logInAsAdminMunireg();
        $this->client->request('GET', '/changelogs');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * Test my action
     */
    public function testIndexActionAsMunireg()
    {
        $this->logInAsMunireg();
        $this->client->request('GET', '/changelogs');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }
}
