import $ = require('jquery');
import _ = require('lodash');
import AjaxClient = require('../lib/ajaxClient');
import Util = require('../lib/util');

const ENTER_KEY = 13;

class PropertySearch {
    // Define all properties used in this class
    private minQueryLen = 3;
    private lastKeypress = [];
    private $MenuContainer = $('.page-sidebar');
    //Address Search
    private $inputSearch:JQuery;
    private $blurSearch:JQuery;
    private $itemsContainer:JQuery;
    private $itemElement: JQuery;
    private $searchLoader: JQuery;
    private $form: JQuery;

    constructor(options) {
        this.$inputSearch = $(options.inputSearch);
        this.$blurSearch = $(options.blurSearch);
        this.$itemsContainer = $(options.itemsContainer);
        this.$itemElement = $(options.itemElement);
        this.$searchLoader = $(options.searchLoader);
        this.$form = $(options.formElement);
        if(options.minQueryLength) {
            this.minQueryLen = options.minQueryLength;
        }

        $('body').on('click', (e) => {
            this.$blurSearch.hide();
        });

        this.bindElements();
        this.initializeSearchBar();
        this.initializeDivs();
    }

    private bindElements()
    {
        if (this.$itemsContainer.hasClass('address-container-search-items')) {
            _.each(this.$itemsContainer.find('.list-result-proper'), (current) => {
                $(current).on('click', (e) => {
                    var locationHref = $(e.currentTarget).data('href');
                    if(locationHref){
                        window.location.href = locationHref;
                    }
                });
            });
        }

        this.bindFormElements();
    }

    private bindFormElements()
    {
        if (this.$itemsContainer.hasClass('zipcode-container-search-items')) {
            _.each(this.$itemsContainer.find('.new-property'), (current) => {
                $(current).on('click', (e) => {
                    e.preventDefault();

                    var $item = $(e.currentTarget);
                    var stateName = $item.data('state');
                    var municipality = $item.data('municipality-id');
                    var zipcode = $item.data('zipcode');

                    var event: any = $.Event("municipality:selected");
                    event.stateName = stateName;
                    event.municipality = municipality;
                    event.zipcode = zipcode;
                    this.$form.trigger(event);

                    var $url = [];
                    $url.push('property_form[municipality]' + '=' + encodeURIComponent(municipality));
                    $url.push('property_form[state]' + '=' + encodeURIComponent(stateName));
                    $url.push('property_form[zipCode]' + '=' + encodeURIComponent(zipcode));

                    var historyUrl = this.$form.data('action');
                    if (historyUrl.indexOf('?') == -1) {
                        historyUrl += '?' + $url.join('&');
                    } else {
                        historyUrl += '&' + $url.join('&');
                    }
                    Util.historyPush(historyUrl);
                });
            });
        }
    }


    private showContainerSearch(){
        if(!this.$blurSearch.hasClass('active')) {
            this.$blurSearch.addClass('active');
        }
        this.$blurSearch.show();
    }

    private hideContainerSearch() {
        if(this.$blurSearch.hasClass('active')) {
            this.$blurSearch.removeClass('active');
        }
        this.$blurSearch.hide();
    }

    private initializeSearchBar() {

        // Bind the container blur area trigger to hide search container when clicked
        this.$blurSearch.on('click', (e) => {
            //Do nothing if blur area was not directly clicked
            if(e.target !== e.currentTarget) return;
            this.hideContainerSearch();
        });

        // To prevents the conflict by using the 'this' keyword on sub events/functions
        var instance = this;

        // Bind search input event
        instance.$inputSearch.on('keyup', (e) => {

            // Just get the pressed key char
            var keyCode =  e.key;

            // Trigger search by pressing enter
            if(e.which == ENTER_KEY && instance.$inputSearch.val().length >= instance.minQueryLen)
            {
                instance.lastKeypress = [];
                return instance.requestSearchResults();
            }

            // Hide search when input has less than N characters
            if(instance.$inputSearch.val().length < instance.minQueryLen){
                instance.lastKeypress = [];
                instance.hideContainerSearch();
            }

            // Make sure to skip control chars on key down when timing it and only trigger search on real chars
            if(keyCode.length != 1 || /[a-zA-Z0-9\t\n .\/<>?;:"'`!@#$%^&*()\[\]{}_+=|\-,\\]/.test(keyCode) === false){
                return;
            }


            // Only trigger when input size is bigger than N chars
            if(instance.$inputSearch.val().length >= instance.minQueryLen)
            {
                //turn off menu active state
                instance.$MenuContainer.removeClass('active');

                // Record the time of the current pressed key down
                var currentClick = Date.now();

                // Save the time into an array to be used later
                instance.lastKeypress.push(currentClick);

                // Prevent search to trigger on each key press but only when the user stops typing after 1 sec
                setTimeout( () => {
                    if (instance.lastKeypress.length > 0 && currentClick === instance.lastKeypress[instance.lastKeypress.length-1]) {
                        instance.lastKeypress = [];
                        // Last check on the input size just in case
                        if(instance.$inputSearch.val().length >= instance.minQueryLen) {
                            instance.requestSearchResults();
                        }
                    }
                }, 1000)
            }
        });
    }

    private requestSearchResults(){

        var href = this.$inputSearch.data('action');
        var formType = this.$inputSearch.data('form-type');
        var queryValue = this.$inputSearch.val();
        var paramName = this.$inputSearch.prop('name');

        // Clear all results
        this.$itemsContainer.html("");
        // Show empty container
        this.showContainerSearch();
        // Show loading spinner
        this.$searchLoader.show();
        // Register Ajax call to server
        AjaxClient.call('GET', href,{ formType: formType, [paramName]: queryValue})
            .done((data, xhr) => {
                this.$searchLoader.hide();
                this.$itemsContainer.html(data.html);
                this.bindElements();
            })
            .fail((data, xhr) => {
                this.$searchLoader.hide();
                this.hideContainerSearch();
                Util.alert('Server Error: Your search could not be performed.');
            });
    }

    private initializeDivs() {
        this.$blurSearch.hide();
        //this.$form.hide();
    }
}

export = PropertySearch;
