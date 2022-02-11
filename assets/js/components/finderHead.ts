import $ = require('jquery');

class FinderHead {
    private $container:JQuery;
    private $btnTrigger:JQuery;

    constructor() {
        this.$btnTrigger = $('.aBtnHeaderPlus');
        this.$container = $('.header-finder');
        this.initializeEvents();
    }
    private initializeEvents() {

        this.$btnTrigger.on('click', (e) => {

            if (this.$container.hasClass('active') == false) {
                this.$container.addClass('active');
            } else {
                this.$container.removeClass('active');
            }

        });
    }
}

export = FinderHead;
