/* METHODS JavaScript File */

// holders for player sigils
newGame.sigilImage1 = new Image();
newGame.sigilImage2 = new Image();

// function for getting JSON from API
async function getJSON(request)  {
	const response = await fetch(request);
	const data = await response.json();
	return data;
}

// Set up Canvas, paint background and scroll to bottom
var createCanvas = () => {    

    if(newGame.gameCanvas.getContext){
        newGame.canvasContext = newGame.gameCanvas.getContext("2d");

        // Load background image for size
        newGame.backgroundImage.src = "/dist/images/page02_map.jpg";
       
        // Make sure the image is loaded first otherwise nothing will draw.
        newGame.backgroundImage.onload = function(){
            // Set size to window size
            canvasWidth = newGame.gameCanvas.width = newGame.backgroundImage.width;
            canvasHeight = newGame.gameCanvas.height = newGame.backgroundImage.height;

            var x = newGame.gameCanvas.width / 2;
            var y = newGame.gameCanvas.height / 2;
               
            newGame.canvasContext.drawImage(newGame.backgroundImage,0,0);   
            window.scrollTo(0,document.body.scrollHeight);
                

        
        }


    }
    else{
        alert('Your browser doesnt support HTML canvas please upgrade it');
    }
};


// Updates the canvas with background, dots and players
var updateCanvas = () => {

    newGame.canvasContext.drawImage(newGame.backgroundImage,0,0);   

    // start dot
    newGame.drawDot("#689e58", "#faf3e9", 1380, 2500, 30, 0); 
    newGame.drawDot("#689e58", "#faf3e9", 1380, 2500, 10, 0); 

    // draw all the yellow dots from list
    for (var i = 0;i < newGame.yellowDots.length; i++) {
        newGame.drawDot("#ab3f30", "#faf3e9", newGame.yellowDots[i].x, newGame.yellowDots[i].y, 20, newGame.yellowDots[i].num); 
    }


    // end dot
    newGame.drawDot("#7c1634", "#faf3e9", 1000, 600, 30, 30); 
    newGame.drawDot("#7c1634", "#faf3e9", 1000, 600, 10, 30); 

    newGame.sigilImage1.src = newGame.players[0].house.sigilURL;
    newGame.sigilImage2.src = newGame.players[1].house.sigilURL;
 
    // draw player 1 sigil
    newGame.canvasContext.drawImage(newGame.sigilImage1, newGame.players[0].x-35,  newGame.players[0].y-35, 70, 70);
    
    // draw player 2 sigil
    newGame.canvasContext.drawImage(newGame.sigilImage2, newGame.players[1].x-45,  newGame.players[1].y-45, 70, 70);
}

// Draw one dot at x,y on the canvas
var drawDot = (color, strokeColor, x, y, radius, num) => {

    newGame.canvasContext.beginPath();
    newGame.canvasContext.arc(x, y, radius, 0, 2 * Math.PI, false);
    newGame.canvasContext.fillStyle = color;
    newGame.canvasContext.fill();


    newGame.canvasContext.lineWidth = 6;
    newGame.canvasContext.strokeStyle = strokeColor;
    newGame.canvasContext.stroke();
    
    newGame.canvasContext.font = "18px Futura";
    newGame.canvasContext.fillStyle = "#faf3e9";

    if (num !== 0 && num !== 30) {
        if (num < 10) {
            newGame.canvasContext.fillText(num, x - 5, y + 7);
        }
        else {
            newGame.canvasContext.fillText(num, x - 11.5, y + 7);
        }    
    }

 }

