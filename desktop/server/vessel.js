let basic = {
  name: "ghost",
  attr: "hungry",
  parent: 0,
  owner: -1,
}

function Vessel(data = basic)
{
  this.parade = null
  this.data = data;

  this.cmd = function(str)
  {
    console.log(str)
    var parts = str.split(" ")
    return this.act(parts.splice(0,1)[0],parts.join(' '))
  }

  this.act = function(action,params)
  {
    const responder = this.response(action)
    return new responder(this).run(params,action)
  }

  this.response = function(action)
  {
    try{
      return require(`./actions/${action}`);
    }
    catch(err){
      return require(`./action`);
    } 
  }

  this.set = function(key,value)
  {
    console.log(`- set ${this.name()} ${key}='${value}'`)
    this.data[key] = value;
  }

  this.move = function(target)
  {
    this.set("parent",target.id)
  }

  this.parent = function()
  {
    return this.parade.world[this.data.parent]
  }

  this.owner = function()
  {
    return this.parade.world[this.data.owner]
  }

  this.is_circular = function()
  {
    // find Root
    var known = []
    var v = this.parent()
    var i = 0
    while(i < 50){
      if(v.is_paradox()){ return false; }
      if(known.indexOf(v.id) > -1){ return true; }
      known.push(v.id)
      v = v.parent()
      i += 1
    }
    return false;
  }

  this.stem = function()
  {
    // find Root
    var known = []
    var v = this.parent()
    var i = 0
    while(i < 50){
      if(v.parent().is_paradox() || known.indexOf(v.id) > -1){
        return v
        break;
      }
      i += 1
      known.push(v.id)
    }
    return this;
  }

  // Helpers

  this.is = function(str)
  {
    var parts = str.split(" ")
    var last_word = parts[parts.length-1].toLowerCase();

    if(last_word == this.data.name){
      return true;
    }
    return false;
  }

  this.siblings = function()
  {
    var a = []
    for(id in this.parade.world){
      var vessel = this.parade.world[id];
      if(vessel.is_paradox()){
        continue;
      }
      if(vessel.parent().id == this.parent().id && vessel.id != this.id){
        a.push(vessel)
      }
    }
    return a
  }

  this.children = function()
  {
    var a = []
    for(id in this.parade.world){
      var vessel = this.parade.world[id];
      if(vessel.parent().id == this.id && vessel.id != this.id){
        a.push(vessel)
      }
    }
    return a
  }

  this.usables = function()
  {
    var a = []
    a = a.concat(this.siblings())
    a = a.concat(this.children())
    return a
  }

  // Checks

  this.is_paradox = function()
  {
    return this.parent().id == this.id ? true : false
  }

  this.is_program = function()
  {
    return this.data.program ? true : false
  }

  // Formatters

  this.to_h = function()
  {
    return this.data
  }

  this.to_a = function(show_particle = true)
  {     
    return `${show_particle ? this.particle()+" " : ''}<action data='${this.action()}'>${this.name()}</action>`
  }

  this.particle = function()
  {
    if(this.data.attr){ return "the"; }
    var letter = this.data.name.substr(0,1).toLowerCase();
    return letter == "a" || letter == "e" || letter == "i" || letter == "o" || letter == "u" ? "an" : "a"
  }

  this.name = function()
  {
    return `${this.data.attr ? this.data.attr+' ' : ''}${this.data.name}`
  }

  this.type = function()
  {
    if(this.data.program){ return `program` }
    if(this.data.note){ return `location` }

    return `vessel`
  }

  this.usable = function()
  {
    return this.usage() !== false;
  }

  this.usage = function()
  {
    if (this.data.usage) {
      return this.data.usage.split(" ");
    }
    if (this.is_program()) {
      return 'use';
    }
    return false;
  }

  this.action = function()
  {
    var action = `warp into the ${this.name()}`

    // Inventory
    if(this.data.parent == parade.ghost().id){
      if(this.is_program()){
        action = `${this.usage()} ${this.name()}`
      }
      else{
        action = `drop the ${this.name()}`        
      }
    }
    else if(this.data.parent == parade.ghost().data.parent){ // Is Visible
      if(this.is_program()){
        action = `${this.usage()} ${this.name()}`
      }
      else{
        action = `enter the ${this.name()}`  
      }
    }

    return action
  }

  this.toString = function()
  {
    return `${this.particle()} ${this.name()}`;
  }
}

module.exports = Vessel