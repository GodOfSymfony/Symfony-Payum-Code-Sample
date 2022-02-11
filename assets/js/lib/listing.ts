import $ = require('../vendor/jquery-2.1.4');
import _ = require('lodash');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');

declare type Callback = () => void;

class Listing {
    private static instances: Object[];
    protected $container: JQuery;
    private readonly refreshCallback: Callback;

    constructor($container: JQuery, refreshCallback?: Callback) {
        this.$container = $container;
        this.refreshCallback = refreshCallback;

        $container.data('listing', this);

        if (!Listing.instances) {
            Listing.instances = [];
        }
        Listing.instances.push($container);

        this.initializePaginator();
        this.initializeExports();
        this.initializeSearch();
        this.initializeSorting();
        if ($('.sorting-header select').find('option').length > 0) {
            this.initializeSortingField();
        } else {
            $('.sorting-header select').hide();
        }
        this.initializeRefreshOnAction();
        this.initializeDeleteAction();
        this.initializeConfirmationAction();
        this.initializeFixedTable();
        this.initializeRowAction();
    }

    private initializePaginator() {
        this.$container.on('click', '.pager .pager-first', (e) => {
            e.preventDefault();
            this.gotoPage(1);
        });

        this.$container.on('click', '.pager .pager-previous', (e) => {
            e.preventDefault();
            this.gotoPage(parseInt(this.$container.find('.page-number').val(), 10) - 1);
        });

        this.$container.on('click', '.pager .pager-last', (e) => {
            e.preventDefault();
            var pageCount = this.$container.find('.pager .page-count').val();
            this.gotoPage(pageCount);
        });

        this.$container.on('click', '.pager .pager-next', (e) => {
            e.preventDefault();
            this.gotoPage(parseInt(this.$container.find('.page-number').val(), 10) + 1);
        });

        this.$container.on('click', '.pager .go-to-page', (e) => {
            e.preventDefault();
            var link = e.currentTarget;
            this.gotoPage($(link).data('page'));
        });

        this.$container.on('change', '.pager .items-per-page', (e) => {
            var pagers = $('.page-number');
            // pagers.each(function (element, page) {
            //     page.value = 1;
            // });

            this.refreshListing({updateDirection: false});
        });
    }

    private initializeExports() {
        this.$container.on('click', '.export-excel-button', (e) => {
            e.preventDefault();
            var $export = this.$container.find('.export-input');
            $export.val('excel');
            this.$container.find('form').submit();
            $export.val('');
        });

        this.$container.on('click', '.export-pdf-button', (e) => {
            e.preventDefault();
            var $export = this.$container.find('.export-input');
            $export.val('pdf');
            this.$container.find('form').submit();
            $export.val('');
        });
    }

    private initializeSearch() {
        this.$container.on('click', '.search-box .search-button', (e) => {
            e.preventDefault();

            this.$container.find('.page-number').val('1');
            this.refreshListing({callback: this.refreshCallback});
        });

        this.$container.on('keydown', '.search-box input:text', (e) => {
            this.$container.find('.page-number').val('1');

            if (e.which == 13) {
                e.preventDefault();
                this.refreshListing();
            }
        });

        this.$container.on('click', '.search-box .reset-search-button', (e) => {
            e.preventDefault();

            this.$container.find('.search-box :input').not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');

            this.$container.find('.page-number').val('1');
            this.refreshListing({callback: this.refreshCallback});
        });
    }

    private initializeRefreshOnAction() {
        this.$container.on('click', '.refresh-on-action', (e) => {
            e.preventDefault();
            var $button = $(e.currentTarget);
            var action = $button.attr('href');
            var confirmationMessage = $button.data('confirmation-message');
            var task = () => {
                AjaxClient.post(action)
                    .done((data, xhr) => {
                        this.refreshListing({callback: this.refreshCallback});
                    });
            };

            if (confirmationMessage) {
                Util.confirmation({
                    message: confirmationMessage,
                    success: function () {
                        task();
                    }
                });
            } else {
                task();
            }
        });
    }

    private refreshSortingState() {
        var sortingFieldName = this.$container.find('.sorting-fieldname').val();
        var sortingOrder = this.$container.find('.sorting-order').val();

        this.$container.find('.sorting-header').each(function (i, header) {
            var $header = $(header);
            if ($('a', $header).data('fieldname') == sortingFieldName) {
                $('i', $header).addClass(sortingOrder.toLowerCase());
            }
        });
    }

