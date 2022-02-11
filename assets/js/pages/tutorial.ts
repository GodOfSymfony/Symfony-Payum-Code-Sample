import $ = require('jquery');
import _ = require('lodash');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');
import eventBus = require('../lib/eventBus');

class Tutorial {
    protected $container:JQuery;
    private $tutorialContainer:JQuery;
    private isManagementCategory:boolean;

    constructor($container:JQuery, isManagement) {
        this.$container = $container;
        this.$tutorialContainer = $('.category-content');
        this.isManagementCategory = isManagement;

        this.initializeDeleteAction($container);
        this.initializeSortable();
        this.initializeDroppable();
        this.initializeObserveCategories();
        this.initializeEditCategory();
    }

    private initializeDroppable() {
        if (this.isManagementCategory) {
            let $container = $('.category-droppable');
            $container.droppable({
                accept: '.tutorial-content',
                drop: (event, ui) => {
                    let $newContainer = $(event.target).parent().children('.category-content');
                    let $tutorial = $(ui.draggable);

                    if ($newContainer.data('category') != $tutorial.data('category')) {
                        //Append to new Container.
                        Tutorial.appendNewTutorial($tutorial, $newContainer);
                        this.applySaveTutorialCategory($tutorial.data('tutorial'), $newContainer.data('category'));
                        this.applyReorderPositionTutorial($newContainer);
                    }
                }
            });
        }
    }

    static appendNewTutorial($tutorial:JQuery, $container:JQuery) {
        $tutorial.hide();
        let $newTutorial = $tutorial.clone();
        //Remove draggable classes and inline style.
        $newTutorial.removeClass('ui-sortable-helper');
        $newTutorial.removeAttr('style');
        $newTutorial.appendTo($container);
        //Change the tutorial data category.
        $newTutorial.data('category', $container.data('category'));
        $newTutorial.attr('data-category', $container.data('category'));
        $tutorial.remove();
    }

    private initializeSortable() {
        if (this.isManagementCategory) {
            this.$container.sortable({
                handle: '.move-action',
                stop: () => {
                    this.applyReorderPositionCategory();
                }
            });
            $('.category-content').sortable({
                handle: '.move-tutorial',
                stop: (e, ui) => {
                    let $button = $(ui.item);
                    let $categoryContent = $button.parent('.category-content');
                    this.applyReorderPositionTutorial($categoryContent);
                }
            });
        }
    }

    private initializeEditCategory() {
        if (this.isManagementCategory) {
            this.$container.on('click', '.edit-action', (e) => {
                e.preventDefault();

                let $button = $(e.currentTarget);
                let href = $button.attr('href');

                let $formContainer = $('#category-form-container');

                $formContainer.addClass('loading');
                AjaxClient.call('GET', href)
                    .done((data, xhr) => {
                        $formContainer.removeClass('loading');
                        $formContainer.html(data.html);
                    })
                    .fail((data, xhr) => {
                        $formContainer.removeClass('loading');
                        Util.alert('Error loading the category. Try again later.');
                    });
            });
        }
    }

    private initializeDeleteAction($container:JQuery) {
        $container.on('click', '.delete-action', (e) => {
            e.preventDefault();

            let $button = $(e.currentTarget);
            let href = $button.attr('href');
            let httpMethod = $button.data('http-method');
            let message = $button.data('message');
            let warning = $button.data('warning');
            let $itemContainer:JQuery;

            if ($button.hasClass('category')) {
                //Delete category.
                $itemContainer = $button.parent().parent().parent();
            } else {
                //Delete tutorial.
                $itemContainer = $button.parent().parent();
            }

            if (httpMethod == null || httpMethod.length == '') {
                httpMethod = 'POST';
            }

            if (message == null || message.length == '') {
                message = 'Are you sure you want to delete the item?';
            }

            let doDelete = () => {
                $container.addClass('loading');

                AjaxClient.call(httpMethod, href)
                    .done((data, xhr) => {
                    })
                    .fail((data, xhr) => {
                        Util.alert('The item could not be removed. Try again later.')
                    });

                $container.removeClass('loading');

                $itemContainer.hide();
                $itemContainer.remove();
            };

            Util.confirmation({
                message: message,
                warning: warning,
                success: doDelete
            });
        });
    }

    private initializeObserveCategories() {
            let categoryContainer = $('.category-container');
            let tutorialContainer = $('#container-tutorial-detail');
            tutorialContainer.addClass('loading');
            categoryContainer.click((e) => {
                let $element = $(e.currentTarget);

                if ($element.children().hasClass('active') == false) {

                    if (this.isManagementCategory == false) {
                        categoryContainer.children().removeClass('active');
                        //loads tutorial for categories.
                        AjaxClient.post(Routing.generate('app_tutorial_list'), {categoryId: $element.attr('data-tutorial-category-id')})
                            .done((data, xhr) => {
                                tutorialContainer.html(data.html);
                                tutorialContainer.removeClass('loading');
                                eventBus.trigger('image:modal:load');
                            });
                    }

                    $element.children().addClass('active');
                } else {
                    $element.children().removeClass('active');
                }
            }).bind(this);
    }

    private applyReorderPositionCategory() {
        this.$container.addClass('loading');

        let data = [];
        _.each(this.$container.find('.category-container'), (current) => {
            data.push($(current).data('tutorial-category-id'));
        });

        AjaxClient.post(Routing.generate('app_tutorial_reorder_position_category'), { categories: data })
            .done((data, xhr) => {
                this.$container.removeClass('loading');
            });
    }

    private applyReorderPositionTutorial($categoryContent:JQuery) {
        this.$container.addClass('loading');

        let data = [];
        _.each($categoryContent.find('.tutorial-content'), (current) => {
            data.push($(current).data('tutorial'));
        });

        AjaxClient.post(Routing.generate('app_tutorial_reorder_position_tutorial'), { tutorials: data })
            .done((data, xhr) => {
                this.$container.removeClass('loading');
            });
    }

    private applySaveTutorialCategory(item, container) {
        this.$container.addClass('loading');
        AjaxClient.post(Routing.generate('app_tutorial_save_category'), { tutorialId: item, containerId: container })
            .done((data, xhr) => {
                this.$container.removeClass('loading');
            });
    }
}

export = Tutorial;

