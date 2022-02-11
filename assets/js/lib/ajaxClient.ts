import $ = require('../vendor/jquery-2.1.4');
import _ = require('lodash');
import eventBus = require('../lib/eventBus');
import Observable = require('../lib/observable');

interface RequestPromise extends JQueryPromise<any> {
    request:JQueryXHR;
}

interface CreateResultPromiseOptions {
    silent?: boolean;
}

class AjaxClient extends Observable {
    private static instance:AjaxClient = new AjaxClient();

    constructor() {
        super();

        if (AjaxClient.instance) {
            throw new Error('Error: Instantiation failed: Use AjaxClient.getInstance() instead of new.');
        }

        AjaxClient.instance = this;

        this.initialize();
    }

    static getInstance():AjaxClient {
        return AjaxClient.instance;
    }

    public static post(url: string, data?:Object|string, options?:CreateResultPromiseOptions):RequestPromise {
        return AjaxClient.getInstance().post(url, data, options);
    }

    public static get(url:string, data?:Object|string, options?:CreateResultPromiseOptions):RequestPromise {
        return AjaxClient.getInstance().get(url, data, options);
    }

    public static call(
        method:string,
        url:string,
        data?:Object|string,
        requestOptions?:Object,
        options?:CreateResultPromiseOptions
    ):RequestPromise {
        return AjaxClient.getInstance().call(method, url, data, requestOptions, options);
    }

    public post(url: string, data?:Object|string, options?:CreateResultPromiseOptions):RequestPromise {
        return this.createResultPromise($.post(url, data), options);
    }

    public get(url:string, data?:Object|string, options?:CreateResultPromiseOptions):RequestPromise {
        return this.createResultPromise($.get(url, data), options);
    }

    public call(
        method:string,
        url:string,
        data?:Object|string,
        requestOptions?:Object,
        options?:CreateResultPromiseOptions
    ):RequestPromise {
        return this.createResultPromise($.ajax(_.extend(requestOptions || {}, { type: method, url: url, data: data })), options || {});
    }

    private initialize() {
        $.ajaxSetup({
            cache: false,

            beforeSend: function(jqXHR, settings) {
                jqXHR.url = settings.url;
            }
        });
    }

    private createResultPromise(jqXHR:JQueryXHR, options?:CreateResultPromiseOptions):RequestPromise {
        var _options:CreateResultPromiseOptions = {
            silent: false
        };
        _.extend(_options, options);

        var deferred = $.Deferred();

        jqXHR.done((data, textStatus, jqXHR)  => {
            if (data.hasError) {
                deferred.reject(data.error, jqXHR);
            } else {
                deferred.resolve(data.result, jqXHR);
            }

            if (!_options.silent) {
                eventBus.trigger('ajaxClient:request', data, jqXHR);
                this.trigger('ajaxClient:request', data, jqXHR);
            }
        });

        jqXHR.fail((jqXHR, textStatus, errorThrown) => {
            deferred.reject({ type: 'jqXHRError', message: errorThrown, textStatus: textStatus }, jqXHR);
        });

        var promise:any = deferred.promise();
        promise.request = jqXHR;

        return promise;
    }
}

export = AjaxClient;
