function Enter(host)
{
  require(`../action`).call(this,host);

  this.operate = function(params)
  {
    console.log(`Enter..${params}`)

    var target = this.find_target(params,this.host.siblings());

    if(target){
      this.host.move(target)
    }
    else{
      console.log(`missing:${target.to_s()}`)
    }
  }

  this.reaction = function()
  {
    return "You are entering.."
  }
}

module.exports = Enter