// Show additional information about the house
 var renderAddInfo = (sel, houseNumber) =>  {

    // remove previous content
    const addInfoDiv = document.getElementById("additional_house_info");
    while (addInfoDiv.firstChild) {
        addInfoDiv.removeChild(addInfoDiv.firstChild);
    }

    // div.sigil
    var divSigil = document.createElement('div');
    divSigil.className = "sigil";
    addInfoDiv.append(divSigil);

    // img sigil 
    var sigilImage = document.createElement('img');
    sigilImage.src = newGame.houses[houseNumber].sigilURL;
    sigilImage.alt = "Sigil of "+ newGame.houses[houseNumber].name;
    divSigil.append(sigilImage);
    
    // h2
    var houseName = document.createElement('h2');
    houseName.innerHTML =  "HOUSE "+newGame.houses[houseNumber].name;
    houseName.className = "house_name";
    addInfoDiv.append(houseName);

    // div.info
    var divInfo = document.createElement('div');
    divInfo.className = "info";
    addInfoDiv.append(divInfo);

    // div.infoline name
    var divInfoLineName = document.createElement('div');
    divInfoLineName.className = "infoline";
    divInfoLineName.innerHTML = "<span>Hero: </span> "+  newGame.houses[houseNumber].hero.name;
    divInfo.append(divInfoLineName);

    // div.infoline gender
    var divInfoLineGender = document.createElement('div');
    divInfoLineGender.className = "infoline";
    divInfoLineGender.innerHTML = "<span>Gender: </span> "+  newGame.houses[houseNumber].hero.gender;
    divInfo.append(divInfoLineGender);

    // div.infoline culture
    var divInfoLineCulture = document.createElement('div');
    divInfoLineCulture.className = "infoline";
    divInfoLineCulture.innerHTML = "<span>Culture: </span> "+  newGame.houses[houseNumber].hero.culture;
    divInfo.append(divInfoLineCulture);
    
    
    addInfoDiv.style.display = "block";



    if (isEven(houseNumber)) {
 
        addInfoDiv.style.left = '29%';
    } else {

        addInfoDiv.style.left = '53%';
    }
    addInfoDiv.style.top = (50 * houseNumber)+"px";
    
} 


// Set current player 
var setPlayer = (sel, houseNumber) =>  {

    // if no players selected
    if (!newGame.players[0] && !newGame.players[1]) {
        
   
        newGame.players[0] = new Player(houseNumber, 0);

        sel.style.backgroundImage = "url('/dist/images/house_background_green.png')";
        if (screen.width < 1024) {
            sel.style.backgroundPositionY = 'bottom';

        }
        
        document.getElementById('clearButton').disabled = false;
        
  
    } else 
    // check if player on is set
    if (newGame.players[0] && !newGame.players[1]) {

            //  and if house is not already chosen
            if (houseNumber !== newGame.players[0].houseNumber) {

                newGame.players[1] = new Player(houseNumber, 1);
        
                sel.style.backgroundImage = "url('/dist/images/house_background_purple.png')";
                if (screen.width < 1024) {
                    sel.style.backgroundPositionY = 'bottom';
        
                }
        
                document.getElementById('playButton').disabled = false;
                document.getElementById('playButton').style.backgroundColor = "#7c1632";
                document.getElementById('playButton').style.color = "#faf3e9";
            }
    }
}

// one round for one player
var playRound = () => {

    var extraRoll = false;
    updateCanvas();
    newGame.setupPlayer();

    var diceResult = newGame.rollDice();

    if (diceResult === 6) {
        extraRoll = true;
    }

    // show dice animation
    newGame.startDice();

    setTimeout(function() {
        // show dice result 
        newGame.showDice(diceResult)
        // -1 because of start dot
        newGame.startDot = newGame.players[newGame.currentPlayer].currentDot-1;

        // move the player to the right dot
        newGame.movePlayer(diceResult);
        
        // If extra roll set round to -1
        if (extraRoll) {
            newGame.flashMessage("BONUS ROLL!");
            newGame.extraThrow = true;
            newGame.roundsCounter -= 1;
        }
    }, 1200);
}

// roll a six sided dice and return the result
var rollDice = () => {
    var randomNumber = Math.floor(Math.random()*6) + 1;
    newGame.startDice();
    return randomNumber;
}

