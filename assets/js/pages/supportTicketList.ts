import $ = require('jquery');
import _ = require('lodash');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');

class SupportTicketActions {
    protected $container: JQuery;
    private $btnTrigger: JQuery;


    constructor($container: JQuery) {
        this.$container = $container;

        this.initializeDeleteAction();
        this.initializeViewMoreAction();
        this.$btnTrigger = $('.a-btn-acordion');
    }

    private initializeDeleteAction() {
        this.$container.on('click', '.delete-action', (e) => {
            e.preventDefault();

            var $button = $(e.currentTarget);
            var href = $button.attr('href');
            var httpMethod = $button.data('http-method');
            var message = $button.data('message');
            var warning = $button.data('warning');
            var deleteError = $button.data('delete-error');
            var disableOnError = $button.data('disable-on-error');
            var disableAction = $button.data('disable-action');

            if (httpMethod == null || httpMethod.length == '') {
                httpMethod = 'POST';
            }

            if (message == null || message.length == '') {
                message = 'Are you sure you want to delete the item?';
            }
            if (deleteError == null || deleteError.length == '') {
                if (disableOnError) {
                    deleteError = 'Could not delete the item, do you want to disable it?';
                } else {
                    deleteError = 'Could not delete the item, please check for existing dependencies';
                }
            }

            var doDisable = () => {
                AjaxClient.call(httpMethod, disableAction)
                    .done((data, jqXHR) => {
                        this.refreshListing();
                    });
            };

            var doDelete = () => {
                this.$container.addClass('loading');

                AjaxClient.call(httpMethod, href)
                    .done((data, xhr) => {
                        this.$container.removeClass('loading');
                        this.refreshListing();
                    })
                    .fail((data, xhr) => {
                        this.$container.removeClass('loading');

                        if (disableOnError) {
                            Util.confirmation({
                                message: deleteError,
                                success: doDisable
                            });
                        } else {
                            Util.alert(deleteError);
                        }
                    });
            };

            Util.confirmation({
                message: message,
                warning: warning,
                success: doDelete
            });
        });
    }

    public refreshListing(options?) {
        var defaultOptions = {
            callback: null,
            historyPush: true
        };
        options = _.extend(defaultOptions, options);
        this.$container.addClass('loading');

        let supportTicketUrl = $('.support-ticket-list', this.$container).data('support-ticket-url');

        AjaxClient.get(supportTicketUrl)
            .done((data, xhr) => {
                $('.support-ticket-list', this.$container).html(data.html);

                Util.initializePlugins(this.$container);
                this.$container.removeClass('loading');
                Util.safeCall(options.callback);
            });
    }

    private initializeViewMoreAction() {
        this.$container.on('click', '.see-more-btn', (e) => {
            e.preventDefault();
            this.refreshListing();
        });
    }
}

export = SupportTicketActions;

