/*GAME SCRIPT*/



//width and height for our canvas
var canvasWidth = 650; 
var canvasHeight = 350;
var counter = 0;
var shootLength = 0;
//keys
var right = false;
var left = false;
var up  = false;
var fire = false;
//game speed
var speedInMillis = 50;
//speed of the movement 
var speed = 12; 
//getting the canvas 
var canvas = document.getElementById('gameCanvas');
//setting width and height of the canvas 
canvas.width = canvasWidth;
canvas.height = canvasHeight; 
//establishing a context to the canvas 
var ctx = canvas.getContext("2d");
//creating an Image object for our character 

//stopwatch Object
var stopwatch = {
    //properties
    time : 0,
    running : 0,
    mins : 0,
    secs : 0,
    tenths : 0,
    //startPause Method
    startPause : function () {
        if( stopwatch.running == 0){
            stopwatch.running = 1;
            stopwatch.increment();
            document.getElementById("startPause").innerHTML = "Pause";
        }
        else{
            stopwatch.running = 0;
            document.getElementById("startPause").innerHTML = "Resume";
        }
    },
    //reset Method
    reset : function() {
        stopwatch.running = 0;
        stopwatch.time = 0;
            document.getElementById("startPause").innerHTML = "Start";   
    }, 
    //increment Method
    increment : function() {
        
        if(stopwatch.running == 1){
            setTimeout(function(){ // set Timeout every 100 ms
                stopwatch.time++;
                stopwatch.mins = Math.floor((stopwatch.time/10/60) % 60);
                stopwatch.secs = Math.floor((stopwatch.time/10) % 60);
                stopwatch.tenths = stopwatch.time % 10;
                
                if(stopwatch.secs == 60){
                    stopwatch.secs = 00;
                }

                if(stopwatch.mins<10){
                    stopwatch.mins = "0" + stopwatch.mins ;
                }
                if(stopwatch.secs<10){
                    stopwatch.secs = "0" + stopwatch.secs ;
                }
                document.getElementById("timeOutput").innerHTML = stopwatch.mins + ":" + stopwatch.secs + ":" + stopwatch.tenths;

                stopwatch.increment();
            },100);
        }
    },

};
//player Object
player = {
    width :41,
    height:40,
    curFrame:0,
    frameCount:8,
    x:0,
    y:300,
    srcX:0,
    srcY:0, 
};
//choose player Image
var playerImg = new Image(); 
playerImg.src = "./img/sprites/peng.png";

//cat Object
cat = {
    width :40,
    height:40,
    x:100,
    y:0,
    srcX:0,
    srcY:0,
    shoot:false, 

};
//choose cat Image
var catImg = new Image(); 
catImg.src = "./img/sprites/cat.png";

//target Object , random
target = {
    radius : 10,
    x: Math.floor((Math.random() * 190) + 450),
    y: Math.floor((Math.random() * canvasHeight - 10 ) + 1),
    color : "green",
        
};

//actions if key is down
function onKeyDown(e) {
    if (e.keyCode === 39) right = true;
    else if(e.keyCode == 38 ) up =true;
    else if (e.keyCode === 37) left = true;
    else if (e.keyCode === 17) fire = true;
}
//actions if key is up
function onKeyUp(e) {
    if (e.keyCode === 39) right = false;
    else if(e.keyCode == 38 ) up =false;
    else if (e.keyCode === 37) left = false;
    else if (e.keyCode === 17) fire = false;
}
//define player movements
function playerMovement(){
    //if key right is hit
    if(right){
        //choose sprite
        player.srcY = 0;
        //move player 
        player.x = player.x+5;
        console.log("right");
    }
    //if key left is hit
    else if(left){
        //choose sprite
        player.srcY = 250; 
        //move player
        player.x = player.x-5;
        console.log("left");
    }
    
    //if key up is hit
    if(up){
        //choose sprite
        player.srcY = 40;
        //move player
        player.y = player.y-2;
    }
    //if key up is not hit
    else if (!up){
        if(player.y<300){
            //move player
            player.y = player.y+5;
        }
    }
    //set boundaries
    //reset player if outside the canvas
    if(player.x < 0){
        player.x = 0;
    }
    //reset player if outside the canvas
    if(player.y < 0){
        player.y = 0;
    }
     //reset player if outside the canvas
     if(player.x > (canvasWidth - 30)){
        player.x = (canvasWidth -30);
    }

    //if key fire is hit
    if( fire && (cat.shoot == false) ){
        //play meow sound
        var audio = new Audio('./sound/cat.mp3');
        audio.play();
        if(cat.shoot==false){
            //cat starts at play coordinates
            cat.x = player.x;
            cat.y = player.y;
            cat.shoot = true;
        }
    }

}

