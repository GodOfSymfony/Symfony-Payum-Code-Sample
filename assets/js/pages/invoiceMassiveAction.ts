class InvoiceMassiveAction {
    constructor(options) {
        if (options.type == 'print') {
            window.print();
        }
    }
}

export = InvoiceMassiveAction;
