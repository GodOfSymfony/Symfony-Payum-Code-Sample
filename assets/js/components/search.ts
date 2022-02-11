import $ = require('jquery');
import AjaxClient = require('../lib/ajaxClient');
import Util = require('../lib/util');

const ENTER_KEY = 13;

class SearchBar {
    // Define all properties used in this class
    private $btnTrigger:JQuery;
    private $InputFinder:JQuery;
    private $ContainerSearch:JQuery;
    private $ResultContainer: JQuery;
    private $ContainerSearchItems:JQuery;
    private $ContainerSearchTabs:JQuery;
    private lastKeypress = [];
    private $SearchItem: JQuery;
    private $Loader: JQuery;
    private minQueryLen = 3;
    private $MenuContainer = $('.page-sidebar');


    constructor() {
        // Constructor to be triggered on class creation
        this.bindElements();
        this.initializeSearchBar();
        this.initializeTabs();
    }

    private bindElements()
    {
        // Make sure to bind all elements to the class properties
        this.$InputFinder = $('.input-search');
        this.$ContainerSearch = $('.container-blur-search');
        this.$ContainerSearchItems = $('.container-search-items');
        this.$ResultContainer = $('.result-container');
        this.$btnTrigger = $('.btn-change-tab');
        this.$SearchItem = $('.search-item-finder');
        this.$ContainerSearchTabs = $('div.container-search-items > ul > li');
        this.$Loader = $('.search-item-finder-searching');

        // Bind search result item onclick event
        this.$SearchItem.on('click', (e) => {
            var locationHref = $(e.currentTarget).data('href');
            if (locationHref) {
                window.location.href = locationHref;
            }
        });
    }

    private showContainerSearch(){
        if (this.$ContainerSearch.hasClass('active') == false) {
            this.$ContainerSearch.addClass('active');
            this.$ContainerSearch.css({height: $('.page-body').height()});
        }
    }

    private hideContainerSearch() {
        if (this.$ContainerSearch.hasClass('active') == true) {
            this.$ContainerSearch.removeClass('active');
            this.$ContainerSearch.css({height: '0px'});
        }
    }

    private initializeSearchBar() {

        // Bind the container blur area trigger to hide search container when clicked
        this.$ContainerSearch.on('click', (e) => {
            //Do nothing if blur area was not directly clicked
            if (e.target !== e.currentTarget) { return; }
            this.hideContainerSearch();
        });

        // Bind search input event
        this.$InputFinder.on('keyup', (e) => {

            // Just get the pressed key char
            var keyCode =  e.key;

            // Trigger search by pressing enter
            if (e.which == ENTER_KEY && this.$InputFinder.val().length >= this.minQueryLen) {
                this.lastKeypress = [];
                return this.requestSearchResults();
            }

            // Hide search when input has less than N characters
            if(this.$InputFinder.val().length < this.minQueryLen){
                this.lastKeypress = [];
                this.hideContainerSearch();
            }

            // Make sure to skip control chars on key down when timing it and only trigger search on real chars
            if (keyCode.length != 1 || /[a-zA-Z0-9\t\n .\/<>?;:"'`!@#$%^&*()\[\]{}_+=|\-,\\]/.test(keyCode) === false) {
                return;
            }

            // Only trigger when input size is bigger than N chars
            if (this.$InputFinder.val().length >= this.minQueryLen) {
                //turn off menu active state
                this.$MenuContainer.removeClass('active');

                // To prevents the conflict by using the 'this' keyword on sub events/functions
                var instance = this;

                // Record the time of the current pressed key down
                var currentClick = Date.now();

                // Save the time into an array to be used later
                this.lastKeypress.push(currentClick);

                // Prevent search to trigger on each key press but only when the user stops typing after 2 secs
                setTimeout( () => {
                    if (instance.lastKeypress.length > 0 && currentClick === instance.lastKeypress[instance.lastKeypress.length - 1]) {
                        this.lastKeypress = [];
                        // Last check on the input size just in case
                        if(this.$InputFinder.val().length >= this.minQueryLen) {
                            instance.requestSearchResults();
                        }
                    }
                }, 500);
            }
        });
    }

    private requestSearchResults() {

        var href = this.$InputFinder.data('action');
        var queryValue = this.$InputFinder.val();
        var paramName = this.$InputFinder.prop('name');

        // Clear all results
        this.$ContainerSearchItems.html('');
        // Show empty container
        this.showContainerSearch();
        // Show loading spinner
        this.$Loader.show();
        // Register Ajax call to server
        AjaxClient.call('GET', href, {[paramName]: queryValue})
            .done((data, xhr) => {
                this.$Loader.hide();
                this.$ContainerSearchItems.html(data.html);
                this.bindElements();
                this.initializeTabs();
            })
            .fail((data, xhr) => {
                this.$Loader.hide();
                this.hideContainerSearch();
                Util.alert('Server Error: Your search could not be performed.');
            });
    }

    private initializeTabs() {

        // To prevents the conflict by using the 'this' keyword on sub events/functions
        var instance = this;

        // Hide all tabs
        this.$ResultContainer.hide();

        // Show only active tab on click
        this.$btnTrigger.on('click', (e) => {
            var newActiveTab = $(e.currentTarget).data('tab');
            if(newActiveTab) {
                // Remove active from tab links
                instance.$btnTrigger.removeClass('active');
                // Remove active from all tabs
                instance.$ContainerSearchTabs.removeClass('active');
                // Hide all results containers
                instance.$ResultContainer.hide();
                // Show only clicked container
                instance.$ContainerSearchItems.find('.' + newActiveTab).show();
                // Activate only clicked tab
                $(e.currentTarget).parent().addClass('active');
            }
        });

        var firstElem;
        // Make sure to focus on the tab with results after the search is returned
        this.$ContainerSearchTabs.each((index, elem) => {
            if (!firstElem) { firstElem = elem; }
            if ( $(elem).data('count') !== '' && $(elem).data('count') > 0) {
                $(elem).find('a').click();
                firstElem = null;
                return false;
            }
        });

        // Focus on 1st tab in case nothing was focused
        if (firstElem) { $(firstElem).find('a').click(); }
    }
}

export = SearchBar;
