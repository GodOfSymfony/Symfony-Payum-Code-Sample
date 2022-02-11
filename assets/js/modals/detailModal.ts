import $ = require('jquery');
import Util = require('../lib/util');

class DetailModal {
    private $element:JQuery;

    constructor() {
        this.$element = $('#detail-modal');
    }

    public open(url:string) {
        Util.showAjaxModal(this.$element, url);
    }
}

export = DetailModal;
