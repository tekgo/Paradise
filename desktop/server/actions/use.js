Wildcard = require('../wildcard')

function Use(host)
{
  require(`../action`).call(this,host,"use");

  this.docs = "Trigger a vessel's program."

  this.operate = function(params)
  {
    if(params.trim() == ""){ return `<p>Huh?! For more details on how to use, type <action data='help with use'>help</action>.</p>`; }

    var target = this.find(params,this.host.usables());

    if (!target) {
      return this.err_NOTARGET(params,"available")
    }

    if (!target.usable()) {
      return `<p><action>${target}</action> cannot be used.</p>`
    }

    if(target.data.program.indexOf("@and") > -1){
      var cmds = target.data.program.split("@and")
      for(id in cmds){
        var cmd = cmds[id].trim()
        this.host.cmd(new Wildcard(cmd,params).toString(false))
      }
    }
    else{
      this.host.cmd(new Wildcard(target.data.program,params).toString(false))
    }
    return target.data.reaction ? `<p>${new Wildcard(target.data.reaction,params).toString(false)}</p>` : `<p>You used <action>${target}</action>.</p>`
  }
}

module.exports = Use