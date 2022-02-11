import $ = require('jquery');

class RegistrationForm {
    private $fieldIndividual:JQuery;
    private $requestedOrg:JQuery;

    constructor($fieldIndividual:JQuery, $requestedOrg:JQuery) {
        this.$fieldIndividual = $fieldIndividual;
        this.$requestedOrg = $requestedOrg;

        this.initializeEvents();
    }

    private initializeEvents() {
        this.$fieldIndividual.on('change', (e) => {
            let $label = this.$requestedOrg.parent().children('.textfield-label');
            if(this.$fieldIndividual.prop('checked') ) {
                this.$requestedOrg.val('');
                this.$requestedOrg.prop('disabled', true);
                this.$requestedOrg.addClass('disabled');
                $label.removeClass('required');
            } else {
                this.$requestedOrg.prop('disabled', false);
                this.$requestedOrg.removeClass('disabled');
                $label.addClass('required');
            }
        });
    }
}

export = RegistrationForm;