// is the target hit ?
function CheckCollision(){
    //calculate distance in between cat and target
    distance = Math.sqrt( (Math.pow(target.x - cat.x,2) )  + ( Math.pow(target.y - cat.y),2) ) ;
    //increment counter if target is hit
    if( (distance <= 30 ) && ((target.y + 30 >= cat.y ) && (target.y - 30 <= cat.y )  )){
        target.x = Math.floor((Math.random() * 190) + 450);
        target.y = Math.floor((Math.random() * canvasHeight - 10 ) + 1);
        counter++;
        document.getElementById("counterNumber").innerHTML = counter;
    }
  
} 

function updateFrame(){
	//Updating the frame index 
	player.curFrame = ++player.curFrame % player.frameCount; 	
	//Calculating the x coordinate for spritesheet 
    player.srcX = player.curFrame * player.width;
    //Clear the whole canvas 
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    
}

//if fire-key is hit throw a cat
function throwCat(){
    //if cat is outside the canvas reset vars
    if(cat.x >= canvas.width ){
        cat.shoot =false;
        shootLength = 0;
    }
    //while cat is thrown
    if(cat.shoot){
        //draw sprites of the cat
        ctx.drawImage(catImg, cat.srcX, cat.srcY, cat.width, cat.height, cat.x, cat.y,cat.width, cat.height);       
        //vertival movement
        cat.x = cat.x + 10;
        //Length increments as long as the cat is thrown
        shootLength++;
        //horizontal movement
        if( shootLength > 2 && shootLength < 12 ){
            cat.y = cat.y -5;
        }
        if( shootLength > 12 && shootLength < 22 ){
            cat.y = cat.y -3;
        }
        if(shootLength > 22 && shootLength < 32 ){
            cat.y = cat.y -0.5;
        }
        if( shootLength > 32 && shootLength < 42 ){
            cat.y = cat.y +0.5 ;
        }
        if( shootLength > 42 && shootLength < 52 ){
            cat.y = cat.y +1.5;
        }
        if( shootLength > 52 ){
            cat.y = cat.y +3.5;
        }
        
    }    
}

// draw the target
function drawCircle(x, y, r) {
    //draw a circle
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath(); 
    //fill the circle
    ctx.fillStyle = target.color;
    ctx.fill();
  }

//draw all elements on the canvas
function draw(){  
    if(stopwatch.running){//is the stopwatch running ?
        //Update the frame 
        updateFrame();
        //Drawing the image 
        playerMovement();
        //Draw the PlayerImage
        ctx.drawImage(playerImg, player.srcX, player.srcY, player.width, player.height, player.x, player.y,player.width, player.height);
        //Throw the cat
        throwCat();
        //Draw Targets to hit
        drawCircle(target.x, target.y, target.radius);
        //Check if Target is hit
        CheckCollision();
    }
    if(stopwatch.mins == 01){//Time is Over
        //reset the stopwatch
        stopwatch.reset();
        //reset the counter (points)
        var tempcounter = counter;
        counter = 0;
        document.getElementById("counterNumber").innerHTML = counter;
        //show game over and game result
        window.alert("game Over  " + tempcounter + " points");   
    }   
    
}

function start (){
    //run function draw within every 100 ms
    IntervalID = setInterval(draw,speedInMillis);
    //add Eventlisteners
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
    canvas.addEventListener("keydown", onKeyDown, false);
    canvas.addEventListener("keyup", onKeyUp, false);
}
// lets go..
start();
	
