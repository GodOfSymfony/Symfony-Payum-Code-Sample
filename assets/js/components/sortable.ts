import $ = require('jquery');

class Sortable {
    private $sortableContainer:JQuery;

    constructor() {
        this.$sortableContainer = $('.container-sortable');
        this.initializeSortable();
    }
    private initializeSortable() {
        this.$sortableContainer.sortable({
            handle: '.move-action'
        });
    }
}

export = Sortable;
