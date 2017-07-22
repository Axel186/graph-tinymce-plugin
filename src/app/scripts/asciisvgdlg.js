var AsciisvgDialog = {
  width: 300,
  height: 200,
  alignm: "middle",
  sscr: "",
  isnew: null,
  AScgiloc: null,

  init: function () {
    var f = document.forms[0];

    // Get the selected contents as text and place it in the input
    this.width = top.tinymce.activeEditor.windowManager.getParams().width;
    this.height = top.tinymce.activeEditor.windowManager.getParams().height;
    this.isnew = top.tinymce.activeEditor.windowManager.getParams().isnew;
    this.sscr = top.tinymce.activeEditor.windowManager.getParams().sscr;
  },

  graphit: function (grid, graphs) {
    ed = top.tinymce.activeEditor;
    var commands;
    commands = "";

    initialized = false;

    m_xmin = grid.xMin; //document.getElementById("xmin").value;
    m_xmax = grid.xMax; //document.getElementById("xmax").value;
    m_ymin = grid.yMin; //document.getElementById("ymin").value;
    m_ymax = grid.yMax; //document.getElementById("ymax").value;
    if (m_ymin == "") m_ymin = null
    if (m_ymax == "") m_ymax = null
    commands += m_xmin + ',' + m_xmax + ',' + m_ymin + ',' + m_ymax + ',';

    m_xscl = grid.xStep; //document.getElementById("xscl").value;
    m_yscl = grid.yStep; //document.getElementById("yscl").value;
    if (m_xscl == "") m_xscl = null
    if (m_yscl == "") m_yscl = null

    // if (document.getElementById("labels").checked) {
    if (grid.showLabels) {
      m_labels = '1';
    } else {
      m_labels = 'null';
    }

    // if (document.getElementById("grid").checked) {
    if (grid.showBackgroundGrid) {
      m_grid = ',' + m_xscl + ',' + m_yscl;
    } else {
      m_grid = ',null,null';
    }
    commands += m_xscl + ',' + m_yscl + ',' + m_labels + m_grid;

    // commands += ',' + document.getElementById("gwidth").value + ',' + document.getElementById("gheight").value;
    commands += ',' + grid.width + ',' + grid.height;


    // graphs = document.getElementById("graphs");
    for (i = 0; i < graphs.length; i++) {
      var properties = [
        graphs[i].type,
        graphs[i]['function'],
        graphs[i].function2 || 'null',
        0,
        0,
        graphs[i].from,
        graphs[i].to,
        graphs[i].lineColor,
        graphs[i].lineSize,
        graphs[i].lineType
      ];

      // func,sin(x),null,0,0,,,black,1,none
      // commands += ',' + graphs.options[i].value;
      commands += ',' + properties.join(',');
    }

    this.width = grid.width; //document.getElementById("gwidth").value;
    this.height = grid.height; //document.getElementById("gheight").value;
    this.sscr = commands;
    this.alignm = "text-top"; //document.getElementById("alignment").value;
    if (ASnoSVG) {
      pvimg = document.getElementById("previewimg");
      pvimg.src = this.AScgiloc + '?sscr=' + encodeURIComponent(commands);
      ed.dom.setStyle(pvimg, "width", this.width + 'px');
      ed.dom.setStyle(pvimg, "height", this.height + 'px');
    } else {
      pvsvg = document.getElementById("previewsvg");
      parseShortScript(commands, this.width, this.height);
    }
  }
};

