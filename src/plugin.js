'use strict';

var $ = require("jquery");

const elementClassName = "tinymce-graph";

const plugin = (editor, url) => {
  editor.addButton('graphTinymcePlugin', {
    text: false,
    image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHdpZHRoPSIyMDQ4IiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAyMDQ4IDE3OTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwNDggMTUzNnYxMjhoLTIwNDh2LTE1MzZoMTI4djE0MDhoMTkyMHptLTM4NC0xMDI0bDI1NiA4OTZoLTE2NjR2LTU3Nmw0NDgtNTc2IDU3NiA1NzZ6Ii8+PC9zdmc+',
    tooltip: 'Graphs editor',
    onclick: () => {
      tinymce.activeEditor.schema.addValidElements("img[*],svg[*],defs[*],pattern[*],desc[*],metadata[*],g[*],mask[*],path[*],line[*],marker[*],rect[*],circle[*],ellipse[*],polygon[*],polyline[*],linearGradient[*],radialGradient[*],stop[*],image[*],view[*],text[*],textPath[*],title[*],tspan[*],glyph[*],symbol[*],switch[*],use[*]");
      openGraphEditor();
    }
  });

  editor.addCommand('uploadGraph', function (file) {
    const insertBtn = $('#insertButton');
    insertBtn.attr('disabled', true);
    insertBtn.addClass('mce-disabled');
    insertBtn.attr('aria-disabled', true);

    const loading_element =
      '<div id="tinymce_upload_progress" style="height: 40px;">' +
      '<p style="padding: 10px 10px; margin: 0px">Uploading, please wait...</p>' +
      '<div style="position: absolute; height: 3px; background-color: black; width: 0%" id="tinymce_upload_progress_bar"></div>' +
      '</div>';

    $('.mce-reset .mce-container-body').first().before(loading_element);

    editor.settings.graph_uploader(file, function (content) {
      $('#tinymce_upload_progress').remove();

      insertBtn.attr('disabled', false);
      insertBtn.removeClass('mce-disabled');
      insertBtn.attr('aria-disabled', false);

      editor.execCommand('mceInsertContent', false, content);
      editor.windowManager.close();
    });
  });

  editor.on("click", function (e) {
    if (e.target.className === elementClassName) {
      var element = e.target;
      var graphData = element.getAttribute("graph-data");
      openGraphEditor(graphData);
    }
  });


  var openGraphEditor = function (graphData) {
    // Open window
    var frame = editor.windowManager.open({
      text: false,
      title: 'Graphs plugin',
      url: url + '/app/index.html',
      width: 800,
      height: 400,

      buttons: [{
        text: 'Insert',
        classes: 'widget btn primary first abs-layout-item',
        disabled: false,
        id: 'insertButton',
        onclick: function () {
          if ($('#insertButton').attr('disabled')) {
            return;
          }

          var iframeEl = window.GraphEditorFrame.$el.find("iframe")[0];

          // Get SVG Element
          var svgElement = iframeEl.contentDocument.getElementById("previewsvg");

          //get svg source.
          var serializer = new XMLSerializer();
          var source = serializer.serializeToString(svgElement);

          //convert svg source to URI data scheme.
          var blob = new Blob([source], {type: "image/svg+xml"});

          // Get size:
          var width = svgElement.getAttribute("width");
          var height = svgElement.getAttribute("height");

          editor.execCommand('uploadGraph', {
            html: svgElement.outerHTML,
            blob: blob,
            width: width,
            height: height,
            graphData: iframeEl.contentWindow.graphData
          });
        }
      }, {
        text: 'Close',
        onclick: 'close'
      }]
    }, {
      graphData: graphData,
      // isnew: true,
      // sscr: "0,7.5,-5,5,1,1,1,1,1,300,200",
      width: 300,
      height: 200
    });

    window.GraphEditorFrame = frame;
  }
};

export default plugin;
