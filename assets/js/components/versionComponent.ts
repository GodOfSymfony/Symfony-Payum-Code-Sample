import $ = require('jquery');

class VersionComponent {
    private $container:JQuery;
    private $btnTrigger:JQuery;

    constructor() {
        this.$container = $('.changelog-wrapper');
        this.$btnTrigger = $('.changelog-header');

        this.initializeChangeLog();
    }
    private initializeChangeLog() {

        this.$btnTrigger.on('click', (e) => {

            if (!this.$container.hasClass('active')) {
                this.$container.addClass('active');
            } else {
                this.$container.removeClass('active');
            }

        });
    }
}

export = VersionComponent;
