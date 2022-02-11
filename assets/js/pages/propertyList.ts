import $ = require('jquery');
import AjaxClient = require('../lib/ajaxClient');
import Util = require('../lib/util');
import DetailModal = require('../modals/detailModal');

class PropertyList {
    private $container:JQuery;
    private $listing:JQuery;
    private detailModal:DetailModal;
    private $InputFinderDate:JQuery;
    private $InputFinder:JQuery;

    constructor() {
        this.$container = $('#property-index');
        this.$listing = this.$container.find('.listing');
        this.detailModal = new DetailModal();
        this.$InputFinderDate = $('#input-find-date');
        this.$InputFinder = $('#input-find');

        this.initializePropertyEvents();
        this.initializeFind();
    }
    private initializeFind() {

        this.$InputFinderDate.on('change keyup paste', (e) => {
            var counter = this.$InputFinderDate.val().length;
            if(counter >= 3) {
                $('#result-find-propert-date').addClass('active');
            }else if (counter < 3){
                $('#result-find-propert-date').removeClass('active');
            }
        });
        this.$InputFinder.on('change keyup paste', (e) => {
            var counter = this.$InputFinder.val().length;
            if(counter >= 3) {
                $('#result-find-propert').addClass('active');
            }else if (counter < 3){
                $('#result-find-propert').removeClass('active');
            }
        });
    }

    private initializePropertyEvents() {
        this.$container.find('.see-property-details').on('click', (e) => {
            e.preventDefault();

            let $element = $(e.currentTarget);
            let $propertyDetails = $element.closest('tr').find('.property-details');

            if ($propertyDetails.html() !== '') {
                $propertyDetails.html('');
                $element.html('<span></span>See More Details');

                return;
            }

            this.$listing.addClass('loading');
            AjaxClient.get($element.attr('href'))
                .done((data, xhr) => {
                    $propertyDetails.html(data.html);

                    Util.initializePlugins(this.$container);
                    $element.html('<span class="hide"></span> Hide');

                    this.initializeOrganizationEvents();
                    this.initializeEntityEvents();

                    this.$listing.removeClass('loading');
                });
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

export = PropertyList;
