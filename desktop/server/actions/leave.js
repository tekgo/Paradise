function Leave(host)
{
  require(`../action`).call(this,host);

  this.operate = function(params)
  {
    this.host.move(this.host.parent().parent())
  }

  this.reaction = function()
  {
    return "You are leaving.."
  }
}

module.exports = Leave