    private initializeSorting() {
        this.refreshSortingState();

        this.$container.on('click', '.sorting-header a', (e) => {
            e.preventDefault();

            this.$container.find('.page-number').val('1');
            var $link = $(e.currentTarget);
            var $sortingFieldname = this.$container.find('.sorting-fieldname');
            var $sortingOrder = this.$container.find('.sorting-order');

            if ($sortingFieldname.val() == $link.data('fieldname')) {

                if ($sortingOrder.val().toUpperCase() == 'ASC') {
                    $sortingOrder.val('DESC');
                } else {
                    $sortingOrder.val('ASC');
                }
            } else {
                $sortingOrder.val('ASC');
            }

            $sortingFieldname.val($link.data('fieldname'));

            this.refreshListing({callback: this.refreshCallback});
        });
    }

    private initializeSortingField() {
        this.refreshSortingState();

        this.$container.on('change', '.sorting-header select', (e) => {
            e.preventDefault();

            this.$container.find('.page-number').val('1');
            var $select = $(e.currentTarget);
            var fieldName = $select.find(':selected').val();

            var $sortingFieldname = this.$container.find('.sorting-fieldname');
            var $sortingOrder = this.$container.find('.sorting-order');

            if ($sortingFieldname.val() == fieldName) {

                if ($sortingOrder.val().toUpperCase() == 'ASC') {
                    $sortingOrder.val('DESC');
                } else {
                    $sortingOrder.val('ASC');
                }
            } else {
                $sortingOrder.val('ASC');
            }

            let aField = this.$container.find('sorting-header a');
            aField.data('fieldname', fieldName);

            $sortingFieldname.val(fieldName);

            this.refreshListing({callback: this.refreshCallback});
        });
    }

    private initializeDeleteAction() {
        this.$container.on('click', '.delete-action', (e) => {
            e.preventDefault();

            var $button = $(e.currentTarget);
            var href = $button.attr('href');
            var httpMethod = $button.data('http-method');
            var message = $button.data('message');
            var warning = $button.data('warning');
            var deleteError = $button.data('delete-error');
            var disableOnError = $button.data('disable-on-error');
            var disableAction = $button.data('disable-action');

            if (httpMethod == null || httpMethod.length == '') {
                httpMethod = 'POST';
            }

            if (message == null || message.length == '') {
                message = 'Are you sure you want to delete the item?';
            }
            if (deleteError == null || deleteError.length == '') {
                if (disableOnError) {
                    deleteError = 'Could not delete the item, do you want to disable it?';
                } else {
                    deleteError = 'Could not delete the item, please check for existing dependencies';
                }
            }

            var doDisable = () => {
                AjaxClient.call(httpMethod, disableAction)
                    .done((data, jqXHR) => {
                        this.refreshListing();
                    });
            };

            var doDelete = () => {
                this.$container.addClass('loading');

                AjaxClient.call(httpMethod, href)
                    .done((data, xhr) => {
                        this.$container.removeClass('loading');

                        // Check if it's the last item of the page
                        var itemCount = this.$container.find('table tbody tr').length;
                        var pageNumber = this.$container.find('.page-number').val();
                        if (itemCount == 1 && pageNumber > 1) {
                            this.gotoPage(pageNumber - 1);
                        } else {
                            this.refreshListing();
                        }
                    })
                    .fail((data, xhr) => {
                        this.$container.removeClass('loading');

                        if (disableOnError) {
                            Util.confirmation({
                                message: deleteError,
                                success: doDisable
                            });
                        } else {
                            Util.alert(deleteError);
                        }
                    });
            };

            Util.confirmation({
                message: message,
                warning: warning,
                success: doDelete
            });
        });
    }

    private initializeConfirmationAction() {
        this.$container.on('click', '.confirmation-action', (e) => {
            e.preventDefault();
            var $button = $(e.currentTarget);
            var href = $button.attr('href');
            var httpMethod = $button.data('http-method');
            var message = $button.data('message');
            var warning = $button.data('warning');
            var actionError = $button.data('action-error');

            if (httpMethod == null || httpMethod.length == '') {
                httpMethod = 'POST';
            }

            if (message == null || message.length == '') {
                message = 'Are you sure?';
            }

            var doAction = () => {
                this.$container.addClass('loading');

                AjaxClient.call(httpMethod, href)
                    .done((data, xhr) => {
                        this.$container.removeClass('loading');

                        // Check if it's the last item of the page
                        var itemCount = this.$container.find('table tbody tr').length;
                        var pageNumber = this.$container.find('.page-number').val();
                        if (itemCount == 1 && pageNumber > 1) {
                            this.gotoPage(pageNumber - 1);
                        } else {
                            this.refreshListing();
                        }
                    })
                    .fail((data, xhr) => {
                        this.$container.removeClass('loading');

                        Util.alert(actionError);
                    });
            };

            Util.confirmation({
                message: message,
                warning: warning,
                success: doAction
            });
        });
    }

