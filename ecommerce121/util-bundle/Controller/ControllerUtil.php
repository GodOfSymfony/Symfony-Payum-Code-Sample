<?php

namespace Ecommerce121\UtilBundle\Controller;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Templating\EngineInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormBuilder;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormTypeInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Twig\Environment;
use Twig\TemplateWrapper;

/**
 * Class with convenient utility methods for controllers.
 *
 * This class is based on Symfony's Controller class. It's designed to be used
 * in Controllers that don't inherit from Controller class.
 *
 * @see Controller
 */
class ControllerUtil
{
    /**
     * @var HttpKernelInterface
     */
    private $httpKernel;
    /**
     * @var Environment
     */
    private $templating;
    /**
     * @var RouterInterface
     */
    private $router;
    /**
     * @var FormFactoryInterface
     */
    private $formFactory;
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;
    /**
     * @var TranslatorInterface
     */
    private $translator;
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;
    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorizationChecker;
    /**
     * @var ValidatorInterface
     */
    private $validator;
    /**
     * @var EventDispatcherInterface
     */
    private $eventDispatcher;
    /**
     * @var string
     */
    private $kernelRootDir;

    /**
     * @var TemplateWrapper
     */
    private $templateWrapper;

    /**
     * Constructor.
     *
     * @param HttpKernelInterface           $httpKernel
     * @param string                        $kernelRootDir
     * @param Environment                   $templating
     * @param RouterInterface               $router
     * @param FormFactoryInterface          $formFactory
     * @param EntityManagerInterface        $entityManager
     * @param TranslatorInterface           $translator
     * @param TokenStorageInterface         $tokenStorage
     * @param AuthorizationCheckerInterface $authorizationChecker
     * @param ValidatorInterface            $validator
     * @param EventDispatcherInterface      $eventDispatcher
     * @param TemplateWrapper               $templateWrapper
     */
    public function __construct(
        HttpKernelInterface           $httpKernel,
        ParameterBagInterface         $bag,
        EntityManagerInterface        $entityManager,
        Environment                   $templating,
        RouterInterface               $router,
        FormFactoryInterface          $formFactory,
        ManagerRegistry               $doctrine,
        TranslatorInterface           $translator,
        TokenStorageInterface         $tokenStorage,
        AuthorizationCheckerInterface $authorizationChecker,
        ValidatorInterface            $validator,
        EventDispatcherInterface      $eventDispatcher
//        TemplateWrapper               $templateWrapper
    ) {
        $this->httpKernel           = $httpKernel;
        $this->kernelRootDir        = $bag->get('kernel.project_dir');
        $this->entityManager        = $entityManager;
        $this->templating           = $templating;
        $this->router               = $router;
        $this->formFactory          = $formFactory;
        $this->doctrine             = $doctrine;
        $this->translator           = $translator;
        $this->tokenStorage         = $tokenStorage;
        $this->authorizationChecker = $authorizationChecker;
        $this->validator            = $validator;
        $this->eventDispatcher      = $eventDispatcher;
//        $this->templateWrapper      = $templateWrapper;
    }

    /**
     * @return HttpKernelInterface
     */
    public function getHttpKernel()
    {
        return $this->httpKernel;
    }

    /**
     * @return string
     */
    public function getKernelRootDir()
    {
        return $this->kernelRootDir;
    }

    /**
     * Gets the templating engine.
     *
     * @return EngineInterface
     */
    public function getTemplating()
    {
        return $this->templating;
    }

    /**
     * Gets the validator component.
     *
     * @return ValidatorInterface
     */
    public function getValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the router component.
     *
     * @return RouterInterface
     */
    public function getRouter()
    {
        return $this->router;
    }

    /**
     * Gets the form factory component.
     *
     * @return FormFactoryInterface
     */
    public function getFormFactory()
    {
        return $this->formFactory;
    }

    /**
     * Gets doctrine entity manager.
     *
     * @return \Doctrine\ORM\EntityManagerInterface Doctrine's entity manager
     */
    public function getEntityManager()
    {
        return $this->entityManager;
    }

    /**
     * Gets a doctrine's entity proxy for use without loading object from database.
     *
     * @param string $entityName Entity class name (e.g. MyNeeds:User)
     * @param string $id         Entity database identifier
     *
     * @return object Entity proxy
     */
    public function getEntityReference($entityName, $id)
    {
        return $this->getEntityManager()->getReference($entityName, $id);
    }

    /**
     * Gets the translator component.
     *
     * @return TranslatorInterface
     */
    public function getTranslator()
    {
        return $this->translator;
    }

    /**
     * Gets the authorization checker component.
     *
     * @return AuthorizationCheckerInterface
     */
    public function getAuthorizationChecker()
    {
        return $this->authorizationChecker;
    }

