import $ = require('jquery');
import AjaxClient = require('../lib/ajaxClient');
import Util = require('../lib/util');

class ReviewList {
    private $container:JQuery;
    private $modalContainer:JQuery;

    private $containerAdmin:JQuery;
    private $containerNonAdmin:JQuery;
    private $switchItem:string;
    private $reviewsLbl:string;
    private $selectAll:string;
    private $massiveApprove:string;
    private $massiveDeny:string;

    constructor(options) {
        this.$modalContainer = $('#view-form-modal');
        this.$container = $(options.container);
        this.$containerAdmin = $(options.itemsAdmin);
        this.$containerNonAdmin = $(options.itemsNonAdmin);
        this.$switchItem = options.switchItem;
        this.$reviewsLbl = options.reviewsLbl;
        this.$selectAll = options.selectAll;
        this.$massiveApprove = options.approveBtn;
        this.$massiveDeny = options.denyBtn;
        this.initializeEvents();
        this.initializeAccordions();
        this.initializeViewEvents();
        this.initializeMassiveActions();
    }

    private initializeEvents() {

        $(this.$switchItem).on('click', (e) => {
            var $switch = $(e.currentTarget);
            var $reviewsLabel = $(this.$reviewsLbl);

            if( $switch.prop('checked') ) {
                this.$containerAdmin.show();
                this.$containerNonAdmin.hide();
                $reviewsLabel.text('Admin Items for Review');

                var $selectAll = $(this.$selectAll);
                if ($selectAll.hasClass('non-admin')) {
                    $selectAll.removeClass('non-admin');
                }
                if (!$selectAll.hasClass('admin')) {
                    $selectAll.addClass('admin');
                }
            } else {
                this.$containerAdmin.hide();
                this.$containerNonAdmin.show();
                $reviewsLabel.text('Non-Admin Items for Review');

                var $selectAll = $(this.$selectAll);

                if ($selectAll.hasClass('admin')) {
                    $selectAll.removeClass('admin');
                }
                if (!$selectAll.hasClass('non-admin')) {
                    $selectAll.addClass('non-admin');
                }
            }
        });
    }

    private initializeAccordions() {
        this.$container.on('click', '.collapser-button', (e) => {
            e.preventDefault();
            var $btn = $(e.currentTarget);
            var $accordion = $btn.parent();

            if ($accordion.hasClass('active')) {
                $accordion.removeClass('active');
            } else {
                $accordion.addClass('active');
            }
        });
    }

    private initializeViewEvents() {
        this.$container.on('click', '.review-detail', (e) => {
            e.preventDefault();
            var $btn = $(e.currentTarget);
            var $sibling = $btn.siblings('.deny');
            var locationHref = $sibling.attr('href');

            Util.showAjaxFormModal(
                this.$modalContainer,
                $btn.attr('href'),
                '.accept-button',
                () => {
                    $('#view-form-modal').on('click', '.deny-button', (e) => {
                        e.preventDefault();
                        if(locationHref) {
                            window.location.href = locationHref;
                        }
                    });
                },
                () => {},
                (r) => {

                        if (r.msgError) {
                            Util.alert(r.msgError);
                        } else {
                            window.location.href = r.detailUrl;
                        }

                },
                () => {},
            );
        });
    }

    private initializeMassiveActions() {

        $(this.$massiveDeny).on('click', (e) => {
            e.preventDefault();

            var $selectAll = $(this.$selectAll);
            var isAdmin:boolean = false;
            if ($selectAll.hasClass('admin')) {
                isAdmin = true;
            }

            if (isAdmin) {
                var $reviews = $('.select-review.admin:checked');
            } else {
                var $reviews = $('.select-review.non-admin:checked');
            }

            if ($reviews.length == 0) {
                Util.alert('You should select at least one Review');
            } else {
                var $reviewsContainer = $('#reviews_container');
                $reviewsContainer.addClass('loading');

                var $selectedReview = [];
                $reviews.each((idx, value) => {
                    var $item = $($reviews[idx]);
                    var reviewType = $item.data('review-type');

                    $selectedReview.push({
                        reviewType: reviewType,
                        id:  $(value).val()
                    });
                });

                AjaxClient.get(Routing.generate('app_review_massive_deny'), { reviews: $selectedReview })
                    .done((data, xhr) => {
                        window.location.href = data.detailUrl;
                    });
            }

        });

        $(this.$massiveApprove).on('click', (e) => {
            e.preventDefault();

            var $selectAll = $(this.$selectAll);
            var isAdmin:boolean = false;
            if ($selectAll.hasClass('admin')) {
                isAdmin = true;
            }

            if (isAdmin) {
                var $reviews = $('.select-review.admin:checked');
            } else {
                var $reviews = $('.select-review.non-admin:checked');
            }

            if ($reviews.length == 0) {
                Util.alert('You should select at least one Review');
            } else {
                var $reviewsContainer = $('#reviews_container');
                $reviewsContainer.addClass('loading');

                var $selectedReview = [];
                $reviews.each((idx, value) => {
                    var $item = $($reviews[idx]);
                    var reviewType = $item.data('review-type');

                    $selectedReview.push({
                        reviewType: reviewType,
                        id:  $(value).val()
                    });
                });

                AjaxClient.get(Routing.generate('app_review_massive_approve'), { reviews: $selectedReview })
                    .done((data, xhr) => {
                        window.location.href = data.detailUrl;
                    });
            }

        });

        $(this.$selectAll).on('click', (e) => {
            e.preventDefault();
            var $btn = $(e.currentTarget);
            var isAdmin:boolean = false;
            if ($btn.hasClass('admin')) {
                isAdmin = true;
            }

            var $selectField = $('#input_select_all');
            if ( $selectField.prop('checked') ) {
                $selectField.prop('checked', false);
                if (isAdmin) {
                    $("input.select-review.admin[type=checkbox]").prop('checked', false);
                } else {
                    $("input.select-review.non-admin[type=checkbox]").prop('checked', false);
                }
            } else {
                $selectField.prop('checked', true);
                if (isAdmin) {
                    $("input.select-review.admin[type=checkbox]").prop('checked', true);
                } else {
                    $("input.select-review.non-admin[type=checkbox]").prop('checked', true);
                }
            }
        });
    }
}

export = ReviewList;