    private initializeFixedTable() {
        $(window).off('resize.listing');
        $(window).off('scroll.listing');
        var $table = this.$container.find('table');
        if ($table.length > 1) {
            $table = $($table[0]);
        }

        if ($table.hasClass('without-fixed-header') || $table.length == 0) {
            return;
        }
        $table.wrap('<div class="listing-container" />');
        var navbarHeight = $('#navbar').outerHeight();
        var $fixedHeader = $table.clone();
        $fixedHeader
            .find('tbody').remove().end()
            .find('tfoot').remove().end()
            .css('margin-top', navbarHeight)
            .addClass('fixed').insertBefore($table);

        var resizeFixed = function () {
            $fixedHeader.find('th').each(function (index) {
                $(this).css('width', $table.find('th').eq(index).outerWidth() + 'px');
            });
        };

        var scrollFixed = function () {
            var offset = $(window).scrollTop() + navbarHeight;
            var tableOffsetTop = $table.offset().top;
            var tableOffsetBottom = tableOffsetTop + $table.height() - $table.find('thead').height();
            if (offset < tableOffsetTop || offset > tableOffsetBottom) {
                $fixedHeader.hide();
            } else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && $fixedHeader.is(':hidden')) {
                $fixedHeader.css('display', 'block');
            }
        };

        $(window).on('resize.listing', resizeFixed);
        $(window).on('scroll.listing', scrollFixed);
        resizeFixed();
        scrollFixed();
    }

    private initializeRowAction() {
        if (this.$container.find('table.data-table-hover').not('.data-table-fixed').length == 0) {
            return;
        }

        this.$container.on('click', 'table.data-table-hover tbody tr', function (e) {
            if ($(e.target).closest('a').length > 0) {
                return true;
            }

            if ($(this).hasClass('no-row-action') || $(this).hasClass('no-results')) {
                return true;
            }

            var route = $(this).parents('table.data-table-hover').data('row-route');
            var $row = $(e.currentTarget);
            var data = $row.data('row-route-data');

            window.location.href = Routing.generate(route, data);
        });
    }

    private gotoPage(pageNumber) {
        this.$container.find('.page-number').val(pageNumber);
        this.refreshListing();
    }

    private getElement(selector) {
        var $element = null;
        for (var i = 0; i < Listing.instances.length; i++) {
            $element = $(Listing.instances[i]).find(selector);
            if ($element && $element.length > 0) {
                break;
            }
        }
        return $element;
    }

    public refreshListing(options?) {
        var defaultOptions = {
            callback: null,
            historyPush: true,
            updateDirection: true
        };
        var $listingForm = this.getElement('.listing-form');
        var $container = $listingForm.parent();

        var $itemsPerPage = this.getElement('.items-per-page');
        var $serializeArray = $listingForm.serializeArray().concat([
            {name: 'itemsPerPage', value: $itemsPerPage.val()}
        ]);

        options = _.extend(defaultOptions, options);
        $container.addClass('loading');

        if (options.historyPush) {
            var $url = [];
            for (var i = 0; i < $serializeArray.length; i++) {
                $url.push($serializeArray[i].name + '=' + encodeURIComponent($serializeArray[i].value));
            }

            var historyUrl = $listingForm.attr('action');
            if (historyUrl.indexOf('?') == -1) {
                historyUrl += '?' + $url.join('&');
            } else {
                historyUrl += '&' + $url.join('&');
            }
            Util.historyPush(historyUrl);
        }

        if (options.updateDirection) {
            var sortingHeader = this.getElement('.sorting-header>a');
            var hasDirection = sortingHeader.hasClass('direction');
        }

        AjaxClient.get($listingForm.attr('action'), $serializeArray)
            .done((data, xhr) => {

                var listingForm = this.getElement('.listing-form');
                var container = listingForm.parent();
                $(container).html(data.html);

                Util.initializePlugins(container);
                this.initializeFixedTable();
                this.refreshSortingState();
                container.removeClass('loading');

                if (options.updateDirection) {
                    sortingHeader = this.getElement('.sorting-header>a');
                    if (!hasDirection) {
                        sortingHeader.addClass('direction');
                    } else {
                        sortingHeader.removeClass('direction');
                    }
                }

                Util.safeCall(options.callback);
            });
    }
}

export = Listing;
