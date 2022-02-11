import $ = require('../vendor/jquery-2.1.4');
import eventBus = require('../lib/eventBus');

class Collapsible {
    private $container:JQuery;

    constructor(container:JQuery) {
        this.$container = container;

        this.initializeEvents();
    }
    private initializeEvents() {
        this.$container.on('click', '.collapser-button', (e) => {
            e.preventDefault();

            let $currentTarget = $(e.currentTarget);
            let $collapsibleContainer = $currentTarget.closest('.collapsible-container');
            let element = $collapsibleContainer.data('element');

            if ($collapsibleContainer.hasClass('active')) {
                $collapsibleContainer.removeClass('active');
                eventBus.trigger('collapsible:toggle', { element: element, opened: false });
            } else {
                $collapsibleContainer.addClass('active');
                eventBus.trigger('collapsible:toggle', { element: element, opened: true });
            }
        });
    }
}

export = Collapsible;
