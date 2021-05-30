function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// colors
var blue = '#0062FF';
var blueOpacity = '#e6efff';
var blueLight = '#50B5FF';
var orange = '#FF974A';
var orangeOpacity = '#fff5ed';
var yellow = '#FFC542';
var green = '#3DD598';
var greenOpacity = '#ecfbf5';
var gray = '#92929D';
var grayLight = '#E2E2EA';
var borderColor = "#F1F1F5";
var text = "#171725";

// charts
Apex.chart = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: 14,
  foreColor: gray
};

// sparklines (page circle administration)
(function () {
  var randomizeArray = function randomizeArray(arg) {
    var array = arg.slice();
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  // data for the sparklines that appear below header area
  var sparklineData = [7, 5, 4, 8, 6, 4, 3];

  var sparkOptions1 = {
    chart: {
      group: 'sparklines',
      type: 'line',
      height: 45,
      sparkline: {
        enabled: true
      }
    },
    fill: {
      opacity: 1
    },
    series: [{
      name: 'Sales',
      data: randomizeArray(sparklineData)
    }],
    labels: [].concat(_toConsumableArray(Array(7).keys())).map(function (n) {
      return '2020-09-0' + (n + 1);
    }),
    yaxis: {
      min: 0
    },
    xaxis: {
      type: 'datetime'
    },
    colors: [blue],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topRight',
        offsetX: 0,
        offsetY: 60
      }
    }
  };

  var sparkOptions2 = {
    chart: {
      group: 'sparklines',
      type: 'line',
      height: 45,
      sparkline: {
        enabled: true
      }
    },
    fill: {
      opacity: 1
    },
    series: [{
      name: 'Sales',
      data: randomizeArray(sparklineData)
    }],
    labels: [].concat(_toConsumableArray(Array(7).keys())).map(function (n) {
      return '2020-09-0' + (n + 1);
    }),
    yaxis: {
      min: 0
    },
    xaxis: {
      type: 'datetime'
    },
    colors: [blueLight],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topRight',
        offsetX: 0,
        offsetY: 60
      }
    }
  };

  var sparkOptions3 = {
    chart: {
      group: 'sparklines',
      type: 'line',
      height: 45,
      sparkline: {
        enabled: true
      }
    },
    fill: {
      opacity: 1
    },
    series: [{
      name: 'Sales',
      data: randomizeArray(sparklineData)
    }],
    labels: [].concat(_toConsumableArray(Array(7).keys())).map(function (n) {
      return '2020-09-0' + (n + 1);
    }),
    yaxis: {
      min: 0
    },
    xaxis: {
      type: 'datetime'
    },
    colors: [orange],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topRight',
        offsetX: 0,
        offsetY: 60
      }
    }
  };

  var sparkOptions4 = {
    chart: {
      group: 'sparklines',
      type: 'line',
      height: 45,
      sparkline: {
        enabled: true
      }
    },
    fill: {
      opacity: 1
    },
    series: [{
      name: 'Sales',
      data: randomizeArray(sparklineData)
    }],
    labels: [].concat(_toConsumableArray(Array(7).keys())).map(function (n) {
      return '2020-09-0' + (n + 1);
    }),
    yaxis: {
      min: 0
    },
    xaxis: {
      type: 'datetime'
    },
    colors: [yellow],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topRight',
        offsetX: 0,
        offsetY: 60
      }
    }
  };

  var spark1 = document.querySelector('#spark-1');
  var spark2 = document.querySelector('#spark-2');
  var spark3 = document.querySelector('#spark-3');
  var spark4 = document.querySelector('#spark-4');

  if (spark1 != null) {
    new ApexCharts(spark1, sparkOptions1).render();
  }

  if (spark2 != null) {
    new ApexCharts(spark2, sparkOptions2).render();
  }

  if (spark3 != null) {
    new ApexCharts(spark3, sparkOptions3).render();
  }

  if (spark4 != null) {
    new ApexCharts(spark4, sparkOptions4).render();
  }
})();

// chart total impressions (page circle administration)

