import $ = require('jquery');

class InputSpinner {
    private $container:JQuery;

    constructor() {
        this.$container = $('#version-form');

        this.initializeSpinner();
    }
    private initializeSpinner() {
        this.$container.find('.go-major-up, .go-minor-up').on('click', (e) => {
            let $target = $(e.currentTarget).closest('div').find('input');
            // tslint:disable-next-line:radix
            let value = $target.val() ? parseInt($target.val()) + 1 : 0;
            $target.val(value.toString());
        });
        this.$container.find('.go-major-down, .go-minor-down').on('click', (e) => {
            let $target = $(e.currentTarget).closest('div').find('input');
            // tslint:disable-next-line:radix
            let value = $target.val() && parseInt($target.val()) > 0 ? parseInt($target.val()) - 1 : 0;
            $target.val(value.toString());
        });
    }
}

export = InputSpinner;
