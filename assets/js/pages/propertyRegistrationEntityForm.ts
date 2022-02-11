import $ = require('jquery');
import AjaxClient = require('../lib/ajaxClient');
import eventBus = require('../lib/eventBus');
import Util = require('../lib/util');

class EntityForm {
    private $modalContainer:JQuery;
    private entityInput:string;
    private searchInputName:string;

    constructor() {
        this.$modalContainer = $('#simple-form-modal');
        eventBus.on('registration:entity:create', this.createNewEntity, this);

        this.bindButtons();
    }

    private bindButtons() {
        this.$modalContainer.on('click', '.change-type', (e) => {
            e.preventDefault();

            var $button = $(e.currentTarget);
            var url = $button.data('href');

            if (!$button.hasClass('active')) {
                Util.hideModal(this.$modalContainer, () => {
                    eventBus.trigger('registration:entity:create', {
                        url: url,
                        searchInputName: this.searchInputName,
                        entityInput: this.entityInput,
                        entityType: $button.data('type')
                    });
                });
            }
        });
    }

    private createNewEntity(data) {
        this.searchInputName = data.searchInputName;
        this.entityInput = data.entityInput;
        var $searchInput:JQuery = $('#' + data.searchInputName);
        var $entityInput:JQuery = $('#' + data.entityInput);
        var $contactInput:JQuery = $('input.input-contact-search[data-entity=' + data.entityInput + ']');

        Util.showAjaxFormModal(
            this.$modalContainer,
            data.url,
            '.accept-button',
            () => {
                var $currentType:JQuery = $('a.change-type[data-type=' + data.entityType + ']');
                if (!$currentType.hasClass('active')) {
                    $currentType.addClass('active');
                }
            },
            () => {},
            (result) => {
                if (result.msgError) {
                    Util.alert(result.msgError);
                } else {
                    $entityInput.val(result.entityId);
                    $searchInput.val(result.fullName);

                    $contactInput.val('');
                    $contactInput.removeAttr('disabled');
                }
            }
        );
    }
}

export = EntityForm;
