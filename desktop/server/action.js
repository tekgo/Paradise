function Action(host,name)
{
  this.name = name;
  this.host = host;
  this.docs = `No documentation for '${name}'`

  this.run = function(params = "")
  {
    this.operate(params);

    var h = {
      sight: {
        h1:`You are ${this.host} in ${this.host.parent()}.`,
        page:`-${this.host.parent().id}-`,
        note:`${this.host.parent().data.note}`,
        view:`You see..`,
        tips:`<ln>No tips..</ln>`,
        reaction: this.reaction()
      },
      docs: this.documentation()
    }
    return h
  }

  this.reaction = function()
  {
    return ""
  }

  this.operate = function()
  {
    return ""
  }

  // Parsers

  this.find_target = function(target,a)
  {
    for(id in a){
      var vessel = a[id];
      if(vessel.is(target)){
        return vessel
      }
    }
    return null
  }

  this.documentation = function()
  {
    var actions = {}

    var _actions = {
      create:require('./actions/create'),
      become:require('./actions/become'),
      enter:require('./actions/enter'),
      leave:require('./actions/leave'),

      help:require('./actions/help'),
      warp:require('./actions/warp'),
      take:require('./actions/take'),
      drop:require('./actions/drop'),

      move:require('./actions/move'),
      note:require('./actions/note'),
      transform:require('./actions/transform'),
      transmute:require('./actions/transmute'),

      inspect:require('./actions/inspect'),
      program:require('./actions/program'),
      use:require('./actions/use'),
      cast:require('./actions/cast'),
    }
    
    for(id in _actions){
      var action = new _actions[id]
      actions[id] = action.docs
    }
    return actions
  }

  String.prototype.to_base = function()
  {
    return this.toLowerCase().replace(/ /g,"_").replace(/[^0-9a-z\+]/gi,"").trim();
  }
}

module.exports = Action