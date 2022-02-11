import $ = require('jquery');
import _ = require('lodash');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');
import eventBus = require('../lib/eventBus');

class Version {
    protected $majorContainer:JQuery;
    protected $listContainer:JQuery;

    constructor($majorContainer:JQuery, $listContainer:JQuery) {
        this.$majorContainer = $majorContainer;
        this.$listContainer = $listContainer;

        this.initializeDeleteAction(this.$majorContainer);
        this.initializeDeleteAction(this.$listContainer);
        this.initializeLoadVersion();
        this.initializeLoadContent();
    }

    private initializeLoadVersion() {
        this.$majorContainer = $('.major-container');
        this.$listContainer.addClass('loading');

        this.$majorContainer.on('click', '.version-header', (e) => {
            let $element = $(e.currentTarget);

            if ($element.parent().hasClass('active') == false) {
                this.$majorContainer.children().removeClass('active');

                AjaxClient.post(Routing.generate('app_version_list'), {majorId: $element.attr('data-major-version')})
                    .done((data, xhr) => {
                        this.$listContainer.html(data.html);
                        this.$listContainer.removeClass('loading');
                        eventBus.trigger('image:modal:load');
                    });

                $element.parent().addClass('active');
            } else {
                $element.parent().removeClass('active');
            }
        }).bind(this);

        this.$listContainer.removeClass('loading')
    }

    private initializeLoadContent() {
        this.$majorContainer.on('click', '.link-to-content', (e) => {
            let $button = $(e.currentTarget);
            let versionId = $button.attr('href');
            let $element = $(versionId);

            if ($element.hasClass('active') == false) {
                this.$listContainer.children().removeClass('active');
                $element.addClass('active');
            }
        }).bind(this);

        this.$listContainer.on('click', '.version-title', (e) => {
            let $element = $(e.currentTarget);

            if ($element.parent().hasClass('active') == false) {
                this.$listContainer.children().removeClass('active');
                $element.parent().addClass('active');
            } else {
                $element.parent().removeClass('active');
            }
        }).bind(this);
    }

    private initializeDeleteAction($container:JQuery) {
        $container.on('click', '.delete-action', (e) => {
            e.preventDefault();

            let $button = $(e.currentTarget);
            let href = $button.attr('href');
            let httpMethod = $button.data('http-method');
            let message = $button.data('message');
            let warning = $button.data('warning');

            let versionClass = $button.data('version');
            let $itemContainer = $('.' + versionClass);

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
}

export = Version;

