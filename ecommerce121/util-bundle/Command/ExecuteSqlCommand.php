<?php

namespace Ecommerce121\UtilBundle\Command;

use Doctrine\ORM\EntityManager;
use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Command that executes SQL files in doctrine's default manager.
 */
class ExecuteSqlCommand extends Command
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this->setName('util:execute-sql')
            ->setDescription('Execute sql file in doctrine default manager')
            ->setHelp(<<<EOF
The <info>%command.name%</info> command executes sql files in doctrine's default manager.
EOF
            )
            ->addArgument('sql_file', InputArgument::REQUIRED, 'What sql file do you want to execute?');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $sqlFile = $input->getArgument('sql_file');

        if (!file_exists($sqlFile)) {
            $output->writeln('Aborting: file '.$sqlFile.' not found');

            return;
        }

        $output->writeln('Executing '.$sqlFile.'...');
        $sql = file_get_contents($sqlFile);

        if (strlen(trim($sql)) == 0) {
            return;
        }

        /* @var EntityManager $em */
        $em = $this->getContainer()->get('doctrine')->getManager('default');
        $conn = $em->getConnection();

        try {
            $conn->beginTransaction();

            $conn->exec($sql);

            $conn->commit();
        } catch (Exception  $e) {
            $conn->rollback();

            throw $e;
        }

        $output->writeln('File loaded successfully!');
    }
}
