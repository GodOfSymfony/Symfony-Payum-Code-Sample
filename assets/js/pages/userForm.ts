import $ = require('jquery');

class UserForm {
    private $container:JQuery;
    private countryUsName:string;

    constructor(options) {
        this.$container = $('#user-form');
        this.countryUsName = options.countryUsName;

        this.initializeEvents();
    }

    private initializeEvents() {
        this.$container.on('change', '.country-select', (e) => {
            var countryId = this.$container.find('.country-select').val();

            if (countryId == '') {
                this.$container.find('.state-select').parent().addClass('hidden');
                this.$container.find('.state-input').parent().addClass('hidden');

                return;
            }

            var countryName = this.$container.find('.country-select :selected').text();

            if (countryName === this.countryUsName) {
                this.$container.find('.state-select').parent().removeClass('hidden');
                this.$container.find('.state-input').parent().addClass('hidden');
            } else {
                this.$container.find('.state-select').parent().addClass('hidden');
                this.$container.find('.state-input').parent().removeClass('hidden');
            }
        });
    }
}

export = UserForm;
