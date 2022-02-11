/// <amd-dependency path="jquery.flot.pie">

import $ = require('jquery');

class PieChart {
    private $pieContainer:string;
    private $info;

    constructor(options) {
        this.$pieContainer = options.pieContainer;
        this.$info = options.info;

        this.initializePieChart();
    }

    private initializePieChart() {
        //var info = ;
        var data = [
            { label: 'Registrations', color: '#404040',  data: this.$info.registration},
            { label: 'Renewals', color: '#374A62', data: this.$info.renewal},
        ];

        $.plot(this.$pieContainer, data, {
            series: {
                pie: {
                    show: true

                }
            },
            legend: {
                show: true
            }
        });

    }

}

export = PieChart;
