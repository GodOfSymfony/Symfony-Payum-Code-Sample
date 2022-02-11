import $ = require('jquery');

class CustomFieldsOptions {
    //Vars to manage list.
    private $addLink: JQuery;
    protected $collectionHolder: JQuery;
    protected $optionHolder: JQuery;
    private $noOptions: JQuery;
    private $prototype: string;

    constructor() {
        //Vars to manage list.
        this.$addLink = $('#new_option');
        this.$collectionHolder = $('#options');
        this.$noOptions = $('#no_options');
        this.$optionHolder = $('#custom-field-options');

        this.initializeEvents();
    }

    private initializeEvents() {
        this.$prototype = this.$collectionHolder.data('prototype');

        this.$collectionHolder
            .data('index', this.$collectionHolder
            .find('.custom-field-option').length);

        this.initializeTypeSelection();
        this.initializeCollectionHolderDeleteAction();

        this.initializeShowOptionsRaw($('#custom_field_form_type').val());

        this.$addLink.on(
            'click',
            {protoForm: this.$prototype},
            (event) => {
                event.preventDefault();

                if (!this.$noOptions.hasClass('hidden')) {
                    this.$noOptions.addClass('hidden');
                }

                var index: number = this.$collectionHolder.data('index');
                var newForm: string = event.data.protoForm.replace(/__name__/g, index.toString());

                this.$collectionHolder.append(newForm);
                this.$collectionHolder.data('index', index + 1);
            });
    }

    private initializeTypeSelection() {
        // $('#custom_field_form_type').on('change', event => {
        //     this.initializeShowOptionsRaw(event.target.value);
        // });
    }

    private initializeShowOptionsRaw(value: string) {
        switch (value) {
            case 'dropdown':
            case 'checkbox':
            case 'radiobutton':
                this.$optionHolder.show();
                break;
            default:
                this.$optionHolder.hide();
                break;
        }
    }

    private initializeCollectionHolderDeleteAction() {
        this.$collectionHolder.on('click', '.delete-action', (e) => {
            e.preventDefault();
            var $parent = $(e.currentTarget).closest('.custom-field-option');
            $parent.remove();
            if (this.$collectionHolder.find('.custom-field-option').length == 0) {
                this.$noOptions.removeClass('hidden');
            }
        });
    }
}

export default CustomFieldsOptions;
