import $ = require('jquery');
import _ = require('lodash');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');

class FormMunicipalityCustomFields {
    protected $formFieldsContainer:JQuery;
    protected $customFieldsContainer:JQuery;
    protected $registrationContainer:JQuery;
    protected $renewalContainer:JQuery;
    protected $deRegistrationContainer:JQuery;
    protected $inspectionContainer:JQuery;
    private $municipalityId:string;
    private $deleteUrl:string;
    private $customFieldsUrl:string;


    constructor(options) {
        this.$formFieldsContainer = $('.fields-container');
        this.$customFieldsContainer = $('.custom-fields-container');
        this.$registrationContainer = $('.form-fields-container-registration');
        this.$renewalContainer = $('.form-fields-container-renewal');
        this.$deRegistrationContainer = $('.form-fields-container-deregistration');
        this.$inspectionContainer = $('.form-fields-container-inspection');
        this.$municipalityId = options.municipalityId;
        this.$deleteUrl = options.deleteUrl;
        this.$customFieldsUrl = options.customFieldsUrl;

        this.initializeDeleteAction();
        this.initializeFormsAccordion();
        this.initializeItemsAccordion();
        this.initializeResetActions();
        this.initializeSortable();
        this.initializeDraggable();
        this.initializeDroppable(this.$registrationContainer);
        this.initializeDroppable(this.$renewalContainer);
        this.initializeDroppable(this.$deRegistrationContainer);
        this.initializeDroppable(this.$inspectionContainer);
    }

    private initializeResetActions() {
        $('.reset-action').on('click', (e) => {
            e.preventDefault();
            var $button:JQuery = $(e.currentTarget);
            var $container:JQuery = $button.parent().parent().parent();
            var formType:string = $button.data('form-type');
            var href:string = $button.data('href');
            var containerName:string = '.form-fields-container-' + formType;

            var $fieldsContainer:JQuery = $container.children(containerName);

            var info = [];
            info.push(this.$municipalityId);
            info.push(formType);

            var confirmReset = () => {
                $container.addClass('loading');

                AjaxClient.post(href, { data: info })
                    .done((data, xhr) => {
                        $fieldsContainer.html(data.html);
                        this.loadCustomFields(formType);
                        this.initializeItemsAccordion();
                    })
                    .fail((data, xhr) => {
                        Util.alert('Could not reset the Form.');
                    });

                $container.removeClass('loading');
            };

            Util.confirmation({
                message: 'You will revert the Form, and Default fields will be loaded. Do you confirm?',
                success: confirmReset,
            });

        });
    }

    private initializeFormsAccordion() {
        $('.accordion-action').on('click', (e) => {
            e.preventDefault();
            $('.accordion-custom-father').removeClass('current');
            var $accordionFather:JQuery = $(e.currentTarget).parent().parent().parent();

            if (!$accordionFather.hasClass('current')) {
                $accordionFather.addClass('current');
                //refresh custom fields
                this.loadCustomFields($(e.currentTarget).data('form-type'));
            }else {
                $accordionFather.removeClass('current');
            }
            if (!$accordionFather.hasClass('active')) {
                $accordionFather.addClass('active');
            }else {
                $accordionFather.removeClass('active');
            }
        });
    }

    private loadCustomFields(type) {
        var $customsFields:JQuery = $('#custom_field_body');
        $customsFields.addClass('loading');
        var href:string = this.$customFieldsUrl.replace(/__type__/g,type);

        AjaxClient.get(href)
            .done((data, xhr) => {
                $customsFields.html(data.html);
                this.initializeAccordionTrigger($customsFields);
                this.initializeDraggable();
                $customsFields.removeClass('loading');
            });
    }

    private initializeItemsAccordion() {
        $('.item-action').off('click').on('click', (e) => {
            e.preventDefault();
            var $itemFather:JQuery = $(e.currentTarget).parent().parent().parent();

            if (!$itemFather.hasClass('active')) {
                $itemFather.addClass('active');
            }else {
                $itemFather.removeClass('active');
            }
        });
    }

    private initializeDraggable() {
        var $customField:JQuery = $('.custom-field-draggable');
        $customField.draggable({ revert:true });
        $customField.draggable( 'option', 'handle', '> div > .move-action' );
        $customField.on('dragstop', (event, ui) => {
            $(event.currentTarget).attr('style','position: relative;');
        } );
    }

    private initializeDroppable($container:JQuery) {
        $container.droppable({ accept: '.custom-field-draggable',
            drop: (event, ui) => {
                //Remove special class for container
                //$(this).removeClass("border").removeClass("over");
                var $fieldDropped = $(ui.draggable);
                //Append to new Container.
                if ($fieldDropped.data('form-type') == $container.data('form-type')) {
                    this.addNewFormItem($fieldDropped, $container);

                } else {
                    Util.alert('The field is not available for this form.')
                }
            },
            over: function(event, elem) {
                //Add special class for container
                $(this).addClass("over");
            }
            ,
            out: function(event, elem) {
                //Remove special class for container
                $(this).removeClass("over");
            }
        });
    }

