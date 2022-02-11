import $ = require('jquery');
import Util = require('../lib/util');

class MunicipalityForm {
    private domainsContainer:JQuery;
    private $zipcodesContainer:JQuery;
    private $fieldDomainContainer:JQuery;
    private $fieldZipcodesContainer:JQuery;
    private $domains:string;
    private $domainsArr:Array<string>;
    private $zipcodes:string;
    private $zipcodesArr:Array<string>;

    constructor(options) {
        this.domainsContainer = $('#domains');
        this.$fieldDomainContainer = $('#municipality_form_domains');
        this.$zipcodesContainer = $('#zipcodes');
        this.$fieldZipcodesContainer = $('#municipality_form_zipcodes');
        this.$domains = options.domains;
        this.$zipcodes = options.zipcodes;
        this.initializeValues();
        this.initializeDeleteAction();
    }

    private initializeValues() {
        this.$domainsArr = this.$domains.split(';');
        this.$zipcodesArr = this.$zipcodes.split(';');
    }

    private initializeDeleteAction() {
        _.each(this.domainsContainer.find('.domain'), (current) => {
            $(current).on('click', '.delete' , (e) => {
                e.preventDefault();

                var $button = $(e.currentTarget);
                var $parent = $(e.currentTarget).parent();

                var $domainId:string = $button.data('domain-id');

                var doDeleteDomain = () => {
                    this.updateDomains($domainId);
                    $parent.remove();
                };

                Util.confirmation({
                    message: 'Are you sure you want to delete the domain?',
                    warning: '',
                    success: doDeleteDomain
                });
            });
        });

        _.each(this.$zipcodesContainer.find('.zipcode'), (current) => {
            $(current).on('click', '.delete' , (e) => {
                e.preventDefault();

                var $button = $(e.currentTarget);
                var $parent = $(e.currentTarget).parent();

                var $zipcodeId:string = $button.data('zipcode-id').toString();

                var doDeleteZipcode = () => {
                    this.updateZipcodes($zipcodeId);
                    $parent.remove();
                };

                Util.confirmation({
                    message: 'Are you sure you want to delete the zip code?',
                    warning: '',
                    success: doDeleteZipcode
                });
            });
        });
    }

    public updateDomains(domain:string) {
        var $index = jQuery.inArray(domain, this.$domainsArr);
        if ($index > -1) {
            this.$domainsArr.splice($index,1);
            this.$fieldDomainContainer.val(this.$domainsArr.toString());
        }
    }

    public updateZipcodes(zipcode:string) {
        var $index = jQuery.inArray(zipcode, this.$zipcodesArr);
        if ($index > -1) {
            this.$zipcodesArr.splice($index,1);
            this.$fieldZipcodesContainer.val(this.$zipcodesArr.toString());
        }
    }
}

export = MunicipalityForm;
