import $ = require('jquery');
import Util = require('../lib/util');
import AjaxClient = require('../lib/ajaxClient');

class InvoiceForm {
    private $container:JQuery;
    private $previewBtn:JQuery;

    constructor($container:JQuery, $previewBtn:JQuery) {
        this.$container = $container;
        this.$previewBtn = $previewBtn;

        this.initializePreview();
    }

    private initializePreview() {
        this.$previewBtn.click((e) => {
            e.preventDefault();
            this.$container.addClass('loading');
            var $form:JQuery = this.$container.find('form');

            var promise = AjaxClient.post($form.attr('action'), $form.serialize());
            promise.done((data) => {
                if (!data.hasError) {
                    Util.showModal('#preview-invoice-modal');
                    $('.modal-body', '#preview-invoice-modal').html(data.html);
                } else {
                    $form.submit();
                }

                this.$container.removeClass('loading');
            });
        });

    }
}

export = InvoiceForm;
