import $ = require('jquery');
import Util = require('../lib/util');
import _ = require('lodash');

class PropertyRegistration {
    //Address Search
    private $form: JQuery;
    private $formContainer: JQuery;
    private $stateInput: JQuery;
    private $stateInputLbl: JQuery;
    private $municipality: JQuery;
    private $zipCodeInput: JQuery;
    private $zipCodeLbl: JQuery;
    private $cityInput: JQuery;
    private $itemElement: JQuery;
    private $address: JQuery;
    private $itemsContainer:JQuery;

    constructor(options) {
        this.$form = $(options.formElement);
        this.$formContainer = $('#form-container-registration');
        this.$stateInput = $(options.stateInput);
        this.$stateInputLbl = $(options.stateInputLbl);
        this.$municipality = $(options.municipalityInput);
        this.$zipCodeInput = $(options.zipCodeInput);
        this.$zipCodeLbl = $(options.zipCodeLbl);
        this.$cityInput = $(options.cityInput);
        this.$address = $(options.address);
        this.$itemElement = $(options.itemElement);
        this.$itemsContainer = $(options.itemsContainer);
        this.bindElements();
    }

    private bindElements() {

        this.$form.on('municipality:selected', (e: any) => {
            this.showFormContainer();
            this.$stateInput.val(e.stateName);
            this.$stateInputLbl.val(e.stateName);
            this.$municipality.val(e.municipality);
            this.$zipCodeInput.val(e.zipcode);
            this.$zipCodeLbl.val(e.zipcode);
            this.$cityInput.val('');
            this.$address.val('');
        });
    }

    private showFormContainer() {
        this.$form.show();
        this.$formContainer.show();
    }

}

export = PropertyRegistration;