// chart target’s percent (page circle administration)
(function () {
  var options = {
    series: [74],
    chart: {
      type: 'radialBar',
      offsetY: -20,
      foreColor: text,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: borderColor,
          margin: 0
        },
        dataLabels: {
          show: false
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      colors: blueLight
    }
  };

  var chart = document.querySelector('#chart-targets-percent');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart financial goals (page circle administration)

// chart earnings history (page performance)
(function () {
  var options = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [{
      data: [385, 444, 756, 430, 282, 333, 410, 190, 287, 615, 458, 255]
    }],
    colors: [blue],
    chart: {
      height: '100%',
      type: 'line',
      toolbar: {
        show: false
      }
    },
    grid: {
      borderColor: borderColor,
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        top: 0,
        left: 15,
        right: 0,
        bottom: 0
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      tooltip: {
        enabled: false
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      x: {
        show: false
      },
      custom: function custom(_ref2) {
        var labels = _ref2.labels,
            series = _ref2.series,
            seriesIndex = _ref2.seriesIndex,
            dataPointIndex = _ref2.dataPointIndex,
            w = _ref2.w;

        return '<div class="tooltip__box">' + '<span class="tooltip__title">Earning Details</span>' + '<span class="tooltip__line"><svg class="icon icon-arrow-bottom"><use xlink:href="img/sprite.svg#icon-arrow-bottom"></use></svg><span class="tooltip__text">Income</span> <span class="tooltip__price">$600</span></span>' + '<span class="tooltip__line"><svg class="icon icon-arrow-top"><use xlink:href="img/sprite.svg#icon-arrow-top"></use></svg><span class="tooltip__text">Income</span><span class="tooltip__price">$' + series[seriesIndex][dataPointIndex] + '</span></span>' + '</div>';
      }
    },
    markers: {
      strokeWidth: 0
    }
  };

  var chart = document.querySelector('#chart-earnings-history');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart sales figures (page circle overview)
(function () {
  var options = {
    labels: ['Task 1', 'Task 2', 'Task 3'],
    series: [{
      name: 'Learning Resources',
      data: [442, 380, 275]
    }, {
      name: 'Games',
      data: [375, 370, 435]
    }],
    colors: [blue, green],
    chart: {
      height: '100%',
      type: 'line',
      toolbar: {
        show: false
      }
    },
    grid: {
      borderColor: borderColor,
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        top: 0,
        left: 15,
        right: 0,
        bottom: 0
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      tooltip: {
        enabled: false
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      x: {
        show: false
      }
    }
  };

  var chart = document.querySelector('#chart-math-figures');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart hit rate (page circle overview)
(function () {
  var options = {
    series: [68],
    chart: {
      height: '100%',
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '86%'
        },
        track: {
          background: blueOpacity,
          margin: 0
        },
        dataLabels: {
          show: false
        }
      }
    },
    fill: {
      colors: blue
    }
  };

  var chart = document.querySelector('#chart-math-rate');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart deals (page circle overview)
(function () {
  var options = {
    series: [68],
    chart: {
      height: '100%',
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '86%'
        },
        track: {
          background: greenOpacity,
          margin: 0
        },
        dataLabels: {
          show: false
        }
      }
    },
    fill: {
      colors: green
    }
  };

  var chart = document.querySelector('#chart-math-deals');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart visitors (page circle overview)
(function () {
  var options = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    series: [{
      name: 'Visitors',
      data: [442, 380, 275, 430, 509, 463, 407, 533, 470]
    }],
    colors: [blue],
    chart: {
      height: '100%',
      type: 'line',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      }
    },
    grid: {
      borderColor: borderColor,
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    }
  };

  var chart = document.querySelector('#chart-math-visitors');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart counter cases (page circle overview)
(function () {
  var options = {
    series: [46],
    chart: {
      height: '100%',
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '86%'
        },
        track: {
          background: blueOpacity,
          margin: 0
        },
        dataLabels: {
          show: false
        }
      }
    },
    fill: {
      colors: blue
    }
  };

  var chart = document.querySelector('#chart-math-cases');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart counter applications (page circle overview)
(function () {
  var options = {
    series: [74],
    chart: {
      height: '100%',
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '86%'
        },
        track: {
          background: greenOpacity,
          margin: 0
        },
        dataLabels: {
          show: false
        }
      }
    },
    fill: {
      colors: green
    }
  };

  var chart = document.querySelector('#chart-math-applications');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart counter products (page circle overview)
(function () {
  var options = {
    series: [14],
    chart: {
      height: '100%',
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '86%'
        },
        track: {
          background: orangeOpacity,
          margin: 0
        },
        dataLabels: {
          show: false
        }
      }
    },
    fill: {
      colors: orange
    }
  };

  var chart = document.querySelector('#chart-math-products');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart sales report (page circle overview)
(function () {
  var options = {
    labels: ['Task 1', 'Task 2', 'Task 3'],
    series: [{
      name: 'Learning Resources',
      data: [5, 9, 6]
    }, {
      name: 'Games',
      data: [9, 8, 9]
    }],
    colors: [blue, green],
    chart: {
      height: '100%',
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    grid: {
      borderColor: borderColor,
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        left: 15,
        right: 0,
        bottom: 0
      }
    },
    stroke: {
      curve: 'smooth'
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        endingShape: 'rounded',
        columnWidth: '8%'
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      shared: true
    },
    xaxis: {
      axisBorder: {
        show: false,
        color: borderColor
      },
      axisTicks: {
        show: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  var chart = document.querySelector('#chart-math-sales-report');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();

// chart visitors all (page circle overview)
(function () {
  var options = {
    series: [2120, 1002, 1870, 5656],
    colors: [blue, orange, green, yellow],
    chart: {
      height: '100%',
      type: 'donut'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '91%',
          polygons: {
            strokeWidth: 0
          }
        },
        expandOnClick: false
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  };

  var chart = document.querySelector('#chart-visitors-all');
  if (chart != null) {
    new ApexCharts(chart, options).render();
  }
})();
