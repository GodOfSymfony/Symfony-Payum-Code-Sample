/// <amd-dependency path="jquery.flot.pie">

import $ = require('jquery');

class PieChart {
    private $ContainerPie:string;

    constructor() {
        this.$ContainerPie = '#dashbord-pie';
        /**/
        this.initializePieChart();
    }

    private initializePieChart() {
        //var info = ;
        var data = [
            { label: 'Bus(ses)',  data: 6},
            { label: 'SUV',  data: 5},
            { label: 'Electric',  data: 5},
            { label: 'Air/planes',  data: 4},
            { label: 'Bikes',  data: 3},
            { label: 'Crossover',  data: 3},
            { label: 'Minivan',  data: 2},
            { label: 'Taxis',  data: 2},
            { label: 'Trucks',  data: 2},
            { label: 'Ship', data: 2}
        ];

        $.plot(this.$ContainerPie, data, {
            series: {
                pie: {
                    show: true,
                    label: {
                        show: true,
                        formatter: function (label, series) {
                            // tslint:disable-next-line:max-line-length
                            return '<div style="font-size:9pt;text-align:center;padding:2px;color:' + series.color + ';">' + label + '<br/>' + series.data[0][1] + '</div>';
                        }
                    }
                }
            },
            legend: {
                show: false
            }
        });

    }

}

export = PieChart;
