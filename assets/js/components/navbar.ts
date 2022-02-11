import $ = require('jquery');

class Navbar {
    private $element:JQuery;

    constructor(elementSelector:string) {
        this.$element = $(elementSelector);

        this.initializeEvents();
    }

    private initializeEvents() {
        $(document).on('click', (e:JQueryEventObject) => {
            this.$element.find('.dropdown').removeClass('open');
        });

        this.$element.on('click', '.dropdown-menu', (e:JQueryEventObject) => {
            e.stopPropagation();
        });

        this.$element.on('click', '.dropdown-toggle', (e:JQueryEventObject) => {
            e.preventDefault();
            e.stopPropagation();
            var $dropdown = $(e.currentTarget).parents('.dropdown');
            this.$element.find('.dropdown').not($dropdown).removeClass('open');

            $dropdown.toggleClass('open');
        });
    }
}

export = Navbar;
