import * as A from './data/alphabet.js'
import * as L from './data/slist.js'
import * as D from './data/dictionary.js'
import * as Storage from './local.js'




// Droplet
// River
// Ocean

// Every 20 days that the user plays they get a new level




const alphabet = A.list
const words = L.list
const dictionary = D.list

// Define a function to count the word lengths
function countWordLengths(list) {
  // Define an object to store the word counts
  const counts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
  };
  
  // Loop through the array of words
  for (let i = 0; i < list.length; i++) {
    // Get the length of the current word
    const length = list[i].word.length;
    
    // Increment the count for the appropriate length
    if (length <= 8) {
      counts[length]++;
    } else {
      counts[8]++;
    }
  }
  
  // Return the counts object
  return counts;
}

// Call the function and log the results to the console
console.log(countWordLengths(words));








let filteredwords = words.filter(function(obj) {
  return obj.word.length >= 3
});
let word;


let shift = GetRandomInt(3, 23)


let positiontracker = 0
let totalboxes = 0
let totalrow = 0
let positionstart = 0
let positionend = 0
let currentrow = 0
let currentguess = []
let hasWon = false
let chanceCounter = 0



var LSP;
checkLocal()

createRows()




$(document).ready(function(){

    $(document).keydown(function(e) {
        if(!hasWon){
          checkKey(e)
        }
    })

    $(".guess-the-word").text(cipher())


    $(".keyboard-key").click(function(){
        let id = $(this).attr("id")
        let letterClicked = id.split("-")
        var letterActivate = new KeyboardEvent("keydown", {key: letterClicked[1]})
        document.dispatchEvent(letterActivate)

    })

})


function createRows(){

    if(word === undefined) word = ""
    
    let l = word

    for(let i=0; i < l.length + 1; i++){

        let $row = $("<div class='letters-container' style='grid-template-columns: repeat(" + l.length + ", 1fr)'></div>");

        for(let j=0; j<l.length; j++){
            let $letter = $("<div class='letter'></div>")
            $row.append($letter)
        }
        
        $(".rows-container").append($row)
    }

    totalboxes = l.length * (l.length + 1)
    totalrow = l.length
    positionend = l.length - 1
    currentrow = 0

    $(".rows-container").find(".letters-container").each(function(index) {
        if(index == 0){
            $(this).addClass("active")
        }
    })
}


function checkKey(e){
    switch (e.key.toUpperCase()) {
        case 'A':
          addLetter('A');
          break;
        case 'B':
          addLetter('B');
          break;
        case 'C':
          addLetter('C');
          break;
        case 'D':
          addLetter('D');
          break;
        case 'E':
          addLetter('E');
          break;
        case 'F':
          addLetter('F');
          break;
        case 'G':
          addLetter('G');
          break;
        case 'H':
          addLetter('H');
          break;
        case 'I':
          addLetter('I');
          break;
        case 'J':
          addLetter('J');
          break;
        case 'K':
          addLetter('K');
          break;
        case 'L':
          addLetter('L');
          break;
        case 'M':
          addLetter('M');
          break;
        case 'N':
          addLetter('N');
          break;
        case 'O':
          addLetter('O');
          break;
        case 'P':
          addLetter('P');
          break;
        case 'Q':
          addLetter('Q');
          break;
        case 'R':
          addLetter('R');
          break;
        case 'S':
          addLetter('S');
          break;
        case 'T':
          addLetter('T');
          break;
        case 'U':
          addLetter('U');
          break;
        case 'V':
          addLetter('V');
          break;
        case 'W':
          addLetter('W');
          break;
        case 'X':
          addLetter('X');
          break;
        case 'Y':
          addLetter('Y');
          break;
        case 'Z':
          addLetter('Z');
          break;
        default:
          if(e.key == 'Backspace'){
            removeLetter()
          }else if(e.key == 'Enter'){
            if(positiontracker > positionend){
              
              enterGuess()
            }else{
              showMessage("Incomplete guess")
            }
          }
            
          break;
      }
}


