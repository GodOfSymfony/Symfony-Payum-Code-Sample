import $ = require('jquery');

class Menu {
    private $MenuContainer:JQuery;
    private $btnTrigger:JQuery;
    /**/
    private $mainContainer:JQuery;
    private $btnMinimalMenu:JQuery;

    constructor() {
        this.$MenuContainer = $('.page-sidebar');
        this.$btnTrigger = $('.OpenMenu');
        /**/
        this.$mainContainer = $('body');
        this.$btnMinimalMenu = $('.open-menu-minimal');

        this.initializeAccordion();
        this.initializeMinimalMenu();
    }
    private initializeAccordion() {
        this.$btnTrigger.on('click', (e) => {
            e.preventDefault();

            if (this.$MenuContainer.hasClass('active')==false) {
                this.$MenuContainer.addClass('active');
            }else {
                this.$MenuContainer.removeClass('active');
            }
        });
    }
    private initializeMinimalMenu() {
        this.$btnMinimalMenu.on('click', (e) => {
            e.preventDefault();

            if (this.$mainContainer.hasClass('min-active') == false) {
                this.$mainContainer.addClass('min-active');

            } else {
                this.$mainContainer.removeClass('min-active');
            }
        });
    }

}

export = Menu;
