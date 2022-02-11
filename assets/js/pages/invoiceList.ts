import $ = require('jquery');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');

class InvoiceList {
    private $container:JQuery;
    private $invoiceSelectedContainer:JQuery;
    protected $markPaidUrl:string;

    constructor() {
        this.$container = $('#invoice-index');
        this.$invoiceSelectedContainer = this.$container.find('.container-invoice-selected');

        this.initializeEvents();
    }

    private initializeEvents() {
        this.$container.on('click', '.btn-how-pay-check', (e) => {
            Util.alert('Checks should be made out to Munireg LLC and mailed to Munireg LLC 2940 Noble Rd, Suite 202 Cleveland Heights, OH 44118. Invoice number must be written on the memo line to ensure prompt processing. Please note that registrations are not considered complete until payment has been received and processed.');
        });

        this.$container.on('click', '.select-invoice', (e) => {
            this.updateFilters();
        });

        this.$container.on('click', '.search-button', (e) => {
            this.clearFilters();
        });

        this.$container.on('click', '.check-modal', (e) => {
            e.preventDefault();
            var $btn = $(e.currentTarget);

            if ($btn.hasClass('munireg')) {
                window.location.href = this.$markPaidUrl;
            } else {
                $('#payment-modal').closeModal({
                    complete: function() {
                        Util.alert('Checks should be made out to Munireg LLC and mailed to Munireg LLC 2940 Noble Rd, Suite 202 Cleveland Heights, OH 44118. Invoice number must be written on the memo line to ensure prompt processing. Please note that registrations are not considered complete until payment has been received and processed.');
                    }
                });
            }
        });

        this.$container.on('click', '.user-pay-invoice', (e) => {
            e.preventDefault();
            var $btn = $(e.currentTarget);
            var creditCardUrl = $btn.data('href');
            this.$markPaidUrl = Routing.generate('app_invoice_fill_check_info', { id: $btn.data('id') });
            Util.confirmation({
                title: 'Invoice Payment',
                message: 'How do you want to pay the Invoice',
                acceptTitle: 'By Credit Card',
                containerSelector: '#payment-modal',
                success: (e) => {
                    window.location.href = creditCardUrl;
                }
            });
        });
    }

    private updateFilters() {
        let $selectedInvoices = $('.select-invoice:checked');

        this.$invoiceSelectedContainer.addClass('show');
        this.$invoiceSelectedContainer.addClass('loading');

        AjaxClient.get(Routing.generate('app_invoice_filter'), $selectedInvoices.serialize())
            .done((data, xhr) => {
                this.$invoiceSelectedContainer.html(data.html);

                Util.initializePlugins(this.$invoiceSelectedContainer);

                this.$invoiceSelectedContainer.removeClass('loading');

                if ($selectedInvoices.length == 0) {
                    this.$invoiceSelectedContainer.removeClass('show');
                }

                this.initializeFilterActions();
            });
    }

    private initializeFilterActions() {
        let $invoiceMassiveActionForm = this.$invoiceSelectedContainer.find('.invoice-massive-action');

        this.$invoiceSelectedContainer.find('.container-btns-invoice')
            .on('click', '.download, .print', (e:JQueryEventObject) => {
                e.preventDefault();

                let $selectedInvoices = $('.select-invoice:checked');

                let selectedInvoices = [];
                $selectedInvoices.each((idx, value) => {
                    selectedInvoices.push($(value).val());
                });

                let type;
                if ($(e.currentTarget).hasClass('download')) {
                    type = 'download';
                    $invoiceMassiveActionForm.attr('target', '_blank');
                } else if ($(e.currentTarget).hasClass('print')) {
                    type = 'print';
                    $invoiceMassiveActionForm.attr('target', '_blank');
                }

                this.confirmMassiveAction($invoiceMassiveActionForm, type, selectedInvoices);
        });

        this.$invoiceSelectedContainer.find('.container-btns-invoice')
            .on('click', '.pay', (e:JQueryEventObject) => {
                e.preventDefault();

                let $btn:JQuery = $(e.currentTarget);

                if ($btn.hasClass('disabled')) {
                    Util.alert('You have selected invoices already paid.')
                } else {
                    let $selectedInvoices = $('.select-invoice:checked');

                    let selectedInvoices = [];
                    $selectedInvoices.each((idx, value) => {
                        selectedInvoices.push($(value).val());
                    });

                    Util.confirmation({
                        title: 'Invoice Payment',
                        message: 'How do you want to pay the Invoice',
                        acceptTitle: 'By Credit Card',
                        containerSelector: '#payment-modal',
                        success: (e) => {
                            this.confirmMassiveAction($invoiceMassiveActionForm, 'pay', selectedInvoices);
                        }
                    });
                }
            });

    }

    private confirmMassiveAction($invoiceMassiveActionForm, type, selectedInvoices) {
        $invoiceMassiveActionForm.find('input[name="type"]').val(type);
        $invoiceMassiveActionForm.find('input[name="invoices"]').val(selectedInvoices);
        $invoiceMassiveActionForm.submit();

        $invoiceMassiveActionForm.find('input[name="type"]').val('');
        $invoiceMassiveActionForm.find('input[name="invoices"]').val('');
        $invoiceMassiveActionForm.removeAttr('target');
    }

    private clearFilters() {
        this.$invoiceSelectedContainer.removeClass('loading');
        this.$invoiceSelectedContainer.removeClass('show');
        this.$invoiceSelectedContainer
            .find('.invoice-data')
            .find('.amount-invoices, .sum-price-invoices, .container-btns-invoice')
            .remove();
    }
}

export = InvoiceList;
