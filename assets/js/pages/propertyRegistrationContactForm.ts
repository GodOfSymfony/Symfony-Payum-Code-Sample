import $ = require('jquery');
import AjaxClient = require('../lib/ajaxClient');
import eventBus = require('../lib/eventBus');
import Util = require('../lib/util');

class EntityContactForm {
    private $modalContainer:JQuery;

    constructor() {
        this.$modalContainer = $('#simple-form-modal');
        eventBus.on('registration:create:contact', this.createNewContact, this);
    }

    private createNewContact(data) {
        var $searchInput:JQuery = $('#' + data.searchInputName);
        var $contactInput:JQuery = $('#' + data.contactInput);

        Util.showAjaxFormModal(this.$modalContainer, data.url, '.accept-button', '' , '', (result) => {
            if (result.msgError) {
                Util.alert(result.msgError);
            } else {
                $contactInput.val(result.contactId);
                $searchInput.val(result.fullName);
            }
        });
    }
}

export = EntityContactForm;
