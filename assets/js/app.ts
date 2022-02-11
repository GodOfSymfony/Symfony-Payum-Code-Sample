// / <amd-dependency path="select2">
// / <amd-dependency path="pikaday.jquery">
// / <amd-dependency path="ckeditor-jquery">
// / <amd-dependency path="jquery.easing">
// / <amd-dependency path="components/modal">
// / <amd-dependency path="jquery-ui">

import $ = require('./vendor/jquery-2.1.4');
import Util = require('./lib/util');
import Listing = require('./lib/listing');
import FileUploader = require('./lib/fileUploader');
import ChangeLog = require('./components/changelogComponent');
import Collapsible = require('./components/collapsible');
import SiteListener = require('./components/siteListener');

class App {
    private static instance:App = new App();

    public constructor() {
        if (App.instance) {
            throw new Error('Error: Instantiation failed: Use App.getInstance() instead of new.');
        }

        App.instance = this;

        this.initialize();
    }

    public static getInstance():App {
        return App.instance;
    }

    private initialize() {
        $('.listing').not('.no-initialize').each((i: any, obj: any) => {
            new Listing($(obj));
        });

        $('.changelog-wrapper').each((i: any, obj: any) => {
            new ChangeLog($(obj));
        });

        $('.container-accordion').each((i: any, obj: any) => {
            new Collapsible($(obj));
        });

        $('.not-ready').each((i: any, obj: any) => {
            $(obj).on('click', () => {
                Util.alert('Is not implemented yet. It will be ready in the future.');
            });
        });

        $('.alert').each((i: any, obj: any) => {
            $(obj).on('click', (e: { currentTarget: any; }) => {
                var msg = $(e.currentTarget).data('alert-msg');
                Util.alert(msg);
            });
        });

        new SiteListener();

        Util.configurePlugins(function($container?:JQuery) {
            moment.locale('en');

            $('.datefield-input').pikaday({
                firstDay: 1,
                format: 'MM/DD/YYYY',
                minDate: new Date(2000, 0, 1),
                maxDate: new Date(2050, 12, 31),
                yearRange: [2000, 2050]
            });

            $('.datetimefield-input').pikaday({
                firstDay: 1,
                showTime: true,
                format: 'MM/DD/YYYY HH:mm',
                minDate: new Date(2000, 0, 1),
                maxDate: new Date(2020, 12, 31),
                yearRange: [2000, 2020]
            });

            $('input[type=\'number\']').bind('cut copy paste', (e: { preventDefault: () => void; }) => {
                e.preventDefault();
            });

            $('.file-uploader', $container).not('.no-initialize').each(function(i: any, obj: any) {
                var $obj = $(obj);
                var fileUploader = new FileUploader($obj);
                $obj.data('file-uploader', fileUploader);
            });
        });

        Util.initializePlugins();
    }
}

export = App;

