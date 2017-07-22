'use strict';

var types = {
  func: ["sin(x)"],
  polar: ["t"],
  param: ["sin(t)", 'cos(t)'],
  slope: ["x*y", '1']
};

var defValues = {
  func: ["f(x)"],
  polar: ["r(t)"],
  param: ["f(t)", 'g(t)'],
  slope: ["dy/dx (x,y)", 'every']
};

window.graphData = {
  grid: undefined,
  graphs: undefined
};

if (top.tinymce.activeEditor.windowManager.getParams().graphData) {
  window.graphData = JSON.parse(top.tinymce.activeEditor.windowManager.getParams().graphData);
}

angular.module('appSrcApp', []).controller('MainCtrl', function () {
  var defaultGraph = {
    type: Object.keys(types)[0],
    lineColor: 'black',
    lineType: 'none',
    lineSize: '1'
  };

  this.defValues = defValues;

  this.grid = window.graphData.grid || {
      width: top.tinymce.activeEditor.windowManager.getParams().width,
      height: top.tinymce.activeEditor.windowManager.getParams().height,
      xMin: -7.5,
      xMax: +7.5,
      xStep: 1,
      yMin: -5,
      yMax: +5,
      yStep: 1,
      showLabels: true,
      showBackgroundGrid: true
    };

  this.graphs = window.graphData.graphs || [];

  this.selectGraph = function (graph) {
    this.selectedGraph = graph;
    this.showGridProperties = false;
    this.updateFunction();
    this.showGraphStyle = false;
  };

  this.addGraph = function () {
    let graph = JSON.parse(JSON.stringify(defaultGraph));
    graph.id = Date.now();

    this.graphs.push(graph);
    this.selectGraph(graph);
    this.updateType();
  };

  this.showGridPropertiesScreen = function () {
    this.showGridProperties = true;
    this.selectedGraph = {};
  };

  this.submit = function () {
    this.saveGraphData();
    AsciisvgDialog.graphit(this.grid, this.graphs);
  };

  this.updateFunction = function () {
    if (!this.selectedGraph['function']) {
      this.selectedGraph['function'] = types[this.selectedGraph.type][0];
    }
    this.selectedGraph.function2 = types[this.selectedGraph.type][1];
  };

  this.updateType = function () {
    this.selectedGraph['function'] = types[this.selectedGraph.type][0];
    this.selectedGraph.function2 = types[this.selectedGraph.type][1];
  }

  this.deleteGraph = function () {
    var con = confirm("Are you sure?");

    if (con) {
      var index = this.graphs.indexOf(this.selectedGraph);
      this.graphs.splice(index, 1);

      this.selectGraph(this.graphs[0]);
    }
  };

  this.saveGraphData = function () {
    window.graphData = JSON.stringify({
      graphs: this.graphs,
      grid: this.grid
    });
  }

  if (this.graphs.length === 0) {
    this.addGraph();
  } else {
    this.selectGraph(this.graphs[0]);
  }

  // this.saveGraphData();
  setTimeout(() => {
    this.submit();
  }, 10);

  document.getElementById('main').style.visibility = 'visible';
});