    /**
     * Gets the token storage component.
     *
     * @return TokenStorageInterface
     */
    public function getTokenStorage()
    {
        return $this->tokenStorage;
    }

    /**
     * Gets the event dispatcher component.
     *
     * @return EventDispatcherInterface
     */
    public function getEventDispatcher()
    {
        return $this->eventDispatcher;
    }

    /**
     * Generates a URL from the given parameters.
     *
     * @param string         $route         The name of the route
     * @param mixed          $parameters    An array of parameters
     * @param Boolean|string $referenceType The type of reference (one of the constants in UrlGeneratorInterface)
     *
     * @return string The generated URL
     *
     * @see UrlGeneratorInterface
     */
    public function generateUrl($route, $parameters = array(), $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH)
    {
        return $this->router->generate($route, $parameters, $referenceType);
    }

    /**
     * Forwards the request to another controller.
     *
     * @param Request $request    The current request
     * @param string  $controller The controller name (a string like BlogBundle:Post:index)
     * @param array   $path       An array of path parameters
     * @param array   $query      An array of query parameters
     *
     * @return Response A Response instance
     */
    public function forward(Request $request, $controller, array $path = array(), array $query = array())
    {
        $path['_controller'] = $controller;
        $subRequest = $request->duplicate($query, null, $path);

        return $this->getHttpKernel()->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
    }

    /**
     * Returns a rendered view.
     *
     * @param string $view       The view name
     * @param array  $parameters An array of parameters to pass to the view
     *
     * @return string The rendered view
     */
    public function renderView($view, array $parameters = array())
    {
        return $this->templating->render($view, $parameters);
    }

    /**
     * Renders a view.
     *
     * @param string        $view       The view name
     * @param array         $parameters An array of parameters to pass to the view
     * @param Response|null $response   A response instance
     *
     * @return Response A Response instance
     */
    public function render($view, array $parameters = array(), Response $response = null)
    {
        $content = $this->templating->render($view, $parameters, $response);

        if (!$response) {
            $response = new Response();
        }

        return $response->setContent($content);
    }

    /**
     * Streams a view.
     *
     * @param string           $view       The view name
     * @param array            $parameters An array of parameters to pass to the view
     * @param StreamedResponse $response   A response instance
     *
     * @return StreamedResponse A StreamedResponse instance
     */
    public function stream($view, array $parameters = array(), StreamedResponse $response = null)
    {
        $templating = $this->templating;

        $callback = function () use ($templating, $view, $parameters) {
            $templating->stream($view, $parameters);
        };

        if (null === $response) {
            return new StreamedResponse($callback);
        }

        $response->setCallback($callback);

        return $response;
    }

    /**
     * Creates and returns a Form instance from the type of the form.
     *
     * @param string|FormTypeInterface $type    The built type of the form
     * @param mixed                    $data    The initial data for the form
     * @param array                    $options Options for the form
     *
     * @return FormInterface
     */
    public function createForm($type, $data = null, array $options = array())
    {
        return $this->formFactory->create($type, $data, $options);
    }

    /**
     * Creates and returns a form builder instance.
     *
     * @param mixed $data    The initial data for the form
     * @param array $options Options for the form
     *
     * @return FormBuilder
     */
    public function createFormBuilder($data = null, array $options = array())
    {
        return $this->formFactory->createBuilder('form', $data, $options);
    }

    /**
     * Translates the given message.
     *
     * @param string $id         The message id (may also be an object that can be cast to string)
     * @param array  $parameters An array of parameters for the message
     * @param string $domain     The domain for the message
     * @param string $locale     The locale
     *
     * @return string The translated string
     */
    public function trans($id, array $parameters = array(), $domain = 'messages', $locale = null)
    {
        return $this->translator->trans($id, $parameters, $domain, $locale);
    }

    /**
     * Translates the given choice message by choosing a translation according to a number.
     *
     * @param string $id         The message id (may also be an object that can be cast to string)
     * @param int    $number     The number to use to find the indice of the message
     * @param array  $parameters An array of parameters for the message
     * @param string $domain     The domain for the message
     * @param string $locale     The locale
     *
     * @return string The translated string
     */
    public function transChoice($id, $number, array $parameters = array(), $domain = 'messages', $locale = null)
    {
        return $this->translator->transChoice($id, $number, $parameters, $domain, $locale);
    }

    /**
     * Get a user from the token storage.
     *
     * @return mixed
     *
     * @throws \LogicException If SecurityBundle is not available
     *
     * @see Symfony\Component\Security\Core\Authentication\Token\TokenInterface::getUser()
     */
    public function getUser()
    {
        if (null === $token = $this->tokenStorage->getToken()) {
            return;
        }

        if (!is_object($user = $token->getUser())) {
            // e.g. anonymous authentication
            return;
        }

        return $user;
    }
}