// move player to next to then it calls it selv recursivly untíl til player reaches its desitination
var movePlayer = (diceRoll) => {
    
    var x = newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot].x;
    var y = newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot].y;
   
    // modifier that changes the movement to backwards if diceRoll is negative
    var negativeModifier = 1;
    if (diceRoll <= 0) {
        negativeModifier = -1;
    }

    // next dot
    var dstX = newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot + (1 * negativeModifier)].x;
    var dstY = newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot + (1 * negativeModifier)].y;



    // check which direction the player is moving from one dot to another
    
    var xDirection;
    var yDirection;

    if (x > dstX) {
        xDirection = 'left';
    } else {
        xDirection = 'right';
    }
    if (y > dstY) {
        yDirection = 'up';
    } else {
        yDirection = 'down';
    }

    // loop until player reaches the next dot
    var moveLoop = setInterval(function() {

        if (xDirection === 'left') {
            if (x > dstX) {
                x-=1;
            }    
        }

        if (xDirection === 'right') {
            if (x < dstX) {
                x+=1;
            }    
        }

        if (yDirection === 'up') {
            if (y > dstY) {
                y-=1;
            }    
        }

        if (yDirection === 'down') {
            if (y < dstY) {
                y+=1;
            }    
        }

        // set new coordinates for player sigil and update canvas 
        newGame.players[newGame.currentPlayer].x = x;
        newGame.players[newGame.currentPlayer].y = y;

        updateCanvas();

        // check if player has reached the next dot
        if ((x === dstX) && (y === dstY)) {

            // exit loop
            clearInterval(moveLoop);

            // check if player has reached goal
            if (newGame.players[newGame.currentPlayer].currentDot === 28) {
                // Fire goal event
                window.dispatchEvent(reachGoalEvent);

            } else {
                            // set new currentDot
            newGame.players[newGame.currentPlayer].currentDot = newGame.players[newGame.currentPlayer].currentDot + (1 * negativeModifier);       

        
            switch (diceRoll) {
                // fire trap event if the dot has trap
                case 1: 
                    if (newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot-(1 * negativeModifier)].trap) {
                        // Fire trap event
                        window.dispatchEvent(trapEvent);

                    // go to next player if no trap
                    } else {

                        newGame.roundsCounter += 1;

                        newGame.currentPlayer = mod(newGame.roundsCounter, 2);
                        document.getElementById('diceButton').disabled = false;    
                   
                        newGame.setupPlayer();
                        document.getElementById('playerBox').className = "dice animated heartBeat 1s";
                        setTimeout(function() {
                            document.getElementById('playerBox').className = "dice";
            
                        },500);
                        newGame.setupPlayer();
                        document.getElementById('playerBox').className = "dice animated pulse 3s";
                        setTimeout(function() {
                            document.getElementById('playerBox').className = "dice";
            
                        },500);
            
                        newGame.updateCanvas();  
            

                    }
                    break;
                // the player  is moving backwards and has reach its destination
                case -1:
                        newGame.roundsCounter += 1;

                        newGame.currentPlayer = mod(newGame.roundsCounter, 2);
                        document.getElementById('diceButton').disabled = false;    
                        newGame.setupPlayer();
                        document.getElementById('playerBox').className = "dice animated shaje 1s";
                        setTimeout(function() {
                            document.getElementById('playerBox').className = "dice";
            
                        },500);
                        newGame.setupPlayer();
                        document.getElementById('playerBox').className = "dice animated pulse 3s";
                        setTimeout(function() {
                            document.getElementById('playerBox').className = "dice";
            
                        },500);
            
                        newGame.updateCanvas();
            

                break;  
                // next player
                default:

                    // if trying to move back before start or after finish
                    if ((diceRoll <= -1 && (newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot].num === 1)) ||
                    (diceRoll <= 1 && (newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot].num === 29))) {

                        newGame.roundsCounter += 1;

                        newGame.currentPlayer = mod(newGame.roundsCounter, 2);
                        document.getElementById('diceButton').disabled = false;      
                        
                        newGame.setupPlayer();
                        document.getElementById('playerBox').className = "dice animated pulse 3s";
                        setTimeout(function() {
                            document.getElementById('playerBox').className = "dice";
            
                        },500);
            
                        updateCanvas();
              

                    // move to next dot 
                    } else {
                           
                        // recursive until on right dot
                        if (diceRoll > 0) {
                            newGame.movePlayer(diceRoll - 1);
                            
                        } else {
                            newGame.movePlayer(diceRoll + 1);

                        }
                        
                    }
            }
            }


        }
      },3); // player speed on on board in ms
          
  }