function addLetter(l){
    $(".rows-container").find(".letters-container.active .letter").each(function(index) {
        if(index == positiontracker){
            $(this).text(l)
        }
    })
    increaseTracker(l)
}

function removeLetter(){
    $(".rows-container").find(".letters-container.active .letter").each(function(index) {
        if(index == positiontracker - 1){
            $(this).text("")
        }
    });
    decreaseTracker()
}



function enterGuess(){
    
    let guess = currentguess.join('')

    let isWord = dictionary.find(function(x){
      return x.word === guess
    })

    if(isWord){
      if(guess == word.toUpperCase()){
        correctGuess()
      }else{
        continueGuess()
      }

    }else{
      showMessage("Not in word list")
    }

}

function continueGuess() {


  checkCorrectLetters()

  if(currentrow != word.length){
    currentrow++
  }else if(currentrow == word.length && Storage.player.level == 1 && Storage.player.winStatus == false){
    // just finished the last row but still didn't win
    currentrow = 0
    $(".letter").text('')
    $(".letter").removeClass('correct')
    $(".letter").removeClass('closer')
    $(".letter").removeClass('incorrect')

  }else if(currentrow == word.length 
    && Storage.player.level == 2 
    && Storage.player.winStatus == false
    && chanceCounter < 2){
    currentrow = 0
    $(".letter").text('')
    $(".letter").removeClass('correct')
    $(".letter").removeClass('closer')
    $(".letter").removeClass('incorrect')

    chanceCounter++
  }else if(currentrow == word.length 
    && Storage.player.level == 2 
    && Storage.player.winStatus == false
    && chanceCounter >= 2){
    
      lostGame()
  }else if(currentrow == word.length 
    && Storage.player.level == 3 
    && Storage.player.winStatus == false){
      lostGame()
  }
  $(".letters-container").removeClass('active')


  $(".rows-container").find(".letters-container").each(function (index) {
    if (index == currentrow) {
      $(this).addClass("active")
    }
  })

  currentguess = []
  positiontracker = positionstart
}


function correctGuess(){
  checkCorrectLetters()
  hasWon = true
  Storage.updateWinStatus(hasWon)
  Storage.updateProgressDroply()
  Storage.updateWinNumber()

  checkLevel()
  playerLevel()
  droplyContinues()
  currentguess = []
  $(".letters-container").removeClass('active')
  $(".win-message").removeClass("display-none")
}


function lostGame(){
  currentguess = []
  Storage.updateLostStatus(true)
  $(".the-word").text(word)
  $(".letters-container").removeClass('active')
  $(".lose-message").removeClass("display-none")
}



function checkLevel(){
  if(Storage.player.winNumber < 20){
    $(".current-player-level").text("Water Droplet")
  }else if(Storage.player.winNumber >= 20 
    && Storage.player.level == 1
    && Storage.player.winNumber < 40){
    Storage.updateLevel()
    Storage.resetProgressDroply()
    $(".current-player-level").text("Lake Master")
  }else if(Storage.player.winNumber >= 40 
    && Storage.player.level == 2
    && Storage.player.winNumber < 60){
    Storage.updateLevel()
    Storage.resetProgressDroply()
    $(".current-player-level").text("Ocean Legend")
  }
}


function playerLevel(){
  if(Storage.player.level == 1){
    $(".current-player-level").text("Water Droplet")
  }else if(Storage.player.level == 2){
    $(".current-player-level").text("Lake Master")
    $("body").css("background","url('/assets/images/marvelousprairie.svg') bottom center / cover no-repeat, #20CCFF")
  }else if(Storage.player.level == 3){
    $(".current-player-level").text("Ocean Legend")
    $("body").css("background","url('/assets/images/calmnight.svg') bottom center / cover no-repeat, #20CCFF")
  }
}

function droplyContinues(){
    $(".progress-bar").css('width', Storage.player.progressDroply + "%")
    if(Storage.player.progressDroply >= 50){
      $(".progress-bar").addClass('movedroply')
    }
}


