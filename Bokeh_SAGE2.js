//
// SAGE2 application: Bokeh_SAGE2
// by: Joshua Shorenstein <jshorenstein@ucsd.edu>
//
// Copyright (c) 2015
//

function addCSS(url) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", url);
    document.head.appendChild(fileref);
}

var Bokeh_SAGE2 = SAGE2_App.extend( {
    init: function(data) {
        // Create div into the DOM
        this.SAGE2Init("div", data);
        // Set the background to black
        var idNum = Math.floor((Math.random() * 600000) + 1);
        this.element.style.backgroundColor = 'white';
        this.element.id = "BokehPane" + idNum;
        addCSS(this.resrcPath + "bootstrap.min.css");
        addCSS(this.resrcPath + "bokeh.css");
        this.server_url = this.state.server;
        this.bokehDoc = this.state.bokehDocument;
        //Set up needed settings for bokeh
        this.container_div = document.createElement('div');
        this.container_div.style.height = "100%";
        this.container_div.style.width = "100%";
        this.container_div.style.margin = "0px";
        this.container_div.classList.add("plotdiv");
        this.container_div.id = "BokehInnerPane" + idNum;
        this.ident = this.container_div.id;
        this.element.appendChild(this.container_div);
        //var login_url = this.server_url + "bokeh/login?username=" + this.state.username + '&password=' + this.state.password;
        //var xhttp = new XMLHttpRequest();
        //xhttp.open("POST", login_url, false);
        //xhttp.send();

        // move and resize callbacks
        this.server = "continuous";
        this.moveEvents = "continuous";
        // SAGE2 Application Settings
        //
        // Not adding controls but making the default buttons available
        this.initializeWidgets();
    },

    initializeWidgets: function() {
        this.controls.addTextInput({value: this.bokehDoc, position: 13, label: "Doc", identifier: "document"});
        this.controls.addTextInput({value: this.server_url, position: 10, label: "Server", identifier: "server"});
        this.controls.finishedAddingControls();
        this.enableControls = true;
    },

    load: function(date) {
        console.log('Bokeh_SAGE2> Load with state value', this.state.value);

    },

    draw: function(date) {
        console.log('Bokeh_SAGE2> Draw with state value', this.state.value);
        var doc = this.bokehDoc;
        var url = this.server_url;
        var ident = this.ident;
        Bokeh.$(function() {
            var docs_json = {};
            var render_items = [{"elementid":ident,"sessionid":doc,"use_for_title":true}];
            Bokeh.embed.embed_items(docs_json, render_items, "ws://"+url+"/ws");
        });
    },

    resize: function(date) {
    },

    move: function(date) {
    },

    event: function(eventType, position, user_id, data, date) {
        if (eventType === "widgetEvent") {
            switch (data.identifier){
                case "server":
                    this.server_url = data.text;
                    this.refresh(date);
                    break;
                case "document":
                    this.bokehDoc = data.text;
                    this.refresh(date);
                    break;
                default:
                    console.log("No handler for:", data.identifier);
                    return;
            }
        }
    }
});
