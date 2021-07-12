var button 
var inp
var heading 

var db

var pc
var gs

var car1, car2

var limit

var cars=[]

var replace

var f1
var obstacle


var cari1, cari2

var tracki
var rank = 0 
var finish = 2

// var f1
// var obstacle

var randomWidth
var randomHeight

function preload(){
cari1 = loadImage("car3.png")
cari2 = loadImage("car4.png")
tracki = loadImage("track.jpg")
f1 = loadImage("f1.png")
}

function setup(){

  db=firebase.database()

  var canvas=createCanvas(window.innerWidth,window.innerHeight);
  button = createButton("Join Game")
  button.position(930,800)
  button.mousePressed(playerEnter)
  button.style("backgroundColor", "grey")
  button.style("borderRadius", "100px")
  button.style("width", "100px")
  button.style("height", "100px")
  button.style("color", "midnightblue")
  button.style("fontWeight", "bold")
  button.style("fontSize", "25px")

  reset=createButton("Reset")
  reset.position(1130,800)
  reset.mousePressed(resetGame)
  reset.style("backgroundColor", "grey")
  reset.style("borderRadius", "100px")
  reset.style("width", "100px")
  reset.style("height", "100px")
  reset.style("color", "midnightblue")
  reset.style("fontWeight", "bold")
  reset.style("fontSize", "25px")

  db.ref("playercount").on("value", function(data){pc=data.val()})
  db.ref("gamestate").on("value", function(data){gs=data.val()})
  db.ref("Rank").on("value", function(data){rank=data.val()})

  inp=createInput().attribute("placeholder", "Username")
  inp.position(950,600)
  inp.style("borderRadius", "25px")
  inp.style("height", "50px")
  inp.style("textAlign", "center")
  inp.style("fontSize", "20px")
  inp.style("color", "midnightblue")

  heading=createElement("h2")
  heading.html("Car Racing Game")
  heading.position(window.innerWidth/2,window.innerHeight/2)

  car1=createSprite(500,500,20,20)
  car2=createSprite(400,500,20,20)
  // obstacle = createSprite(400,400,50,50)
  // obstacle.shapeColor = 'black'
  // obstacle = createSprite()

  car1.addImage("car", cari1)
  car2.addImage("car", cari2)

  // obstacle.addImage("obstacle", f1)

  randomWidth = random(100,1000)
  randomHeight = random(100,1000)
  
  cars=[car1, car2]
  obstacle = createSprite(randomWidth, randomHeight,50,50)
  obstacle.shapeColor = 'black'


  // randomWidth = random(100,1000)
  // randomHeight = random(100,1000)
}
function draw()
{
  background(100);
  
  if(pc === 2){
    gs = "play"
    db.ref("/").update({gamestate:gs})
    heading.hide()
    greeting.hide()
  }

  if(gs === "play" && limit === undefined){
    db.ref("players").on("value", function(data){limit=data.val()})
  }

if(gs === "play"){
  image(tracki, -700, -window.innerHeight, window.innerWidth, -window.innerHeight*5)
  var index = 0
  var x = 200
  for(var i in limit){
    cars[index].x=x
    x=x+100

    cars[index].y=limit[i].y
    if(index === replace-1){
      camera.position.y=cars[index].y
      camera.position.x=cars[index].x
      textSize(20)
      fill("orange")
      text(inp.value(),  cars[index].x - 30, cars[index].y - 50)
      }
    index=index+1
  }

  if(keyCode === 38){
    cars[replace-1].y -= 20
    db.ref("players/player" + replace).update({y:cars[replace-1].y})
  }

  if(cars[replace-1].y<-5645 && finish === 2){
    rank += 1
    alert("You have crossed the finish line. Your rank is " + rank)
    finish = 0
    db.ref("/").update({Rank:rank})
  }
  drawSprites(); 

  // camera.position.x = displayWidth/2;
  // camera.position.y = cars[index-1].y
  

}


}

function playerEnter(){
  pc = pc+1
  replace=pc
  db.ref("/").update({playercount:pc})
  greeting = createElement("h3").html("hello " + inp.value() + ".....waiting for other players to join")
  greeting.position(100,100)
  button.hide()
  inp.hide()

  db.ref("players/player" + pc).set({y:-1075})
}

function resetGame(){
  gs = "start"
  db.ref("/").update({gamestate:gs, playercount:0, Rank:0})
  db.ref("players").remove()

}
