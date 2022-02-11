import $ = require('jquery');

class MunicipalityFeeForm {
    private $container:JQuery;
    private $periodFixedRecurrence:JQuery;
    private $periodFixedRecurrenceType:JQuery;
    private $periodAnnualDay:JQuery;
    private $periodAnnualMonth:JQuery;
    private annualPeriod:string;

    constructor(options) {
        this.$container = $('#fee_form_period');
        this.$periodFixedRecurrence = $('#fee_form_periodFixedRecurrence');
        this.$periodFixedRecurrenceType = $('#fee_form_periodFixedRecurrenceType');
        this.$periodAnnualDay = $('#fee_form_periodAnnualDay');
        this.$periodAnnualMonth = $('#fee_form_periodAnnualMonth');
        this.annualPeriod = options.annualPeriod;

        this.initializeEvents();
    }

    private initializeEvents() {
        this.$container.on('change', '.radio-button', (e) => {
            var periodType = $(e.currentTarget);
            var period:String = periodType.val();
            if (period === this.annualPeriod) {
                this.hideFixed();
                this.displayAnnual();
            } else {
                this.displayFixed();
                this.hideAnnual();
            }
        });
    }

    private displayAnnual() {
        if (this.$periodAnnualDay.parent().hasClass('hidden')) {
            this.$periodAnnualDay.parent().removeClass('hidden');
        }
        if (this.$periodAnnualMonth.parent().hasClass('hidden')) {
            this.$periodAnnualMonth.parent().removeClass('hidden');
        }
    }

    private hideAnnual() {
        if (!this.$periodAnnualDay.parent().hasClass('hidden')) {
            this.$periodAnnualDay.parent().addClass('hidden');
        }
        if (!this.$periodAnnualMonth.parent().hasClass('hidden')) {
            this.$periodAnnualMonth.parent().addClass('hidden');
        }
    }

    private displayFixed() {
        if (this.$periodFixedRecurrence.parent().hasClass('hidden')) {
            this.$periodFixedRecurrence.parent().removeClass('hidden');
        }
        if (this.$periodFixedRecurrenceType.parent().hasClass('hidden')) {
            this.$periodFixedRecurrenceType.parent().removeClass('hidden');
        }
    }

    private hideFixed() {
        if (!this.$periodFixedRecurrence.parent().hasClass('hidden')) {
            this.$periodFixedRecurrence.parent().addClass('hidden');
        }
        if (!this.$periodFixedRecurrenceType.parent().hasClass('hidden')) {
            this.$periodFixedRecurrenceType.parent().addClass('hidden');
        }
    }
}

export = MunicipalityFeeForm;
