/// <reference path="_declare/require.d.ts" />
/// <reference path="_declare/jquery.d.ts" />
/// <reference path="_declare/jquery.flot.d.ts" />
/// <reference path="_declare/jquery.jvectormap.d.ts" />
/// <reference path="_declare/jquery-ui.d.ts" />
/// <reference path="_declare/lodash.d.ts" />
/// <reference path="_declare/select2.d.ts" />
/// <reference path="_declare/pikaday.d.ts" />
/// <reference path="_declare/velocity.d.ts" />
/// <reference path="_declare/toast.d.ts" />
/// <reference path="_declare/jquery.payForm.d.ts" />

declare var APP_DEBUG:any;
declare var Routing:{ generate:any; };
declare var uploadsUrl:string;
declare var fileUploaderSessionId:string;

requirejs.config({
    baseUrl: '/js/app',
    urlArgs: (typeof(APP_DEBUG) != 'undefined' && APP_DEBUG) ? 'bust=' + (new Date()).getTime() : 'bust=v1',
    paths: {
        'jquery': 'vendor/jquery-2.1.4',
        'jquery-ui': 'vendor/jquery-ui-1.11.4',
        'jquery.easing': 'vendor/jquery.easing-1.3',
        'lodash': 'vendor/lodash-3.10.1',
        'hammer': 'vendor/hammer-2.0.4',
        'velocity': 'vendor/velocity-1.2.3',
        'select2': 'vendor/select2-4.0.1',
        'moment': 'vendor/moment-2.10.6',
        'pikaday': 'vendor/pikaday-1.4.0',
        'pikaday.jquery': 'vendor/pikaday.jquery',
        'toast': 'components/toast',
        'ckeditor-core': 'vendor/ckeditor/ckeditor',
        'ckeditor-jquery':'vendor/ckeditor/adapters/jquery',
        'jquery.jvectormap': 'vendor/jquery.jvectormap',
        'jquery.flot': 'vendor/jquery.flot',
        'jquery.flot.pie': 'vendor/jquery.flot.pie',
        'jquery.flot.tooltip': 'vendor/jquery.flot.tooltip',
        'jquery.flot.orderBars': 'vendor/jquery.flot.orderBars',
        'jquery.flot.time': 'vendor/jquery.flot.time',
        'jquery.fileupload': 'vendor/jquery.fileupload',
        'jquery.iframe-transport': 'vendor/jquery.iframe-transport',
        'jquery.guillotine': 'vendor/jquery.guillotine',
        'jquery.payform': 'vendor/payform/jquery.payform'
    },
    shim: {
        'jquery-ui': {
            deps: ['jquery']
        },
        'velocity': {
            deps: ['jquery']
        },
        'jquery.easing': {
            deps: ['jquery']
        },
        'jquery.jvectormap': {
            deps: ['jquery']
        },
        'jquery.flot': {
            deps: ['jquery']
        },
        'jquery.flot.pie': {
            deps: ['jquery.flot']
        },
        'jquery.flot.tooltip': {
            deps: ['jquery.flot']
        },
        'jquery.flot.orderBars': {
            deps: ['jquery.flot']
        },
        'jquery.flot.time': {
            deps: ['jquery.flot']
        },
        'jquery.guillotine': {
            deps: ['jquery']
        },
        'jquery.payform': {
            deps: ['jquery']
        },
        'hammer': {
            exports: 'Hammer'
        }
    }
});

// Use requirejs instead of require to avoid PHPStorm bug with typescript
requirejs([
    'app'
], (App: { getInstance: () => any; }) => {
    // Force app initialization
    var app = App.getInstance();
});
