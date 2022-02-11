import $ = require('jquery');
import _ = require('lodash');
import Listing = require('../lib/listing');

class ChangeLogList extends Listing {
    private labelOptionsJson:any;

    constructor(options) {
        super($('.listing'));

        this.labelOptionsJson = JSON.parse(options.labelOptionsJson);

        this.initializeChangeLog();
        this.initializeChangeLogEvents();
    }

    private initializeChangeLog() {
        this.updateValueFields();
    }

    private initializeChangeLogEvents() {
        this.$container.on('change', 'select[name="entity"]', (e) => {
            let $label = $(e.currentTarget);

            let $labels = this.$container.find('select[name="label"]');
            $labels
                .empty()
                .append('<option value="">All</option>');

            _.each(this.labelOptionsJson, (labelsOptions, idx) => {
                if (idx !== $label.val()) {
                    return;
                }

                _.each(labelsOptions, (label, idx) => {
                    $labels.append('<option value=' + idx + '>' + label + '</option>');
                });
            });

            this.updateValueFields();
        });

        this.$container.on('change', 'select[name="label"]', () => {
            this.updateValueFields();
        });
    }

    private updateValueFields() {
        if (this.$container.find('select[name="label"]').val() !== '') {
            this.$container.find('input[name="oldValue"]').removeAttr('disabled');
            this.$container.find('input[name="newValue"]').removeAttr('disabled');
        } else {
            this.$container.find('input[name="oldValue"]').attr('disabled', 'disabled');
            this.$container.find('input[name="newValue"]').attr('disabled', 'disabled');
        }
    }
}

export = ChangeLogList;
