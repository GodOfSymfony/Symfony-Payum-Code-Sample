import $ = require('jquery');
import AjaxClient = require('../lib/ajaxClient');

class PropertyForm {
    private $container:JQuery;

    constructor() {
        this.$container = $('#property-form');

        this.initializeEvents();
        this.initializeNumInput();
    }

    private initializeNumInput() {
        $('input[type=\'number\']').keypress((e) => {
            let $key = e.keyCode;
            if ($key == 46 || $key == 69 || $key == 101) {
                e.preventDefault();
            }
        });
    }

    private initializeEvents() {
        this.$container.on('change', '#property_form_registrant', (e) => {
            let $element = $(e.currentTarget);
            let $form = $element.closest('form');
            let data = {};
            data[$element.attr('name')] = $element.val();

            $form.addClass('loading');
            AjaxClient.post($form.attr('action'), data)
                .done((data) => {
                    let html = data.html;

                    $('#property_form_propertyManager').replaceWith(
                        $(html).find('#property_form_propertyManager')
                    );

                    $('#property_form_localAgentOfServices').replaceWith(
                        $(html).find('#property_form_localAgentOfServices')
                    );

                    $('#property_form_mfsPpc').replaceWith(
                        $(html).find('#property_form_mfsPpc')
                    );

                    $('#property_form_mortgagee').replaceWith(
                        $(html).find('#property_form_mortgagee')
                    );

                    $('#property_form_owner').replaceWith(
                        $(html).find('#property_form_owner')
                    );

                    $('#property_form_trustee').replaceWith(
                        $(html).find('#property_form_trustee')
                    );

                    $('#property_form_legalAgent').replaceWith(
                        $(html).find('#property_form_legalAgent')
                    );

                    $form.removeClass('loading');
                });
        });
    }
}

export = PropertyForm;
