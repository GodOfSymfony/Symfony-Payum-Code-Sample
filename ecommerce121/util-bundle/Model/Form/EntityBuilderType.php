<?php

namespace Ecommerce121\UtilBundle\Model\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Base class for all EntityBuilder's form types.
 */
abstract class EntityBuilderType extends AbstractType
{
    /**
     * @var ValidatorInterface
     */
    protected $validation;

    /**
     * Constructor.
     *
     * @param ValidatorInterface $validation
     */
    public function __construct(ValidatorInterface $validation)
    {
        $this->validation = $validation;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->addEventSubscriber(new EntityBuilderValidationListener($this->validation));
    }

    /**
     * {@inheritdoc}
     */
    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars['attr']['novalidate'] = 'novalidate';
    }
}
