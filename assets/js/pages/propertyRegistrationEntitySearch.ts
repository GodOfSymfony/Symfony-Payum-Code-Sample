import $ = require('jquery');
import _ = require('lodash');
import AjaxClient = require('../lib/ajaxClient');
import Util = require('../lib/util');
import eventBus = require('../lib/eventBus');

const ENTER_KEY = 13;

class RegistrationEntitySearch {
    // Define all properties used in this class
    private minQueryLen = 1;
    private lastKeypress = [];
    //Address Search
    private $inputSearchClass: string;
    private $blurSearchClass: string;
    private $itemsContainerClass: string;
    private $searchLoaderClass: string;
    private formName: string;
    private $form: JQuery;
    private organizationId: string;
    private defaultEntityType: string;

    constructor(options) {
        this.$inputSearchClass = options.inputSearch;
        this.$blurSearchClass = options.blurSearch;
        this.$itemsContainerClass = options.itemsContainer;
        this.$searchLoaderClass = options.searchLoader;
        this.formName = options.formName;
        this.$form = $('form[name=' + this.formName + ']');
        this.organizationId = options.organizationId;
        this.defaultEntityType = 'company';

        $('body').on('click', (e) => {
            $(this.$blurSearchClass).hide();
        });

        this.initializeSearchBar();
        this.initializeDivs();
    }

    private bindElements($itemsContainer: JQuery) {
        _.each($itemsContainer.find('.list-result-proper'), (current) => {
            $(current).on('click', (e) => {
                var $item: JQuery = $(e.currentTarget);
                var entityField = $item.data('entity');
                var $entityInput: JQuery = $('#' + entityField);
                var entityId: string = $item.data('id');
                $entityInput.val(entityId);

                var entityName: string = $item.data('fullname');
                $('.input-entity-search[data-entity=' + entityField + ']').val(entityName);
                this.notifyEntitySelected(entityField);
            });
        });

        _.each($itemsContainer.find('.new-entity'), (current) => {
            $(current).on('click', (e) => {
                e.preventDefault();

                var $item: JQuery = $(e.currentTarget);
                var url: string = $item.data('href');
                var entityInput: string = $item.data('entity');
                var searchInputName: string = $item.data('search-input');

                eventBus.trigger('registration:entity:create', {
                    url: url,
                    searchInputName: searchInputName,
                    entityInput: entityInput,
                    entityType: this.defaultEntityType
                });
            });
        });
    }

    private hideBlurSearch($blurSearch: JQuery) {
        if ($blurSearch.hasClass('active')) {
            $blurSearch.removeClass('active');
            $blurSearch.css({height: '0px'});
        }
        $blurSearch.hide();
    }

    private initializeSearchBar() {

        // Bind the container blur area trigger to hide search container when clicked
        $(this.$blurSearchClass).on('click', (e) => {
            if (e.target !== e.currentTarget) {
                return;
            }
            var $blurSearch = $(e.currentTarget);
            //Hide search container.
            this.hideBlurSearch($blurSearch);
        });

        $(this.$inputSearchClass).on('click', (e) => {
            var $inputSearch: JQuery = $(e.currentTarget);

            if ($inputSearch.val().length < this.minQueryLen) {
                var instance = this;
                // Prevent search to trigger on each key press but only when the user stops typing after .5 secs
                setTimeout(() => {
                    instance.requestSearchResults($inputSearch);
                }, 500);
            }
        });

        // Bind search input event
        $(this.$inputSearchClass).on('keyup', (e) => {
            // Just get the pressed key char
            var keyCode = e.key;
            var $inputSearch: JQuery = $(e.currentTarget);

            var $parent: JQuery = $inputSearch.closest('.form-column');
            var $blurSearch: JQuery = $parent.children(this.$blurSearchClass);

            // Trigger search by pressing enter
            if (e.which == ENTER_KEY && $inputSearch.val().length >= this.minQueryLen) {
                this.lastKeypress = [];
                return this.requestSearchResults($inputSearch);
            }

            // Hide search when input has less than N characters
            if ($inputSearch.val().length < this.minQueryLen) {
                this.lastKeypress = [];
                //Hide Blur Search
                this.hideBlurSearch($blurSearch);
            }

            // Make sure to skip control chars on key down when timing it and only trigger search on real chars
            if (keyCode.length != 1 || /[a-zA-Z0-9\t\n .\/<>?;:"'`!@#$%^&*()\[\]{}_+=|\-,\\]/.test(keyCode) === false) {
                return;
            }

            // Only trigger when input size is bigger than N chars
            if ($inputSearch.val().length >= this.minQueryLen) {
                // To prevents the conflict by using the 'this' keyword on sub events/functions
                var instance = this;

                // Record the time of the current pressed key down
                var currentClick = Date.now();

                // Save the time into an array to be used later
                this.lastKeypress.push(currentClick);

                // Prevent search to trigger on each key press but only when the user stops typing after .5 secs
                setTimeout(() => {
                    if (instance.lastKeypress.length > 0 && currentClick === instance.lastKeypress[instance.lastKeypress.length - 1]) {
                        this.lastKeypress = [];
                        // Last check on the input size just in case
                        if ($inputSearch.val().length >= this.minQueryLen) {
                            instance.requestSearchResults($inputSearch);
                        }
                    }
                }, 500);
            }
        });
    }

    private requestSearchResults($inputSearch: JQuery) {

        var href = $inputSearch.data('action');
        var entityField = $inputSearch.data('entity');
        var queryValue = $inputSearch.val();
        var paramName = $inputSearch.data('name');
        var entitySearchName = $inputSearch.attr('id');

        var $parent: JQuery = $inputSearch.closest('.form-column');
        var $blurSearch: JQuery = $parent.children(this.$blurSearchClass);
        var $itemsContainer: JQuery = $blurSearch.find(this.$itemsContainerClass);
        var $searchLoader: JQuery = $blurSearch.find(this.$searchLoaderClass);
        // Clear all results
        $itemsContainer.html('');
        // Show empty container
        if (!$blurSearch.hasClass('active')) {
            $blurSearch.addClass('active');
            $blurSearch.css({height: 'auto'});
        }
        $blurSearch.show();
        // Show loading spinner
        $searchLoader.show();
        // Register Ajax call to server
        AjaxClient.call(
            'GET', href, {
                entityField: entityField,
                entitySearchName: entitySearchName,
                organizationId: this.organizationId,
                [paramName]: queryValue
            }).done((data, xhr) => {
            $searchLoader.hide();
            $itemsContainer.html(data.html);
            $itemsContainer.show();
            this.bindElements($itemsContainer);
        }).fail((data, xhr) => {
            $searchLoader.hide();
            //Hide Blur Search
            this.hideBlurSearch($blurSearch);

            Util.alert('Server Error: Your search could not be performed. Tray again later.');
        });
    }

    private initializeDivs() {
        _.each(this.$form.find(this.$blurSearchClass), (current) => {
            $(current).hide();
        });
    }


    private notifyEntitySelected(entityId: string) {
        var event: any = $.Event('entity:selected');
        event.entityId = entityId;
        this.$form.trigger(event);
    }
}

export = RegistrationEntitySearch;
