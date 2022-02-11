import $ = require('jquery');
import _ = require('lodash');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');

class EntityContacts {
    protected $formContainer:JQuery;
    protected $listContainer:JQuery;

    constructor($listContainer:JQuery, $formContainer:JQuery) {
        this.$listContainer = $listContainer;
        this.$formContainer = $formContainer;

        this.initializeDeleteAction();
        this.initializeEditAction();
        this.initializeAccordion();
    }

    private initializeAccordion() {
        // this.$listContainer.on('click', '.collapser-button', (e) => {
        //     e.preventDefault();
        //     var $btn = $(e.currentTarget);
        //     var $accordion = $btn.parent().parent();
        //
        //     if ($accordion.hasClass('active')) {
        //         $accordion.removeClass('active');
        //     } else {
        //         $accordion.addClass('active');
        //     }
        // });
    }

    private initializeEditAction() {
        this.$listContainer.on('click', '.edit-action', (e) => {
            e.preventDefault();

            var $button = $(e.currentTarget);
            var href = $button.attr('href');

            this.$formContainer.addClass('loading');
            AjaxClient.call('GET', href)
                .done((data, xhr) => {
                    this.$formContainer.html(data.html);
                })
                .fail((data, xhr) => {
                    Util.alert('Error loading the category. Try again later.');
                });

            this.$formContainer.removeClass('loading');
        });
    }

    private initializeDeleteAction() {
        // this.$listContainer.on('click', '.delete-action', (e) => {
        //     e.preventDefault();
        //
        //     var $button = $(e.currentTarget);
        //     var href = $button.attr('href');
        //     var httpMethod = $button.data('http-method');
        //     var message = $button.data('message');
        //     var warning = $button.data('warning');
        //
        //     var $itemContainer = $button.parent().parent();
        //
        //     if (httpMethod == null || httpMethod.length == '') {
        //         httpMethod = 'POST';
        //     }
        //
        //     if (message == null || message.length == '') {
        //         message = 'Are you sure you want to delete the Contact?';
        //     }
        //
        //     var doDelete = () => {
        //         this.$listContainer.addClass('loading');
        //
        //         AjaxClient.call(httpMethod, href)
        //             .done((data, xhr) => {
        //             })
        //             .fail((data, xhr) => {
        //                 Util.alert('The item could not be removed. Try again later.')
        //             });
        //
        //         this.$listContainer.removeClass('loading');
        //
        //         $itemContainer.hide();
        //         $itemContainer.remove();
        //     };
        //
        //     Util.confirmation({
        //         message: message,
        //         warning: warning,
        //         success: doDelete
        //     });
        // });
    }
}

export = EntityContacts;

