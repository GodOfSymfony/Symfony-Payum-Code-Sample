import $ = require('jquery');
import Util = require('../lib/util');

class DetailModal {
    private $element:JQuery;

    constructor() {
        this.$element = $('#dispute-modal');
    }

    public open(url:string) {
        Util.showAjaxFormModal(this.$element, url, '.save-button', '' , '', (result) => {
            if (!result.hasError) {
                location.reload();
            } else {
                Util.alert('We are not able to generate the Dispute. Try again later.');
            }
        });
    }
}

export = DetailModal;
