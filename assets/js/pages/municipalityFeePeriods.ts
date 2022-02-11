import $ = require('jquery');
import _ = require('lodash');
import Util = require('../lib/util');

class MunicipalityFeePeriods {
    //Vars to manage list.
    private $addLink: JQuery;
    protected $collectionHolder: JQuery;
    private $lastFee: JQuery;
    private $noPeriods: JQuery;
    private $prototype: string;
    //Vars to manage positions values.
    private $posId: string;
    private $posInfo: string;
    //Vars for total fee calculation
    private $renewalBase: JQuery;
    private $additionalFeeId: string;
    private $periodTypeId: string;
    private $totalFeeId: string;
    private $fixedType: string;

    constructor() {
        //Vars to manage list.
        this.$addLink = $('#new_period');
        this.$collectionHolder = $('#periods');
        this.$lastFee = $('#last_fee');
        this.$noPeriods = $('#no_periods');
        //Vars to manage positions values.
        this.$posId = '#fee_form_periods___id___position';
        this.$posInfo = '<p>__index__ Renewal</p>';
        //Vars for total fee calculation
        this.$renewalBase = $('#fee_form_renewalBaseFee');
        this.$additionalFeeId = '_additionalFee';
        this.$periodTypeId = '_feeType';
        this.$totalFeeId = '_totalFee';
        this.$fixedType = 'fixed';

        this.initializeEvents();
        this.initializeSortable();
        this.generateTotals();
        this.initializePeriodTypeObserver(this.$collectionHolder);
        this.initializeAdditionalFeeObserver(this.$collectionHolder);
        this.initializeDeleteAction(this.$collectionHolder);
    }

    private generateTotals($additional = '') {
        var total: number = parseFloat(this.$renewalBase.val());

        _.each(this.$collectionHolder.find('.fee-period' + $additional), (current) => {
            var fieldId: string = '#' + $(current).attr('id');
            var $additionalFee: JQuery = $(fieldId.concat(this.$additionalFeeId));
            var $periodType: JQuery = $(fieldId.concat(this.$periodTypeId));
            var $totalFee: JQuery = $(fieldId.concat(this.$totalFeeId));
            var type: string;
            var $nodes = $periodType.find($periodType.find('input.radio-button'));
            // _.each($periodType.find($periodType.find('input.radio-button'), (c) => {
            for (var i = 0; i < $nodes.length; i++) {
                // var c = $periodType.find($periodType.find('input.radio-button')[0]);
                if ($($nodes[i]).attr('checked')) {
                    type = $($nodes[i]).val();
                    if (type === this.$fixedType) {
                        total = parseFloat($additionalFee.val()) + total;
                    } else {
                        total += parseFloat($additionalFee.val()) * total / 100;
                    }
                    $totalFee.empty();
                    $totalFee.append('$' + total.toFixed(2).toString());
                }
            }
            // });
        });
    }

    private initializeSortable() {
        this.$collectionHolder.sortable({
            handle: '.move-action',
            stop: () => {
                this.applyReorderPosition();
            }
        });
    }

    private applyReorderPosition() {
        var i = 1;
        _.each(this.$collectionHolder.find('.fee-period'), (current) => {
            var $posRow: JQuery = $(current).children('.period-number');
            $posRow.empty();
            $posRow.append(this.$posInfo.replace(/__index__/g, this.getGetOrdinal(i + 1)));

            var myId: string = '#' + $(current).attr('id') + '_position';

            var $posInput: JQuery = $(myId);
            $posInput.val(i.toString());
            i++;
        });

        this.generateTotals();
    }

    private initializeEvents() {
        this.$prototype = this.$collectionHolder.data('prototype');
        //Counts the initial rows. Used later to avoid ID repeated after deleting a row.
        this.$collectionHolder.data('index', this.$collectionHolder.find('.fee-period').length);

        this.$renewalBase.on('input', (e) => {
            this.generateTotals();
        });

        this.$addLink.on(
            'click',
            {protoForm: this.$prototype},
            (event) => {
                event.preventDefault();

                //Hide no elements row.
                if (!this.$noPeriods.hasClass('hidden')) {
                    this.$noPeriods.addClass('hidden');
                }

                //Array collection starts at 0, so we use index without modify it.
                var index: number = this.$collectionHolder.data('index');
                var newForm: string = event.data.protoForm.replace(/__id__/g, index.toString());

                //Real qty of rows. Periods list starts at 2.
                var position: number = this.$collectionHolder.find('.fee-period').length;
                var posStr: string = this.$posInfo.replace(/__index__/g, this.getGetOrdinal(position + 2));
                newForm = newForm.replace(/__periodNum__/g, posStr);

                // Display the form in the page in an tr
                var trStr: string = '<tr class="fee-period fee_form_periods___index__" id="fee_form_periods___index__"></tr>';
                var $newFormTr: JQuery = $(trStr.replace(/__index__/g, index.toString())).append($(newForm));

                this.$lastFee.before($newFormTr);
                // Update the value with latest ID used.
                this.$collectionHolder.data('index', index + 1);

                //set position value
                var myId: string = this.$posId.replace(/__id__/g, index.toString());
                var $posInput: JQuery = $(myId);
                // Positions start at 1, we need to increment index by 1.
                $posInput.val((position + 1).toString());

                this.initializeDeleteAction($newFormTr);
                this.initializePeriodTypeObserver($newFormTr);
                this.initializeAdditionalFeeObserver($newFormTr);
            }
        );
    }

    private initializePeriodTypeObserver($holder: JQuery) {
        _.each($holder.find('input.radio-button'), (c) => {
            $(c).on('change', (e) => {
                var currentId: string = $(e.currentTarget).attr('id');
                var parentId: string = '#' + currentId.slice(0, currentId.length - 2);

                _.each($(parentId).find('input.radio-button'), (child) => {
                    if ($(child).attr('id') !== currentId) {
                        $(child).removeAttr('checked');
                    }
                });

                $(e.currentTarget).attr('checked', 'checked');

                var id = currentId.slice(0, currentId.length - 2);
                id = '.' + id.replace('_feeType','');
                this.generateTotals(id);
            });
        });
    }

    private initializeAdditionalFeeObserver($holder: JQuery) {
        _.each($holder.find('input.additional-fee'), (c) => {
            $(c).on('input', (e) => {
                var id = $(c).attr('id');
                id = '.' + id.replace('_additionalFee','');
                this.generateTotals(id);
            });
        });
    }

    private initializeDeleteAction($holder: JQuery) {
        _.each($holder.find('.actions-inline'), (current) => {
            $(current).on('click', '.delete-action', (e) => {
                e.preventDefault();

                var $parent = $(e.currentTarget).closest('.fee-period');

                var doDelete = () => {
                    $parent.remove();
                    this.applyReorderPosition();
                };

                Util.confirmation({
                    message: 'Are you sure you want to delete the item?',
                    warning: '',
                    success: doDelete
                });
            });
        });
    }

    private getGetOrdinal(n) {
        var s = ['th', 'st', 'nd', 'rd'],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}

export = MunicipalityFeePeriods;
