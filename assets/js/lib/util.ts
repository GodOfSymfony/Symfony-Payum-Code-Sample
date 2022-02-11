/// <amd-dependency path="components/modal">
import $ = require('../vendor/jquery-2.1.4');
import _ = require('lodash');
// @ts-ignore
import Toast = require('../components/toast');
import AjaxClient = require('../lib/ajaxClient');


class Util {
    public static initializePlugins:Function;

    public static configurePlugins(configurePlugins: Function) {
        this.initializePlugins = configurePlugins;
    }

    public static truncate(text:string, maxLength:number) {
        if (text.length < (maxLength - 3)) { return text; }

        return text.substr(0, maxLength - 3) + '...';
    }

    public static strRepeat(input:string, multiplier:number) {
        // http://kevin.vanzonneveld.net
        // *     example 1: strRepeat('-=', 10);
        // *     returns 1: '-=-=-=-=-=-=-=-=-=-='
        var y = '';
        while (true) {
            if (multiplier & 1) {
                y += input;
            }
            multiplier >>= 1;
            if (multiplier) {
                input += input;
            } else {
                break;
            }
        }
        return y;
    }

    public static startsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }

    public static endsWith(str, suffix) {
        return str.match(suffix + '$') == suffix;
    }

    public static clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if ((<any>document).selection) {  // IE?
            (<any>document).selection.empty();
        }
    }

    public static safeCall(func:Function, ...args: any[]) {
        if (typeof func !== 'undefined' && func != null) {
            return func.apply(null, args);
        }
    }

    public static isValidEmail(email:string) {
        /* tslint:disable */
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        /* tslint:enable */
        return re.test(email);
    }

    public static stripTags(text:string) {
        return text.replace(/(<([^>]+)>)/ig, '');
    }

    public static humanFileSize(size:any) {
        var i = Math.floor( Math.log(size) / Math.log(1024) );
        return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
    }

    public static isDisabled($element:JQuery) {
        return ($element.prop('disabled') || $element.hasClass('disabled'));
    }

    public static historyPush(path:string) {
        if (typeof(window.history.pushState) == 'function') {
            window.history.pushState(null, path, path);
        }
    }

    public static alert(message:string) {
        var $container = $('#alert-modal');
        $('.message', $container).html(message);

        Util.showModal($container);
    }

    public static showModal(modalContainer, onShown?, onClose?, initializePlugins = true) {
        var $container = typeof modalContainer == 'string' ? $(modalContainer) : modalContainer;
        $container.openModal({
            ready: function() {
                if (initializePlugins) {
                    Util.safeCall(Util.initializePlugins, $('.modal-body', $container));
                }
                Util.safeCall(onShown);
            },
            complete: function() {
                Util.safeCall(onClose);
            }
        });
    }

    public static showAjaxModal(modalContainer, url:string, onLoad?, onShown?, onClose?, initializePlugins = true) {
        var $container = typeof modalContainer == 'string' ? $(modalContainer) : modalContainer;
        if ($container.data('ajax-request') != null) {
            $container.data('ajax-request').abort();
        }

        $('.modal-body', $container).html('');
        $container.addClass('loading');
        Util.showModal($container, () => {
            var promise = AjaxClient.get(url);
            promise.done((data, xhr) => {
                $('.modal-body', $container).html(data.html);
                $container.data('ajax-request', null);
                $container.removeClass('loading');
                if (initializePlugins) {
                    Util.safeCall(Util.initializePlugins, $('.modal-body', $container));
                }
                Util.safeCall(onLoad);
            });

            $container.data('ajax-request', promise.request);
            Util.safeCall(onShown);
        }, onClose, false);
    }

    public static showAjaxFormModal(
        modalContainer,
        url:string,
        mainButton,
        onLoad?,
        onShown?,
        onSuccess?,
        onClose?,
        initializePlugins = true
    ) {
        var $container:JQuery = typeof modalContainer == 'string' ? $(modalContainer) : modalContainer;
        var $mainButton:JQuery = typeof mainButton == 'string' ? $(mainButton, $container) : mainButton;

        $mainButton.off('click');
        $mainButton.on('click', (e) => {
            e.preventDefault();

            if (this.isDisabled($mainButton)) {
                return;
            }

            var $form = $('form', $container);

            $container.addClass('loading');
            $mainButton.prop('disabled', true);

            var promise = AjaxClient.post($form.attr('action'), $form.serialize());
            promise.done((data) => {
                $container.data('ajax-request', null);

                if (!data.hasError) {
                    this.hideModal($container);
                    this.showToast(data.message);
                    this.safeCall(onSuccess, data);

                    return;
                }

                $('.modal-body', $container).html(data.html);
                $mainButton.prop('disabled', false);
                $container.removeClass('loading');
                if (initializePlugins) {
                    Util.safeCall(Util.initializePlugins, $('.modal-body', $container));
                }
                this.safeCall(onLoad);
            });

            $container.data('ajax-request', promise.request);
        });

        $mainButton.prop('disabled', true);

        this.showAjaxModal($container, url, () => {
            $mainButton.prop('disabled', false);
            this.safeCall(onLoad);
        }, onShown, onClose, initializePlugins);
    }

    public static hideModal(modalContainer, onClose?) {
        var $container = typeof modalContainer == 'string' ? $(modalContainer) : modalContainer;
        $container.closeModal({
            complete: function() {
                Util.safeCall(onClose);
            }
        });
    }

    public static confirmation(options) {
        var defaults = {
            title: 'Warning',
            message: null,
            warning: null,
            acceptTitle: 'Ok',
            containerSelector: '#confirmation-modal',
            success: null,
            onShown: null,
            onClose: null
        };

        options = _.extend(defaults, options);

        var $container = $(options.containerSelector);

        $container.off('click', '.accept-button');
        $('.modal-title', $container).html(options.title);
        $('.accept-button', $container).html(options.acceptTitle);
        $('.message', $container).html(options.message);
        if (options.warning != null && options.warning.length > 0) {
            $('.warning', $container).html(options.warning);
            $('.warning-container', $container).show();
        } else {
            $('.warning-container', $container).hide();
        }

        Util.showModal($container, () => {
            $container.on('click', '.accept-button', (e) => {
                e.preventDefault();

                Util.hideModal($container);

                this.safeCall(options.success);
            });
        });
    }

    public static showToast (message:string, duration = 2000) {
        Toast.show(message, duration);
    }

    public static dispatchDomEvent(element:any, eventName:string) {
        if ('createEvent' in document) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(eventName, false, true);
            element.dispatchEvent(evt);
        } else {
            element.fireEvent('on' + eventName);
        }
    }

    // See: http://www.typescriptlang.org/Handbook#mixins
    public static applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
}

export = Util;