function increaseTracker(l){
    if(positiontracker >= positionstart && positiontracker <= positionend){
        positiontracker++
        currentguess.push(l)
    }else{
        positiontracker = positiontracker
    }
}

function decreaseTracker(){
    positiontracker--
    if(positiontracker < 0) positiontracker = 0 
    currentguess.pop()
}


function GetRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cipher() {

    var wordArray = word.toUpperCase().split('');
  

    for (var i = 0; i < wordArray.length; i++) {

      var letterObj = alphabet.find(function(obj) {
        return obj.letter === wordArray[i];
      });
  

      if (letterObj) {

        var index = alphabet.indexOf(letterObj);
  

        index = (index + shift) % alphabet.length;
  

        wordArray[i] = alphabet[index].letter;
      }
    }
  

    return wordArray.join('');
  }




function checkCorrectLetters() {
  let wordArray = word.toUpperCase().split('')

  let delay = 0;

  for (let i = 0; i < currentguess.length; i++) {
    if (currentguess[i] === wordArray[i]) {      
      correctAnimation(currentguess, i, delay)

      let index = wordArray.indexOf(currentguess[i]);

      if (index !== -1) {
        wordArray.splice(index, 1, "");
        currentguess.splice(index, 1, "");
      }
    }
  }


  for(let j=0; j < currentguess.length; j++){

    var letter = wordArray.find(function (obj) {
      return obj === currentguess[j]
    })
    
    if (letter) {
      closerAnimation(letter, j, delay)

      let index = wordArray.indexOf(letter);
  
      if (index !== -1) {
        wordArray.splice(index, 1, "");
      }

    } else {
    }
  }

  for(let k=0; k<currentguess.length; k++){
    incorrectAnimation(currentguess, k, delay)
  }


}

function correctAnimation(currentguess, i, delay){
  $(".rows-container").find(".letters-container.active .letter").each(function(index) {
    if($(this).text() == currentguess[i] && index == i){
        $(this).addClass("correct")
        delay = index * 100;
        $(this).css({
          'animation-delay': delay + 'ms' 
        });
    }
  })

  $(".keyboard-key").each(function(index) {
    let id = $(this).attr("id")
    let letterChecked = id.split("-")

    if(letterChecked[1] === currentguess[i]){
      $(this).addClass("key-correct")
    }

  })
}


function closerAnimation(letter, i, delay){
  $(".rows-container").find(".letters-container.active .letter").each(function(index) {
    if($(this).text() == letter && index == i){
        $(this).addClass("closer")
        delay = index * 100;
        $(this).css({
          'animation-delay': delay + 'ms' 
        });
    }
  })

  $(".keyboard-key").each(function(index) {
    let id = $(this).attr("id")
    let letterChecked = id.split("-")

    if(letterChecked[1] === letter
      && !$(this).hasClass('key-correct')){
      $(this).addClass("key-closer")
    }

  })
}

function incorrectAnimation(letter, i, delay){
  $(".rows-container").find(".letters-container.active .letter:not(.correct):not(.closer)").each(function(index) {
        $(this).addClass("incorrect")
        delay = index * 100;
        $(this).css({
          'animation-delay': delay + 'ms' 
        });
  })

  $(".keyboard-key").each(function(index) {
    let id = $(this).attr("id")
    let letterChecked = id.split("-")
    if(letterChecked[1] === letter[i] 
      && !$(this).hasClass('key-closer')
      && !$(this).hasClass('key-correct')){
      $(this).addClass("key-incorrect")
    }
  })
}


function hasVisitedToday() {
  var lastVisit = LSP.lastVisit
  var now = new Date();
  var nowTime = now.getTime();
  var oneDay = 24 * 60 * 60 * 1000; // one day in milliseconds

  // Round down the last visit time to the start of the current day
  var lastVisitTime = lastVisit ? new Date(Number(lastVisit)).setHours(0, 0, 0, 0) : 0;

  if (lastVisitTime < now.setHours(0, 0, 0, 0)) {
    // user has not visited today
    Storage.updateLastVisit(nowTime)
    return false
  } else {

    return true
  }
}

