/// <amd-dependency path="jquery.fileupload">
/// <amd-dependency path="jquery.guillotine">

import $ = require('../vendor/jquery-2.1.4');
import _ = require('lodash');

class FileUploader {
    private $container:JQuery;
    private $fileInput:any;
    private $fileHidden:JQuery;
    private $form:JQuery;

    constructor($container:JQuery) {
        this.$container = $container;
        this.$fileInput = $('input[type="file"]', this.$container);
        this.$fileHidden = $('.file-hidden', this.$container);
        this.$form = this.$container.parents('form');

        this.$fileInput.fileupload({
            url: Routing.generate('upload_file'),
            dataType: 'json',
            maxFileSize: 10485760, // 10 MB
            formData: { sessionId: fileUploaderSessionId },
            send: _.bind(this.onUploadSend, this),
            fail: _.bind(this.onUploadFail, this),
            done: _.bind(this.onUploadDone, this),
            sequentialUploads: true
        });

        this.initializeEvents();
    }

    private initializeEvents() {
        this.$container.on('click', '.delete-item', (e) => {
            e.preventDefault();

            let $current = $(e.currentTarget);
            let file = $current.parent().data('filename');

            this.removeFile(file);
            $current.parent().remove();
        });
    }

    private onUploadSend(e, data) {
        this.$form.addClass('loading');
        $('.file-uploader-error', this.$container).html('').hide();
        this.$container.removeClass('is-invalid');
    }

    private onUploadFail(e, data) {
        this.$form.removeClass('loading');
        this.$container.addClass('is-invalid');
        $('.file-uploader-error', this.$container).html('Something went wrong').show();
    }

    private onUploadDone(e, data) {
        var file = data.result ? data.result.file : null;

        if (!data.result || !file || file.error) {
            this.onUploadFail(e, data);

            return;
        }

        this.addFile(file);
        this.$form.removeClass('loading');

        let html = '<li data-filename="' + file + '">' + file + '<a href="#" class="delete-item"><span class="icon-remove_cancel"></span></a></li>';
        $('.files-container', this.$container).append(html);
    }

    private addFile(file) {
        let fileHidden = this.$fileHidden.val();
        if (fileHidden == '') {
            fileHidden = file;
        } else {
            let temp = fileHidden.split(',');
            temp.push(file);
            fileHidden = temp.join(',');
        }

        this.$fileHidden.val(fileHidden);
        this.$fileHidden.change();
    }

    private removeFile(file) {
        let fileHidden = this.$fileHidden.val();

        let temp = fileHidden.split(',');
        fileHidden = $.grep(temp, function(value) {
            return value != file;
        }).join(',');

        this.$fileHidden.val(fileHidden);
    }
}

export = FileUploader;
