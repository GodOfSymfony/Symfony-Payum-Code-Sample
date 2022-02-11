import $ = require('jquery');
import Util = require('../lib/util');
import eventBus = require('../lib/eventBus');

class ImgModal {
    private $targetImages:string;
    private $modalBody:JQuery;
    private $detailModal:JQuery;
    private $images:JQuery;

    constructor(targetImages) {
        this.$modalBody = $('#detail-modal');
        this.$detailModal = $('.modal-body');
        this.$targetImages = targetImages;
        this.initializeModal();

        eventBus.on('image:modal:load', this.initializeModal, this);
    }

    private initializeModal() {
        this.$images = $(this.$targetImages);
        if (this.$images.length > 0) {
            this.$images.each((index, imgElem) => {
                $(imgElem).on('click', (event) => {
                    this.open(event.currentTarget);
                })
            })
        }
    }

    public open(element) {
        let $elem = $(element).clone();
        $elem.removeAttr('style');
        this.$modalBody.html($elem[0].outerHTML);
        this.$modalBody.css({'width': '50%', 'height': 'auto', 'text-align': 'center'});
        Util.showModal(this.$modalBody);
    }
}

export = ImgModal;
