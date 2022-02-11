<?php

namespace Ecommerce121\UtilBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * {@inheritDoc}
 */
class GenerateEntitiesCommand extends Command
{
    /**
     * {@inheritDoc}
     */
    protected function configure()
    {
        $this
            ->setName('util:generate-entities')
            ->setDescription('Generate entities getters and setters');

    }

    /**
     * {@inheritDoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $command = $this->getApplication()->find('doctrine:generate:entities');
        $arguments = array(
            'command' => 'doctrine:generate:entities',
            '--no-backup' => true,
            'name' => 'DomainBundle/Entity'
        );

        $input = new ArrayInput($arguments);
        $returnCode = $command->run($input, $output);
        if ($returnCode == 0) {
            $output->writeln('entities generated successfully');
        }
    }
}
