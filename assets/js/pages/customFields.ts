import $ = require('jquery');
import _ = require('lodash');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');
import CustomFieldsOptions from './customFieldsOptions';

class CustomFields {
    protected $container:JQuery;
    protected $formContainer:JQuery;


    constructor($container:JQuery, $formContainer:JQuery) {
        this.$container = $container;
        this.$formContainer = $formContainer;
        this.initializeDeleteAction();
        this.initializeSortable();
        this.initializeEditAction();
    }

    private initializeSortable() {
        this.$container.sortable({
            handle: '.move-action',
            stop: () => {
                this.applyReorderPosition();
            }
        });

        this.$container.on('click', '.icon-arrow', (e) => {
            e.preventDefault();
            var $btn = $(e.currentTarget);
            var $span = $btn.parent().parent();
            var $accordionContainer = $span.parent().parent();

            if ($accordionContainer.hasClass('active')) {
                $accordionContainer.removeClass('active');
            } else {
                $accordionContainer.addClass('active');
            }
        });
    }

    private initializeEditAction() {
        this.$container.on('click', '.edit-action', (e) => {
            e.preventDefault();
            var $btn = $(e.currentTarget);
            var href = $btn.attr('href');
            var $accordionContainer = $btn.parent().parent().parent();

            if (!$accordionContainer.hasClass('active')) {
                $accordionContainer.addClass('active');
            }

            this.$formContainer.addClass('loading');

            AjaxClient.call('GET', href)
                .done((data, xhr) => {
                    this.$formContainer.html(data.html);
                    this.$formContainer.on('click', '.submit-btn', (e) => {
                        e.preventDefault();
                        var $form = $('form[name=custom_field_form]');
                        $form.submit();
                    });
                    new CustomFieldsOptions();
                })
                .fail((data, xhr) => {
                    Util.alert('Error loading the Field. Try again later.');
                });
            this.$formContainer.removeClass('loading');
        });
    }

    private initializeDeleteAction() {
        this.$container.on('click', '.delete-field', (e) => {
            e.preventDefault();

            var $button = $(e.currentTarget);
            var href = $button.attr('href');
            var httpMethod = 'POST';
            var message = $button.data('message');

            if (message == null || message.length == '') {
                message = 'Are you sure you want to delete the item?';
            }

            var confirmDelete = () => {
                $('.fields-container').addClass('loading');
                AjaxClient.call(httpMethod, href)
                    .done((data, xhr) => {
                        $button.closest('.container-accordion').remove();
                    })
                    .fail((data, xhr) => {
                        Util.alert('Could not delete the item.');
                    });
                $('.fields-container').removeClass('loading');
            };

            Util.confirmation({
                message: message,
                success: confirmDelete,
            });
        });
    }

    private applyReorderPosition() {
        this.$container.addClass('loading');

        var data = [];
        _.each(this.$container.find('.field-container'), (current) => {
            data.push($(current).data('field-id'));
        });

        AjaxClient.post(Routing.generate('app_custom_field_reorder_position'), { fields: data })
            .done((data, xhr) => {
                this.$container.removeClass('loading');
            });
    }
}

export = CustomFields;
