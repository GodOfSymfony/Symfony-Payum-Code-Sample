import $ = require('jquery');
import AjaxClient = require('../lib/ajaxClient');

class PropertyRegistrationForm {
    private $form:JQuery;
    private $continueBtn: JQuery;
    private $url;
    private $entityFields: Array<string>;
    private formName: string;

    constructor(options) {
        this.$continueBtn = $('#continue-new');
        this.$url = options.url;
        this.formName = options.formName;
        this.$form = $('form[name=' + this.formName + ']');

        this.$entityFields = [
                'localAgentOfServices',
                'mortgagee',
                'owner',
                'trustee',
                'propertyManager',
                'mfsPpc',
                'legalAgent'
            ];

        this.bindElements();
    }

    private bindElements() {
        this.$continueBtn.on('click', (e) => {
            e.preventDefault();
            this.$form.attr('action', this.$url);
            this.$form.submit();
        });
        this.$form.on('change', '#registration_form_registrant', (e) => {
            let $element = $(e.currentTarget);
            let $form = $element.closest('form');

            $form.addClass('loading');

            _.each(this.$entityFields, (name) => {
                let entityId = '#' + this.formName + '_' + name;
                let contactId = '#' + this.formName + '_' + name + 'Contact';
                var $contactInput:JQuery = $('input[name=' + name + 'Contact]');
                //Reset inputs and search values.
                $('input[name=' + name + 'Entity]').val('');
                $contactInput.val('');
                $contactInput.attr('disabled', 'disabled');

                $(entityId).val('');
                $(contactId).val('');
            });

            $form.removeClass('loading');
        });
    }
}

export = PropertyRegistrationForm;
