import $ = require('jquery');
import Util = require('../lib/util');
import DisputeModal = require('../modals/disputeModal');

class InvoiceDetail {
    private $container:JQuery;
    private $disputeModal:DisputeModal;
    private invoiceId:number;

    constructor(options) {
        this.$container = $('#invoice-detail');
        this.$disputeModal = new DisputeModal();
        this.invoiceId = options.invoiceId;

        this.initializeDispute();
        this.initializeEvents();
    }

    private initializeDispute() {
        let disputeElement = this.$container.find('.dispute-button');

        disputeElement.attr('href', Routing.generate('app_support_ticket_invoice_dispute_form', { id: this.invoiceId }));
    }

    private initializeEvents() {
        this.$container.find('.dispute-button').on('click', (e) => {
            e.preventDefault();

            this.$disputeModal.open($(e.currentTarget).attr('href'));
        });

        this.$container.on('click', '.btn-how-pay-check', (e) => {
            e.preventDefault();
            Util.alert('Checks should be made out to Munireg LLC and mailed to Munireg LLC 2940 Noble Rd, Suite 202 Cleveland Heights, OH 44118. Invoice number must be written on the memo line to ensure prompt processing. Please note that registrations are not considered complete until payment has been received and processed.');
        });
    }
}

export = InvoiceDetail;
