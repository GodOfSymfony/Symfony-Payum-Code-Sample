import $ = require('jquery');

class PropertyFilingForm {
    private $container:JQuery;
    constructor() {
        this.$container = $('.drop-area');

        this.initializeHoverDrag();
    }

    private initializeHoverDrag() {

        this.$container.on('dragover', (e) => {
            this.$container.addClass('active');
        });
        this.$container.on('dragleave', (e) => {
            this.$container.removeClass('active');

        });
    }
}

export = PropertyFilingForm;