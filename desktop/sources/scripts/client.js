function Client()
{
  this.controller = new Controller();
  this.walkthrough = new Walkthrough();

  this.id = 0;

  this.el = null;
  this.input = null;
  this.h1   = null;
  this.page = null;
  this.note = null;
  this.view = null;
  this.tips = null;
  this.action = null;
  this.reaction = null;

  this.docs = {}
  this.visibles = []

  this.start = function()
  {
    this.controller.add("default","*","About",() => { require('electron').shell.openExternal('https://github.com/hundredrabbits/Left'); },"CmdOrCtrl+,");
    this.controller.add("default","*","Fullscreen",() => { app.toggle_fullscreen(); },"CmdOrCtrl+Enter");
    this.controller.add("default","*","Hide",() => { app.toggle_visible(); },"CmdOrCtrl+H");
    this.controller.add("default","*","Inspect",() => { app.inspect(); },"CmdOrCtrl+.");
    this.controller.add("default","*","Documentation",() => { client.controller.docs(); },"CmdOrCtrl+Esc");
    this.controller.add("default","*","Reset",() => { client.reset(); },"CmdOrCtrl+Backspace");
    this.controller.add("default","*","Quit",() => { app.exit(); },"CmdOrCtrl+Q");

    this.controller.add("default","File","New World",() => { client.reset(); },"CmdOrCtrl+Shift+N");
    this.controller.add("default","File","Import World",() => { client.import(); },"CmdOrCtrl+Shift+O");
    this.controller.add("default","File","Export World",() => { client.export(); },"CmdOrCtrl+Shift+S");
    
    this.controller.add_role("default","Edit","undo");
    this.controller.add_role("default","Edit","redo");
    this.controller.add_role("default","Edit","cut");
    this.controller.add_role("default","Edit","copy");
    this.controller.add_role("default","Edit","paste");
    this.controller.add_role("default","Edit","delete");
    this.controller.add_role("default","Edit","selectall");
    this.controller.add("default","Edit","Autocomplete",() => { this.input.complete(); },"Tab");

    this.controller.commit();

    this.el = document.body;
    this.h1 = document.getElementById("h1");
    this.page = document.getElementById("page");
    this.note = document.getElementById("note");
    this.view = document.getElementById("view");
    this.tips = document.getElementById("tips");
    this.action = document.getElementById("action");
    this.input = new Commander(document.getElementById("input"),document.getElementById("hint"));
    this.reaction = document.getElementById("reaction");

    // Events
    this.input.el.oninput   = (key) => { this.input.update(key); };
    this.input.el.onkeydown = (key) => { if(key.key == "Tab"){ this.input.complete(); } }
    this.input.el.onkeyup   = (key) => { if(key.key == "Enter"){ this.input.validate(); } };

    this.query();
  }

  this.query = function(id = this.id,q = "")
  {
    console.info(this.id,q)
    this.el.className = "loading"
    setTimeout(()=>{ 
      this.update(parade.query(this.id,q))
      this.el.className = "ready" 
    },250)
  }

  this.update = function(response)
  {
    this.h1.innerHTML = response.sight.h1
    this.page.innerHTML = response.sight.page
    this.view.innerHTML = response.sight.view

    // Note

    this.note.className = response.sight.note ? 'visible' : 'hidden'
    this.note.innerHTML = response.sight.note ? response.sight.note : ''

    // Reaction
    this.reaction.className = response.sight.reaction ? 'visible' : 'hidden'
    this.reaction.innerHTML = response.sight.reaction ? response.sight.reaction : ''

    // Action
    this.action.className = response.sight.action ? 'visible' : 'hidden'
    this.action.innerHTML = response.sight.action ? response.sight.action : ''

    // Become
    if(response.become){
      this.change_vessel(response.become)
    }

    // Tips
    var html = ""
    for(id in response.sight.tips){
      var tip = response.sight.tips[id];
      html += `<ln>${tip}</ln>`;
    }
    this.tips.innerHTML = html

    this.docs = response.docs
    this.visibles = response.visibles

    this.input.update();
  }

  this.change_vessel = function(id)
  {
    if(!id || id == this.id){ return; }

    this.id = id;
    setTimeout(()=>{ this.query(); }, 500)
  }

  // 

  this.reset = function()
  {

  }

  this.import = function()
  {
    var paths = dialog.showOpenDialog({properties: ['openFile'],filters:[{name:"Paradise World",extensions:["teapot"]}]});

    if(!paths){ console.log("Nothing to load"); return; }

    fs.readFile(paths[0], 'utf-8', (err, data) => {
      if(err){ alert("An error ocurred reading the file :" + err.message); return; }
      parade.import(JSON.parse(data))
    });
  }

  this.export = function()
  {
    dialog.showSaveDialog((fileName) => {
      if (fileName === undefined){ return; }
      fs.writeFile(fileName+".teapot", parade.export());
    });
  }

  // Misc

  this.reset = function()
  {
    console.warn("ERASE!")
  }

  document.onclick= function(event)
  {
    if(event===undefined){ event = window.event; }
    var target = 'target' in event? event.target : event.srcElement;
    if(target.tagName.toLowerCase() == "action"){
      client.input.inject(target.getAttribute("data"))
    }
  };
}