// flashes current round
var flashRound = () => {

    var roundBanner = document.getElementById('currentRound');
    roundBanner.innerHTML = "ROUND #"+ Math.floor(newGame.roundsCounter/2 + 1);
    roundBanner.style.opacity = 100;
    roundBanner.className = 'round animated flipInY fadeIn';

    setTimeout(function () {
        roundBanner.className = 'animated flipOutY';
    },1500);
}

// flashes custom message 
var flashMessage = (msg) => {

    var flashBanner = document.getElementById('flashBanner');
    flashBanner.innerHTML = msg;
    flashBanner.style.opacity = 100;
    flashBanner.className = 'flashBanner flipInX fadeIn animated';

    setTimeout(function () {
        flashBanner.className = 'animated flipOutX';
    },1500);
}


// flashes custom message 
var flashWinner= (msg) => {

    var flashBanner = document.getElementById('flashWinner');
    flashBanner.innerHTML = msg;
    flashBanner.style.opacity = 100;
    flashBanner.className = 'flashBanner flipInX fadeIn animated';

    setTimeout(function () {
        flashBanner.className = 'animated flipOutX';
    },1500);
}

// flashes trap
var flashTrapMessage = () => {


    var trapImage = new Image();

    trapImage.src = '/dist/images/trap_image.png';
    trapImage.alt = "It's a trap!";
    var trapImage_x= newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot].x;
    var trapImage_y = newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot].y;
    
    newGame.canvasContext.drawImage(trapImage, trapImage_x - 200, trapImage_y - 200, trapImage.width / 2, trapImage.height / 2);
   
    newGame.canvasContext.font = '2.5rem FuturaCondencedBold,"Trebuchet MS", Arial, sans-serif';
    newGame.canvasContext.strokeStyle = 'black';
    newGame.canvasContext.lineWidth = 8;

    console.log("currentDot: "+newGame.players[newGame.currentPlayer].currentDot);
    console.log("message: "+newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot-1].trap);

    wrapText(newGame.canvasContext, newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot-1].trap.message, trapImage_x + 200, trapImage_y - 200, 300, 60);

    setTimeout(function () {
        trapBox.className = 'trap animated fadeOut';
    },4000);


}

