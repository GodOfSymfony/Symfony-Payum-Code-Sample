/// <amd-dependency path="jquery.flot">
/// <amd-dependency path="jquery.flot.orderBars">

import $ = require('jquery');

class BarChartMulti {
    private $barContainer: string;
    private $labelContainer: string;
    private $label: string;
    private $info;

    protected colors = ['#404040', '#374A62'];
    protected gradients = [
        ['#737373', '#404040'],
        ['#293647', '#374A62']

    ];

    constructor(options) {
        this.$barContainer = options.chartContainer;
        this.$labelContainer = options.labelContainer;
        this.$label = options.label;
        this.$info = options.info;

        this.initializeBarsChart();
    }

    private initializeBarsChart() {

        var dataset = [];

        $.each( this.$label, function( key, label ) {
            var pos = key + 1;
            var barData = this.$info[key];
            dataset.push({
                label: '<label>' + label + '</label><br><strong>' + barData.total + '</strong>',
                data: barData.value,
                color: this.colors[key],
                bars: {
                    show: true,
                    lineWidth: 1,
                    barWidth: 0.40,
                    order: pos,
                    fillColor: {
                        colors: this.gradients[key]
                    }
                }

            });

        }.bind(this));

        var ticks = this.$info.ticks;

        var options = {
            xaxis: {
                show: true,
                axisLabel: '',
                color: '#ffffff',
                ticks: ticks
            },
            yaxes: [{
                position: 'left',
                color: '#404040',
                axisLabelPadding: 3
            }, {
                position: 'right',
                color: '#404040',
                axisLabelPadding: 67
            }],
            legend: {
                noColumns: 0,
                labelBoxBorderColor: '#000000',
                container: this.$labelContainer,
            },
            grid: {
                hoverable: true,
                borderWidth: 0,
                backgroundColor: { colors: ['#ffffff', '#ffffff'] }
            }
        };

        $.plot(this.$barContainer, dataset, options);
        this.useToolTip();
    }

    private useToolTip() {

        var previousPoint = null, previousLabel = null;
        $(this.$barContainer).bind('plothover', function (event, pos, item) {
            if (item) {
                //console.log(item);
                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;
                    $('#tooltip').remove();

                    var y = item.datapoint[1];
                    var color = item.series.color;
                    var toolTipMsg = '<strong>' + this.$label[item.seriesIndex] + ': ' + y + '</strong>';

                    this.showTooltip(item.pageX,
                        item.pageY,
                        color,
                        toolTipMsg
                    );
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        }.bind(this));
    }

    private showTooltip(x, y, color, contents) {
        $('<div id="tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y - 40,
            left: x - 60,
            border: '2px solid ' + color,
            padding: '3px',
            'font-size': '9px',
            'border-radius': '5px',
            'background-color': '#fff',
            'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
            opacity: 0.9
        }).appendTo('body').fadeIn(200);
    }
}

export = BarChartMulti;
