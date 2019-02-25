// **************     VARIABLES    *****************

var coin = new Audio("../audio/smw_coin.wav");
var regex = RegExp(/[a-z]/),
    wordEl = document.getElementById('word'),
    inputTextEl = document.getElementById('inputText'), 
    attemptsEl = document.getElementById('attempts'),
    guessesEl = document.getElementById('guesses'),
    solvedEl = document.getElementById('solved'),
    // inputTextEL = coin.play();
    restartBtn = document.getElementById('restart'),
    checkboxEl = document.querySelector('[type=checkbox]'),
    snd = new Audio("../audio/nsmb_course_clear-bonus.wav");

function Data(){
  this.words = ['mario', 'wario', 'peach', 'daisy', 'luigi', 'yoshi', 'waluigi', 'bowser', 'toad', 'donkeykong', 'birdo', 'diddykong', 'rosalina', 'koopatroopa', 'goomba']
  this.randomWord = '' //get random word from some free rest api
  this.guessLetters = []
  this.solved = false
  this.limitedAttempts = false
  this.maxAttempts = 10
  this.progress = '0.00'
}

Data.prototype.setRandomWord = function() {
  var len = this.words.length
  var randomWord = this.words[Math.floor(Math.random() * len)]
  this.randomWord = randomWord
}

Data.prototype.setGuessLetter = function(letter) {
  letter && this.guessLetters.push(letter)
}

Data.prototype.updateProgress = function() {
  const matches = this.randomWord.split('').reduce((acc, letter) => {
    if(this.guessLetters.indexOf(letter) > -1) {
      acc ++
    }
    return acc
  }, 0)
  this.updateProgress
  
  this.progress = (100 * matches / this.randomWord.length).toFixed(2)
}

Data.prototype.updateSolved = function() {
  this.solved = this.randomWord.split('').every(letter => this.guessLetters.indexOf(letter) > -1)
  this.solved && snd.play()
}

Data.prototype.setLimitedAttempts = function(bool) {
  this.limitedAttempts = bool
}

Data.prototype.restart = function() {
  this.setRandomWord()
  this.guessLetters = []
  this.solved = false
  this.progress = '0.00'
  ui.render()
}

function UI(){}

UI.prototype.enableInput = function() {
  inputTextEl.removeAttribute('disabled')
}

UI.prototype.disableInput = function() {
  inputTextEl.setAttribute('disabled', true)
}

UI.prototype.clearInput = function() {
  setTimeout(() => inputTextEl.value = '', 100)
}

UI.prototype.setFocusToInput = function() {
  inputTextEl.focus()
}

UI.prototype.render = function() {
  var randomWord = data.randomWord,
      guessLetters = data.guessLetters
  
  this.clearInput()
  wordEl.innerHTML = ''

  randomWord.split('').forEach(letter => {
    
    if(guessLetters.indexOf(letter) > -1) {
       wordEl.innerHTML += '<span>' + letter + '</span>'
    } else {
       wordEl.innerHTML += "<img src='./assets/images/box.png' height='70px' class='word'>";
    }  
  })
  
  attemptsEl.innerHTML = 'Attempts: ' + guessLetters.length
  guessesEl.innerHTML = 'Tried letters: ' + guessLetters.join(', ')
  
  // first option
  solvedEl.innerHTML = data.solved 
    ? '<span class="success" >Solved: ' + data.solved + '<small> (' + data.progress +'%)</small><span class="progress" style="width: ' + data.progress + '%"></span></span>'
    : '<span class="warning" >Solved: ' + data.solved + '<small> (' + data.progress +'%)</small><span class="progress" style="width: ' + data.progress + '%"></span></span>'
  
  data.solved 
    ? ui.disableInput()
    : ui.enableInput()
    
}

var data = new Data();
var ui = new UI()

data.setRandomWord()
ui.render()
ui.setFocusToInput()

inputTextEl.addEventListener('input', function(e) {
  var key = e.data.toLowerCase()
  // coin here
  coin.play()
  if(regex.test(key) && key !== 'enter' && !data.solved) {
    data.setGuessLetter(key)
    data.updateProgress()
    data.updateSolved()
    ui.render()

    
  } else {
    ui.clearInput()
  }
})

// checkboxEl.addEventListener('input', function(e) {
//   data.setLimitedAttempts(e.target.checked)
//   ui.render()
//   console.log(data)
// })

restartBtn.addEventListener('click', function() {
  data.restart()
  ui.enableInput()
  ui.setFocusToInput()
})