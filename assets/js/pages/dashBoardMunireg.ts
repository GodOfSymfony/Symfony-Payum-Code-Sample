import $ = require('jquery');

class DashBoardMunireg {
    private $containerAdmin:string;
    private $containerNonAdmin:string;
    private $switchItem:string;
    private $reviewsLbl:string;

    constructor(options) {
        this.$containerAdmin = options.itemsAdmin;
        this.$containerNonAdmin = options.itemsNonAdmin;
        this.$switchItem = options.switchItem;
        this.$reviewsLbl = options.reviewsLbl;

        this.initializeEvents();
    }

    private initializeEvents() {

        $(this.$switchItem).on('click', (e) => {
            var $switch = $(e.currentTarget);
            var $contAdmin = $(this.$containerAdmin);
            var $contNonAdmin = $(this.$containerNonAdmin);
            var $reviewsLabel = $(this.$reviewsLbl);

            if( $switch.prop('checked') ) {
                $contAdmin.show();
                $contNonAdmin.hide();
                $reviewsLabel.text('Admin Items for Review');
            } else {
                $contAdmin.hide();
                $contNonAdmin.show();
                $reviewsLabel.text('Non-Admin Items for Review');
            }
        });
    }
}

export = DashBoardMunireg;