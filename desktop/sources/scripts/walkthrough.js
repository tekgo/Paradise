function Walkthrough()
{
  this.benchmark = [

    "transform into a cat",
    "transmute into gold",
  ]

  this.basics = [
    "warp to the library",
    "create a yellow house",
    "become the yellow house",
    "become the ghost",
    "enter the yellow house",
    "leave"
  ]

  this.warping = [
    "warp to the library",
    "create a red house",
    "create a blue house",
    "create a yellow house",
    "warp to any house",
    "warp into any house",
    "warp to the red house",
    "warp into the red house",
    "leave"
  ]

  this.inventory = [
    "warp to the library",
    "create a red house",
    "create a blue house",
    "create a yellow house",
    "take the yellow house",
    "drop any house",
  ]

  this.programing = [
    "warp to the library",
    "create a red house",
    "create a blue house",
    "create a yellow house",
    "enter the blue house",
    "program warp into any house",
    "usage open",
    "leave",
    "open the blue house",
    "leave"
  ]

  this.metas = [
    "warp to the library",
    "create a red house",
    "create a blue house",
    "create a yellow house",
    "inspect the red house",
    "help",
    "help with program",
    "help with use",
    "help with usage",
    "note It is raining. Again."
  ]

  this.alchemy = [
    "warp to the library",
    // "transform into a cat",
    // "transmute into glass",
    "create a lead teacup",
    "transform the teacup into a house",
    // "transmute lead into gold"
  ]

  this.all = []
  this.all = this.all.concat(this.warping)
  this.all = this.all.concat(this.inventory)
  this.all = this.all.concat(this.programing)
  this.all = this.all.concat(this.basics)
  this.all = this.all.concat(this.metas)
  this.all = this.all.concat(this.alchemy)

  this.index = 0;
  this.speed = 500;

  this.start = function(speed = 1000)
  {
    this.speed = speed;
    this.index = 0;
    this.run()
  }

  this.run = function(target = this.alchemy)
  {
    client.query(0,target[this.index]);
    this.index += 1

    if(target[this.index]){
      setTimeout(()=>{
        this.run();
      },this.speed)
    }
  }

}