// build player and dice field
var setupPlayer = () => {

    var playerBoxDiv = document.getElementById('playerBox');
    playerBoxDiv.innerHTML = "";


    var sigilDiv = document.createElement('div');
    sigilDiv.className = 'sigil';
    playerBoxDiv.append(sigilDiv);

    var sigilImage = document.createElement('img');
    sigilImage.src = newGame.players[newGame.currentPlayer].house.sigilURL;
    sigilImage.alt = "Sigil "+  newGame.players[newGame.currentPlayer].house.name;;
    sigilDiv.append(sigilImage);

    var playerNumDiv = document.createElement('div');
    playerNumDiv.className = 'num';
    playerNumDiv.innerHTML = "Player #"+(newGame.currentPlayer+1);
    playerBoxDiv.append(playerNumDiv);

    var playerHeroDiv = document.createElement('div');
    playerHeroDiv.className = 'hero';
    playerHeroDiv.innerHTML = newGame.players[newGame.currentPlayer].house.hero.name;
    playerBoxDiv.append(playerHeroDiv);

    var imageDiv = document.createElement('div');
    imageDiv.className = 'image';
    playerBoxDiv.append(imageDiv);

    var diceImage = document.createElement('img');
    diceImage.src = '/dist/images/dice.png';
    diceImage.alt = "Dice"
    diceImage.id = "diceImage"
    imageDiv.append(diceImage);


    var rollButton = document.createElement('button');
    rollButton.className = 'dice';
    rollButton.id = 'diceButton';
    rollButton.innerHTML = "ROLL THE DICE!";
    playerBoxDiv.append(rollButton);

    rollButton.addEventListener('click', function (e) { 
        
        // start roll on click
        if (!newGame.winner) {
            newGame.sigilImage1.src = newGame.players[0].house.sigilURL;
            newGame.sigilImage1.id = "player1_image";
            newGame.sigilImage2.src = newGame.players[1].house.sigilURL;
            newGame.sigilImage1.id = "player2_image";
            
            
           
            if (newGame.currentPlayer === 0 && !newGame.extraThrow) {
                newGame.flashRound();
            }

            playRound();
        }  
    });


}

// start dice animation
var startDice = () =>  {
   document.getElementById('diceImage').src = '/dist/images/dice.png';
   document.getElementById('diceImage').style.animation = 'rotation 0.2s infinite linear';

}

// stop dice animation
var stopDice = (value) => {
    document.getElementById('diceImage').style.animation = none; 
}

// show dice result
var showDice = (value) => {
    document.getElementById('diceImage').style.animation = 'none'; 

    switch (value) {
        case 1: 
            document.getElementById('diceImage').src = "/dist/images/dice/dice_1.svg";
            break;
        case 2: 
            document.getElementById('diceImage').src = "/dist/images/dice/dice_2.svg";
            break;
        case 3: 
            document.getElementById('diceImage').src = "/dist/images/dice/dice_3.svg";
            break;
        case 4: 
            document.getElementById('diceImage').src = "/dist/images/dice/dice_4.svg";
            break;
        case 5: 
            document.getElementById('diceImage').src = "/dist/images/dice/dice_5.svg";
            break;
        case 6: 
            document.getElementById('diceImage').src = "/dist/images/dice/dice_6.svg";
            break;
            
    }

    document.getElementById('diceButton').disabled = true;

} 

// set up 5 traps on random dots
var setupTraps = () => {
    var randomDot;

    for (let i = 0;i < newGame.traps.length; i++) {
        // place traps on 5 random dots
       randomDot = (Math.floor(Math.random()*28)+1);
        
       if (!newGame.yellowDots[randomDot].trap) {
            newGame.yellowDots[randomDot].trap = newGame.traps[i];
       } else {
           // dot already has trap. set new dot
            randomDot = Math.floor(Math.random()*28)+1;                
            newGame.yellowDots[randomDot].trap = newGame.traps[i];
   
       }
     }
     console.log(newGame.yellowDots);

}

// send player back x dots when trapped
var trapExecute = (numSpaces) => {

    var numStepsBack = newGame.yellowDots[newGame.players[newGame.currentPlayer].currentDot -1].trap.numMoves;
    newGame.movePlayer(numStepsBack);
}