function checkLocal(){
  LSP = JSON.parse(localStorage.getItem("DroplyPlayer"));
  if(LSP == "" || LSP == undefined || LSP == null){
    newLocal()
  }else{
    setLocal()
  }


}

function newLocal(){
  Storage.createPlayerID()
  Storage.AddToLocalStorage()

  refreshLocal()
}

function setLocal(){


  Storage.player.id = LSP.id
  Storage.player.winStatus = LSP.winStatus
  Storage.player.lostStatus = LSP.lostStatus
  Storage.player.wordsArray = LSP.wordsArray
  Storage.player.lastVisit = LSP.lastVisit
  Storage.player.todaysWord = LSP.todaysWord
  Storage.player.progressDroply = LSP.progressDroply
  Storage.player.level = LSP.level
  Storage.player.winNumber = LSP.winNumber


  handleLocal()

  filterByLevel()

  droplyContinues()


  if(hasVisitedToday()){
    if(Storage.player.winStatus){
      $(".game-container").addClass("display-none")
      $(".game-won").removeClass("display-none")
    }else if(Storage.player.lostStatus){
      //Has visited today but has lost
      $(".game-container").addClass("display-none")
      $(".game-lost").removeClass("display-none")
    }else{
      //Has visited today but hasn't won nor lost yet
      word = Storage.player.todaysWord
    }
  }else{
    refreshLocal()
  }
}

function refreshLocal(){
  LSP = JSON.parse(localStorage.getItem("DroplyPlayer"))

  var now = new Date()
  var nowTime = now.getTime()

  if(LSP.wordsArray.length < filteredwords.length / 2){
    if(LSP.wordsArray.length){
      filteredwords = filteredwords.filter(word => !Storage.player.wordsArray.includes(word));
      filteredwords = filteredwords.map(word => word);
    }
  }


  getWord()

  Storage.updateWinStatus(false)
  Storage.updateLastVisit(nowTime)
  Storage.updateTodaysWord(word)
  Storage.updateWordsArray(word)
}


function filterByLevel(){
  if(Storage.player.level == 1){
    filteredwords = filteredwords.filter(function(obj) {
      return obj.word.length >= 3 && obj.word.length <= 4
    })
  }else if(Storage.player.level == 2){
    filteredwords = filteredwords.filter(function(obj) {
      return obj.word.length >= 3 && obj.word.length <= 5
    })
  }else if(Storage.player.level == 3){
    filteredwords = filteredwords.filter(function(obj) {
      return obj.word.length >= 3 && obj.word.length <= 8
    })
  }

  playerLevel()
}

function handleLocal(){
    
  if(LSP.progressDroply == undefined){
      Storage.player.progressDroply = 0;
      localStorage.setItem("DroplyPlayer", JSON.stringify(Storage.player))
  } else{
      Storage.player.progressDroply = LSP.progressDroply 
  }

  if(LSP.level == undefined){
    Storage.player.level = 1;
    localStorage.setItem("DroplyPlayer", JSON.stringify(Storage.player))
  } else{
      Storage.player.level = LSP.level 
  }

  if(LSP.winNumber == undefined){
    Storage.player.winNumber = 0;
    localStorage.setItem("DroplyPlayer", JSON.stringify(Storage.player))
  } else{
      Storage.player.winNumber = LSP.winNumber 
  }

  if(LSP.lostStatus == undefined){
    Storage.player.lostStatus = false;
    localStorage.setItem("DroplyPlayer", JSON.stringify(Storage.player))
  } else{
      Storage.player.lostStatus = LSP.lostStatus 
  }

}

function getWord(){

  let randomnumber = GetRandomInt(0, filteredwords.length)
  word = filteredwords[randomnumber].word
}


function showMessage(message){
  $(".message").text(message)
  $(".message").removeClass('hide-message')
  setTimeout(function(){
    $(".message").addClass('hide-message')
  }, 1000)
}