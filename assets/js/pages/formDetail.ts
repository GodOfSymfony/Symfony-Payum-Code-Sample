import $ = require('jquery');
import DisputeModal = require('../modals/disputeModal');

class FormDetail {
    private $container:JQuery;
    private $disputeModal:DisputeModal;
    private formId:number;
    private readOnly:boolean;

    constructor(options) {
        this.$container = options.container;
        this.$disputeModal = new DisputeModal();
        this.formId = options.formId;
        this.readOnly = options.readOnly;

        this.initializeDispute();
        this.initializeEvents();
        this.processReadOnly();
    }

    private initializeDispute() {
        let disputeElement = this.$container.find('.dispute-button');

        disputeElement.attr('href', Routing.generate('app_support_ticket_registration_dispute_form', { id: this.formId }));
    }

    private initializeEvents() {
        this.$container.find('.dispute-button').on('click', (e) => {
            e.preventDefault();

            this.$disputeModal.open($(e.currentTarget).attr('href'));
        });
    }

    private processReadOnly()
    {
        if (this.readOnly) {
            this.$container.find('*').prop('disabled', true);
        }
    }
}

export = FormDetail;
