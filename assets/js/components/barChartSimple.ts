/// <amd-dependency path="jquery.flot">

import $ = require('jquery');

class BarChartSimple {
    private $barContainer: string;
    private $labelContainer: string;
    private $label: string;
    private $info;

    constructor(options) {
        this.$barContainer = options.chartContainer;
        this.$labelContainer = options.labelContainer;
        this.$label = options.label;
        this.$info = options.info;
        this.initializeBarsChart();
    }

    private initializeBarsChart() {

        var dataset = [{
            label: '<label>Invoiced</label><br><strong>' + this.$info.total + '</strong>',
            data: this.$info.value,
            color: ['#404040'],
            bars: {
                show: true,
                lineWidth: 1,
                barWidth: 0.50,
                order: 1,
                fillColor: {
                    colors: ['#737373', '#404040']
                }
            }
        }];

        var options = {
            xaxis: {
                show: true,
                axisLabel: '',
                color: '#ffffff',
                ticks: this.$info.ticks
            },
            yaxis: {
                axisLabel: '',
                position: 'left',
                color: '#404040',
                axisLabelPadding: 3
            },
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
                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;
                    $('#tooltip').remove();

                    //console.log(item);
                    var y = item.datapoint[1];
                    var color = item.series.color;
                    var toolTipMsg = '<strong>' + this.$label + ': ' + y + '</strong>';

                    this.showTooltip(item.pageX,
                        item.pageY,
                        color,
                        toolTipMsg
                    );
                }
            } else {
                $('#tooltip').remove();
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

export = BarChartSimple;
