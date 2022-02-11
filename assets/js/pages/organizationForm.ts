import $ = require('jquery');
import Util = require('../lib/util');

class OrganizationForm {
    private $container:JQuery;
    private $fieldContainer:JQuery;
    private $domains:string;
    private $domainsArr:Array<string>;

    constructor(options) {
        this.$container = $('#domains');
        this.$fieldContainer = $('#organization_form_domains');
        this.$domains = options.domains;
        this.initializeValues();
        this.initializeDeleteAction();
    }

    private initializeValues() {
        this.$domainsArr = this.$domains.split(';');
    }
    private initializeDeleteAction() {
        _.each(this.$container.find('.domain'), (current) => {
            $(current).on('click', '.delete' , (e) => {
                e.preventDefault();

                var $button = $(e.currentTarget);
                var $parent = $(e.currentTarget).parent();

                var $domainId:string = $button.data('domain-id');

                var doDelete = () => {
                    this.updateDomains($domainId);
                    $parent.remove();
                };

                Util.confirmation({
                    message: 'Are you sure you want to delete the item?',
                    warning: '',
                    success: doDelete
                });
            });
        });
    }

    public updateDomains(domain:string) {
        var $index = jQuery.inArray(domain, this.$domainsArr);
        if ($index > -1) {
            this.$domainsArr.splice($index,1);
            this.$fieldContainer.val(this.$domainsArr.toString());
        }
    }
}

export = OrganizationForm;