    private initializeSortable() {
        this.$formFieldsContainer.sortable({
            handle: '.move-action',
            stop: (e, ui) => {
                var $formItemsContainer:JQuery = $(ui.item).parent();
                this.applyReorderPosition($formItemsContainer);
            }
        });
    }

    private initializeDeleteAction() {
        this.$formFieldsContainer.on('click', '.delete-action', (e) => {
            e.preventDefault();
            $('div.listing-data').addClass('loading');

            var $button:JQuery = $(e.currentTarget);
            var $itemContainer:JQuery = $button.parent().parent();
            var fieldId:string = $itemContainer.data('field-id');
            var href:string = this.$deleteUrl.replace(/0/g, fieldId);
            var httpMethod = 'POST';
            var message = $button.data('message');

            if (message == null || message.length == '') {
                message = 'Are you sure you want to delete the item?';
            }

            var confirmDelete = () => {
                AjaxClient.call(httpMethod, href)
                    .done((data, xhr) => {
                        this.loadCustomFields($button.data('form-type'));
                        $itemContainer.remove();
                        $('div.listing-data').removeClass('loading');
                    })
                    .fail((data, xhr) => {
                        Util.alert('Could not delete the item.');
                        $('div.listing-data').removeClass('loading');
                    });
            };

            Util.confirmation({
                message: message,
                success: confirmDelete,
            });

            $('div.listing-data').removeClass('loading');
        });
    }

    private applyReorderPosition($field:JQuery) {
        var $currentContainer:JQuery = this.getCurrentContainer($field.data('form-type'));

        $currentContainer.addClass('loading');

        var data = [];
        _.each($currentContainer.find('.form-item'), (current) => {
            data.push($(current).data('field-id'));
        });

        AjaxClient.post(Routing.generate('app_form_fields_reorder_position'), { fields: data })
            .done((data, xhr) => {
                this.$formFieldsContainer.removeClass('loading');
            });
    }

    private addNewFormItem($customField:JQuery, $container:JQuery) {
        $('div.listing-data').addClass('loading');
        var info = [];
        var customFieldId:string = $customField.data('custom-field-id');
        info.push(this.$municipalityId);
        info.push(customFieldId);
        info.push($customField.data('form-type'));

        $container.addClass('loading');
        $customField.hide();

        $.ajax({
            type: "POST",
            url: Routing.generate('app_form_field_create'),
            data:  { data: info },
            success: (returnValue) => {
                var result = returnValue['result'];
                var $formField = $customField.clone();
                //Remove draggable classes and inline style.
                $formField.removeClass('custom-field-draggable');
                $formField.removeClass('ui-draggable');
                $formField.removeClass('ui-draggable-handle');
                $formField.removeClass('ui-draggable-dragging');
                $formField.removeAttr('style');
                //Add class to work as form item.
                $formField.addClass('form-item');
                //console.log(result['id']);
                $formField.attr('data-field-id', result['id']);
                //Show delete action.
                _.each($formField.find('.delete-action'), (current) => {
                    $(current).removeAttr('style');
                });
                $formField.appendTo($container);

                //Spacer is custom field with ID = 0
                if (parseInt(customFieldId) > 0) {
                    $customField.remove();
                } else {
                    $customField.show();
                }
                $('div.listing-data').removeClass('loading');

                this.initializeAccordionTrigger($formField);
            },
            error: function(request,error) {
                $customField.show();
                Util.alert('Could not add the item.');
                return false;
            }
        });
        $container.removeClass('loading');
    }

    private getCurrentContainer($formType:string) {
        if ($formType == this.$registrationContainer.data('form-type')) {
            return this.$registrationContainer;
        }

        if ($formType == this.$renewalContainer.data('form-type')) {
            return this.$renewalContainer;
        }

        if ($formType == this.$deRegistrationContainer.data('form-type')) {
            return this.$deRegistrationContainer;
        }

        if ($formType == this.$inspectionContainer.data('form-type')) {
            return this.$inspectionContainer;
        }
    }

    private initializeAccordionTrigger($container:JQuery) {
        _.each($container.find('.item-action'), (current) => {
            $(current).off('click').on('click', (e) => {
                e.preventDefault();
                var $parent = $(e.currentTarget).parent().parent().parent();
                if (!$parent.hasClass('active')) {
                    $parent.addClass('active');
                }else {
                    $parent.removeClass('active');
                }
            });
        });
    }
}

export = FormMunicipalityCustomFields;
