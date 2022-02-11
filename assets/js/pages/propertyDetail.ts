import $ = require('jquery');
import DisputeModal = require('../modals/disputeModal');
import DetailModal = require('../modals/detailModal');

class PropertyDetail {
    private $container:JQuery;
    private $disputeModal:DisputeModal;
    private detailModal:DetailModal;
    private propertyId:number;

    constructor(options) {
        this.$container = $('#property-detail');
        this.$disputeModal = new DisputeModal();
        this.propertyId = options.propertyId;
        this.detailModal = new DetailModal();

        this.initializeDispute();
        this.initializeEvents();
        this.initializeOrganizationEvents();
        this.initializeEntityEvents();
    }

    private initializeDispute() {
        let disputeElement = this.$container.find('.dispute-button');

        disputeElement.attr('href', Routing.generate('app_support_ticket_property_dispute_form', { id: this.propertyId }));
    }

    private initializeEvents() {
        this.$container.find('.dispute-button').on('click', (e) => {
            e.preventDefault();

            this.$disputeModal.open($(e.currentTarget).attr('href'));
        });
    }

    private initializeOrganizationEvents() {
        this.$container.find('.see-organization-details').on('click', (e) => {
            e.preventDefault();

            this.detailModal.open($(e.currentTarget).attr('href'));
        });
    }

    private initializeEntityEvents() {
        this.$container.find('.see-entity-details').on('click', (e) => {
            e.preventDefault();

            this.detailModal.open($(e.currentTarget).attr('href'));
        });
    }
}

export = PropertyDetail;
