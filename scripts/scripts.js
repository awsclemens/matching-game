//document ready function
$(document).ready(function() {
    app.init();
});

//create out app object
const app = {};

//create global variables 
let buttonClick = false;
let $firstCard ="";
let $secondCard ="";
const $gameCards = $('.game-board div');
let seconds = 0;
let userName = "";

//audio variables
const aboutTimeWav = $('#about-time');
const applauseWav = $('#applause');
const cardFlipWav = $('#card-flip');
const failWav = $('#fail');
const successWav = $('#success');
const tadaWav = $('#tada');

//create global variable for photo selection
const startingArray = ["photo-1", "photo-2","photo-3","photo-4","photo-5","photo-6","photo-7","photo-8","photo-9","photo-10","photo-11","photo-12"]

//create our prompt function
app.userPrompt = function() {
    userName = prompt("Please enter your name:");
};

//create our startGame function which toggles the button and runs the game
app.startGame = function() {
    $('.game-button').on('click', function() {
        buttonClick = !buttonClick;
        console.log("in the startGame function buttonClick is:",buttonClick);
        app.photoDistribute();
        app.startTimer();
        app.buttonChange();
        app.hover();
        app.selectCard();
        app.winCheck();
        app.clearGame();
    });   
}; 

//create our photo distribution function
app.photoDistribute = function() {
    if(buttonClick === true) {

        const startingArrayCopy = startingArray.slice();
        const pickSixArray = [];

        for(i = 0; i < ($gameCards.length)/2; i++) {

            let randomNum = Math.floor(Math.random()*startingArrayCopy.length);
            let spliced = startingArrayCopy.splice(randomNum,1);
            spliced = spliced.toString();
            pickSixArray[i] = spliced;

        }

        const twelvePhotos = pickSixArray.concat(pickSixArray);

        for (i = 0; i < $gameCards.length; i ++){

            let randomNum = Math.floor(Math.random()*twelvePhotos.length);
            let spliced = twelvePhotos.splice(randomNum,1);
            spliced = spliced.toString();
            $($gameCards[i]).addClass(spliced);
            
        }
    }
};

//create our timer functions
app.startTimer = function() {
    if (buttonClick === true) {
        myTimer = setInterval(function(){
            seconds +=1;
            console.log(seconds/100)
        },10);
    } else {
        app.stopTimer();
        seconds = 0;
    }
};

app.stopTimer = function() {
    clearInterval(myTimer);
};

//create our button change function
app.buttonChange = function() {
    if (buttonClick === true) {
        $('.game-button').html("RESTART").addClass("stop").removeClass("start");
    } else {
        $('.game-button').html("START").addClass("start").removeClass("stop");
    }
    
};

//create our hover effect function
app.hover = function() {
    $('.game-board div:not(.selected)').on('mouseenter', function() {
        if (buttonClick === true) {
            $(this).addClass('hover');
        }
    });
    $('.game-board div:not(.selected)').on('mouseleave', function() {
        if (buttonClick === true) {
            $(this).removeClass('hover');
        }
    }); 
};

//create our selection function
app.selectCard = function() {
    $('.game-board div').on('click',function() {
        let $numSelected = $('.game-board div.selected').length;
        if (buttonClick === true && $(this).hasClass("matched") === false && $(this).hasClass("selected") === false && $numSelected < 2) {
            cardFlipWav.get(0).play();
            $(this).addClass('selected').removeClass('hover').empty();

            let $numSelected = $('.game-board div.selected').length;
            
            if ($numSelected === 1) {
                $firstCard = $(this).attr('class');
                // console.log($firstCard);
            } else if ($numSelected === 2) {
                $secondCard = $(this).attr('class');
                // console.log($secondCard);
                app.compareCards($firstCard, $secondCard);
            }

        }
    });  
};

//create compare card function
app.compareCards = function(value1, value2) {
    // console.log("First card is: ",value1);
    // console.log("Second card is: ",value2);
    if (value1 === value2){
        successWav.get(0).play();
        $('.selected').removeClass('selected').addClass('matched');
        app.winCheck();
    } else {
        failWav.get(0).play();
        $('.selected').addClass('unmatched');
        setTimeout( function(){$('.selected').removeClass('selected unmatched').append(`<p>?</p>`)}, 1000);
    }
};

//create win condition check
app.winCheck = function() {
    if($('.game-board div').length === $('.game-board div.matched').length) {
        app.stopTimer();
        if (seconds/100 < 10) {
            applauseWav.get(0).play();
            alert(`Wow ${userName}! That is seriously fast!! You matched them all in ${seconds/100} seconds! Way to go!`);
        } else if(seconds/100 < 15) {
            tadaWav.get(0).play();
            alert(`You did it ${userName}! You matched them all in ${seconds/100} seconds! You WIN!`);
        } else {
            aboutTimeWav.get(0).play();
            alert(`Well it's about time! ${seconds/100} seconds isn't very good ${userName}.`);
        }
        location.reload();
    }
};

//create clear game function
app.clearGame = function() {
    if (buttonClick === false) {
        $('.game-board div').removeClass();
    } 
};

//create our init function
app.init = function() {
    app.userPrompt();
    app.startGame();
    
};

