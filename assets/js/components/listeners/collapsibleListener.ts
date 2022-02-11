import eventBus = require('../../lib/eventBus');
import AjaxClient = require('../../lib/ajaxClient');

class CollapsibleListener {
    constructor() {
        eventBus.on('collapsible:toggle', this.onToggle, this);
    }

    private onToggle(data) {
        AjaxClient.post(Routing.generate('app_session'), { name: data.element, value: data.opened });
    }
}

export = CollapsibleListener;
