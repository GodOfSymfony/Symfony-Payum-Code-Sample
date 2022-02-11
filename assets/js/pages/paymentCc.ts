/// <amd-dependency path="jquery.payform">

import $ = require('jquery');
import Util = require('../lib/util');

class PaymentCc {

    private $payCheckBtn:JQuery;
    private $payBtn:JQuery;
    private $formContainer:JQuery;
    private $ccNumber:JQuery;
    private $typeContainer:JQuery;
    private $expiryMonth:JQuery;
    private $expiryYear:JQuery;
    private $cvc:JQuery;
    private $holder:JQuery;

    constructor($payCheckBtn:JQuery, $payBtn:JQuery, $formContainer:JQuery, options) {
        this.$payCheckBtn = $payCheckBtn;
        this.$payBtn = $payBtn;
        this.$formContainer = $formContainer;
        this.$ccNumber = $(options.ccNum);
        this.$typeContainer = $(options.typeContainer);
        this.$expiryMonth = $(options.expiryMonth);
        this.$expiryYear = $(options.expiryYear);
        this.$cvc = $(options.cvc);
        this.$holder = $(options.holder);

        this.initializePyByCheck();
        this.initializePayForm();
        this.initializeCcValidator();
        this.initializeCvcValidator();
        this.initializeExpiryValidator();
        this.initializeHolderValidator();
        this.validateForm();
    }

    private initializePyByCheck() {
        this.$payCheckBtn.on('click', (e) => {
            e.preventDefault();
            Util.alert('Checks should be made out to Munireg LLC and mailed to Munireg LLC 2940 Noble Rd, Suite 202 Cleveland Heights, OH 44118. Invoice number must be written on the memo line to ensure prompt processing. Please note that registrations are not considered complete until payment has been received and processed.');
        });
    }

    private initializePayForm()
    {
        this.$ccNumber.payform('formatCardNumber');
        this.$cvc.payform('formatCardCVC');
    }

    private validateForm() {
        let cardType = $.payform.parseCardType(this.$ccNumber.val());
        let $validCcNumber =  $.payform.validateCardNumber(this.$ccNumber.val());
        let $validCvc = $.payform.validateCardCVC(this.$cvc.val(), cardType);
        let $validHolder = this.$holder.val().length > 0;

        PaymentCc.fieldStatus(this.$ccNumber, $validCcNumber);
        PaymentCc.fieldStatus(this.$cvc, $validCvc);
        PaymentCc.fieldStatus(this.$holder, $validHolder);

        if ($validCcNumber &&
            $validCvc && $validHolder
        ) {
            if (!this.$payBtn.hasClass('active')) {
                this.$payBtn.addClass('active');
                this.$payBtn.prop( "disabled", false);
            }
        } else {
            if (this.$payBtn.hasClass('active')) {
                this.$payBtn.removeClass('active');
                this.$payBtn.prop( "disabled", true);
            }
        }

    }

    private initializeCvcValidator() {

        this.$cvc.on('change', (e) => {
            this.validateForm();
        });
    }

    private initializeExpiryValidator() {

        this.$expiryYear.on('change', (e) => {
            this.validateForm();
        });
        this.$expiryMonth.on('change', (e) => {
            this.validateForm();
        });
    }

    private initializeHolderValidator() {

        this.$holder.on('input', (e) => {
            this.validateForm();
        });
    }

    private initializeCcValidator() {
        const validCardTypes = ['mastercard', 'visa', 'amex', 'discover'];

        this.$ccNumber.on('input', (e) => {
            $('.card-types').removeClass('active');

            let cardType = $.payform.parseCardType(this.$ccNumber.val());
            if (cardType && validCardTypes.indexOf(cardType) != -1) {
                $('.card-types.'+cardType).addClass('active');
            }
        });

        this.$ccNumber.on('change', (e) => {
            this.validateForm();
        });
    }

    static fieldStatus($input:JQuery, valid) {
        if (valid) {
            $input.parent().siblings('.textfield-error').html('');
        } else if ($input.val().length > 0) {
            $input.parent().siblings('.textfield-error').html('<ul><li>Invalid value</li></ul>.');
        }

        return valid;
    }
}

export = PaymentCc;
