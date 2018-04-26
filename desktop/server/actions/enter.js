function Enter(host)
{
  require(`../action`).call(this,host,"enter");

  this.docs = "Enter a visible vessel."
  
  this.operate = function(params)
  {
    var target = this.find_target(params,this.host.siblings());

    if(target){
      this.host.move(target)
    }
    else{
      console.log(`! missing ${params}`)
    }
  }
}

module.exports = Enter