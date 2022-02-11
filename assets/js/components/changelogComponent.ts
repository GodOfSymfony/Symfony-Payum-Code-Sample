// TODO Refactor this implementation in the near future.
class ChangeLogComponent {
    private $wrapper:JQuery;
    private $container:JQuery;
    private $header:JQuery;
    private $overlay:JQuery;

    constructor(changelogWrapper:JQuery) {
        this.$wrapper = changelogWrapper;
        this.$container = this.$wrapper.find('.changelog-container');
        this.$header = this.$container.find('.changelog-header');
        this.$overlay = this.$wrapper.find('changelog-overlay');

        this.initializeChangeLog();
    }

    private initializeChangeLog() {
        this.$header.on('click', (e) => {
            if (!this.$wrapper.hasClass('active')) {
                this.$wrapper.addClass('active');
            } else {
                this.$wrapper.removeClass('active');
            }
        });
    }
}

export = ChangeLogComponent;