// load hero data from GoT API
 var loadHeroes = () => {
    var corsProxy = "";


    // get data on all 10 heroes  (with cors proxy locally)
   var results = getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Arya Stark')
                .then(data => { newGame.heroes[0] = data[0]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Daenerys Targaryen'))
                .then(data => { newGame.heroes[1] = data[1]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Theon Greyjoy'))
                .then(data => { newGame.heroes[2] = data[0]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Stannis Baratheon'))
                .then(data => { newGame.heroes[3] = data[0]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Tyrion Lannister'))
                .then(data => { newGame.heroes[4] = data[0]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Doran Martell'))
                .then(data => { newGame.heroes[5] = data[0]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Margaery Tyrell'))
                .then(data => { newGame.heroes[6] = data[0]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Lothar Frey'))
                .then(data => { newGame.heroes[7] = data[0]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Jon Arryn'))
                .then(data => { newGame.heroes[8] = data[0]})
                .then(data => getJSON(corsProxy+'https://anapioficeandfire.com/api/characters?Name=Edmure Tully'))
                .then(data => { newGame.heroes[9] = data[0]})
                .then(
                    function() {
                        newGame.createHouses();
                        newGame.populateHouses();
                        
                         /* Add event listeners for additional hero information */
                        var allHouses = document.getElementsByClassName('house');

                        /* setting up events for additional house info */ 
                        for (var i = 0;i < allHouses.length; i++ ) {

                            allHouses[i].addEventListener('mouseenter', function(i) {
                                newGame.renderAddInfo(allHouses[i], i)
                            }.bind(allHouses[i], i));
            

                            allHouses[i].addEventListener('click', function(i) {
                                newGame.setPlayer(allHouses[i], i)
                            }.bind(allHouses[i], i));
            
                      
                            allHouses[i].addEventListener('mouseleave', function() {
               
                                var addInfoDiv = document.getElementById('additional_house_info');
                                addInfoDiv.style.display = 'none';
                            });
                        }
                        
                        
                        
                });
}


// set up House objects and include JSON data
var createHouses = (callback) => {
    newGame.houses[0] = new House("Stark", newGame.heroes[0], "/dist/images/sigils/sigil_stark.png");
    newGame.houses[1] = new House("Targaryen", newGame.heroes[1], "/dist/images/sigils/sigil_targaryen.png");
    newGame.houses[2] = new House("Greyjoy", newGame.heroes[2], "/dist/images/sigils/sigil_greyjoy.png");
    newGame.houses[3] = new House("Baratheon", newGame.heroes[3], "/dist/images/sigils/sigil_baratheon.png");
    newGame.houses[4] = new House("Lannister", newGame.heroes[4], "/dist/images/sigils/sigil_lannister.png");
    newGame.houses[5] = new House("Martell", newGame.heroes[5], "/dist/images/sigils/sigil_martell.png");
    newGame.houses[6] = new House("Tyrell", newGame.heroes[6], "/dist/images/sigils/sigil_tyrell.png");
    newGame.houses[7] = new House("Frey", newGame.heroes[7], "/dist/images/sigils/sigil_frey.png");
    newGame.houses[8] = new House("Arryn", newGame.heroes[8], "/dist/images/sigils/sigil_arryn.png");
    newGame.houses[9] = new House("Tully", newGame.heroes[9], "/dist/images/sigils/sigil_tully.png");
  
}

// set up character select screen
var populateHouses = () => {

    var housesContainer = document.getElementById('housesContainer');


    for (var i = 0;i < newGame.houses.length; i++) {
        // div.house
        var houseDiv = document.createElement('div');
        houseDiv.className = "house";
        housesContainer.append(houseDiv);

        // assign house HTML element
        newGame.houses[i].element = houseDiv;

        // div.left
        var leftDiv = document.createElement('div');
        leftDiv.className = "left";
        houseDiv.append(leftDiv);
        
        // img sigil 
        var sigilImage = document.createElement('img');
        sigilImage.src = newGame.houses[i].sigilURL;
        sigilImage.alt = "Sigil "+ newGame.houses[i].name;
        leftDiv.append(sigilImage);

        // div.right
        var rightDiv = document.createElement('div');
        rightDiv.className = "right";
        houseDiv.append(rightDiv);

        // h2
        var houseName = document.createElement('h2');
        houseName.innerHTML = "HOUSE "+newGame.houses[i].name;
        rightDiv.append(houseName);

        // div.hero
        var heroDiv = document.createElement('div');
        heroDiv.className = "hero";
        heroDiv.innerHTML = "<span>Hero: </span>"+newGame.houses[i].hero.name;
        rightDiv.append(heroDiv);
        
    }
}

// set up trap objects 
var loadTraps = () => {
    newGame.traps[0] = new Trap("You have been burned by Daenerys' dragons. Find water! Move back 7 tiles.", -7);
    newGame.traps[1] = new Trap("Cersei Lannisters spys have spotted you! Careful now. Move back 3 tiles.", -3);
    newGame.traps[2] = new Trap("The Night King is gazing at you from afar! You hide in fear. Move back 2 tiles.", -2);
    newGame.traps[3] = new Trap("Euron Greyjoy kidnapped your knights. Seek cover! Move back 6 tiles.", -6);
    newGame.traps[4] = new Trap("Ramsey Bolton wants to torture you. Run away! Move back 10 tiles.", -10);
}


// set up score page with winner and looser
var scoreTime = () => {

    document.getElementById("audio").style.display = 'none';
    document.getElementById("page01").style.display = 'none';
    document.getElementById("page02").style.display = 'none';
    document.getElementById("page03").style.display = 'block';

    // winner
    var winnerHouse = document.getElementById('winnerHouse');

    var sigilElement = document.createElement('img');
    sigilElement.src = newGame.players[newGame.winner].house.sigilURL;
    sigilElement.alt = "Sigil of House "+newGame.players[newGame.winner].house.name;
    winnerHouse.append(sigilElement);        
  


    var houseElement = document.createElement('div');
    houseElement.className = "house_name";
    houseElement.innerHTML = "HOUSE "+newGame.players[newGame.winner].house.name;
    winnerHouse.append(houseElement);


    // looser

    var looserHouse = document.getElementById('looserHouse');

    sigilElement = document.createElement('img');
    sigilElement.src = newGame.players[newGame.looser].house.sigilURL;
    sigilElement.alt = "Sigil of House "+newGame.players[newGame.looser].house.name;
    looserHouse.append(sigilElement);        
  
    houseElement = document.createElement('div');
    houseElement.className = "house_name";
    houseElement.innerHTML = "HOUSE "+newGame.players[newGame.looser].house.name;
    looserHouse.append(houseElement);


    var winnerElement = document.getElementById('winnerElement');
    var looserElement = document.getElementById('looserElement');

    // simple animation
    winnerElement.className = "player animated flipInX";
    setTimeout(function() {
        looserElement.className = "player animated flipInY";
    },1000);

    document.getElementById('winnerHouseEnd').innerHTML = newGame.players[newGame.winner].house.name;
}



/* class methods */
Game.prototype.createCanvas = createCanvas;
Game.prototype.updateCanvas = updateCanvas;
Game.prototype.setupTraps = setupTraps;
Game.prototype.trapExecute = trapExecute;
Game.prototype.drawDot = drawDot;
Game.prototype.renderAddInfo = renderAddInfo;
Game.prototype.setPlayer = setPlayer;
Game.prototype.setupPlayer = setupPlayer;
Game.prototype.playRound = playRound;
Game.prototype.rollDice = rollDice;
Game.prototype.movePlayer = movePlayer;
Game.prototype.flashRound = flashRound;
Game.prototype.flashMessage = flashMessage;
Game.prototype.flashTrapMessage = flashTrapMessage;
Game.prototype.startDice = startDice;
Game.prototype.stopDice = stopDice;
Game.prototype.showDice = showDice;
Game.prototype.loadHeroes = loadHeroes;
Game.prototype.createHouses = createHouses;
Game.prototype.populateHouses = populateHouses;
Game.prototype.loadTraps = loadTraps;
Game.prototype.scoreTime = scoreTime;


