<?php

namespace Tests\AppBundle\Controller;

/**
 * Class SecurityControllerTest
 */
class SecurityControllerTest extends ControllerBaseTest
{
    /**
     * Test Login action
     */
    public function testLoginAction()
    {
        $this->client->request('GET', '/login');

        $this->assertEquals(
            200,
            $this->client->getResponse()->getStatusCode()
        );
    }
}
