//   Javascript code written by Bat Dority

// Global Settings
var timer;  // this is the main timer VALUE variable -- (not the timeOut object) 
var pause; // temporary pause while we display right or wrong 
var pauseAmount = 1;  // seconds to pause after displaying the answer
var quizTimer;  // this will become the main timeOut object
var countDown;  // this is the Interval Timer that updates the display every second

var questionNumber;
var correctAudio = new Audio('correct.mp3');
var incorrectAudio = new Audio('incorrect.mp3');
var highScores = [];

var highScoresString = localStorage.getItem("quiz-high-scores");

var locallyStoredHighScores;

if (highScoresString) {
    locallyStoredHighScores = JSON.parse( highScoresString );
}

if (locallyStoredHighScores) {
  highScores = locallyStoredHighScores; 
}
correctAudio.volume = .3;
incorrectAudio.volume = .3;

//   Data -- questions and answer options
//   This is an array of question objects that contain
//   the following keys:  question, options, correct, points
//   question:  a string
//   options:  an array of strings
//   correct:  an index into the array of options, for the correct answer
//   points:  a point value to score this question based on it's difficulty level

const questions = [
    { 
        question: "Commonly used datatypes in JavaScript DO NOT include:",
        options: ["strings","booleans","alerts","numbers"],
        correct: 2,
        points: 5
    },
    { 
        question: "Arrays in JavaScript can be used to store:",
        options: ["numbers and strings","other arrays","booleans","all of the above"],
        correct: 3,
        points: 10
    },
    { 
        question: "The condition in an if/else statement is enclosed within ______:",
        options: ["quotes","curly brackets","parenthesis","square brackets"],
        correct: 2,
        points: 4
    },
    {
        question: ".forEach() is a ...",
        options: ["custom function", "array prototype method", "window object", "string literal"],
        correct: 1,
        points:15
    },
    {
        question: "jQuery is ...",
        options: ["native to Javascript", "a Javascript function", "a library", "incompatible with Javascript"],
        correct: 2,
        points:10
    }
];
var timeAllotted = questions.length * 6;  // seconds allotted for entire quiz

// Set pointers to the DOM elements
var startButton =       document.getElementById("start-button");
var questionBody =      document.getElementById("question-body");
var questionDiv =       document.getElementById("question-div");
var questionNumberDisplay = document.getElementById("question-number");
var optionsDiv =        document.getElementById("options-div");
var timeRemaining =    document.getElementById("time-remaining");
var countDownDisplay =  document.getElementById("count-down");
var correctDisplay =    document.getElementById("correct-display");
var incorrectDisplay =  document.getElementById("incorrect-display");
var scoreDisplay =      document.getElementById("score");
var scoreBox =          document.getElementById("score-box");
var finalScoreDisplay = document.getElementById("final-score");
var finalScore =        document.getElementById("final-score-value");

var saveButton =        document.getElementById("save-button");
var dontSaveButton =    document.getElementById("dont-save-button");
var initialsInput =     document.getElementById("initials");
var highScoresButton =  document.getElementById("high-score-button");
var highScoresDisplay = document.getElementById("high-scores-display");
var highScoresList =    document.getElementById("high-scores-list");
var playAgainButton =   document.getElementById("play-again-button");
var clearHighScoresButton= document.getElementById("clear-high-scores");
// Pseudo code:                             //
// Start the timer countdown
// display a question
// update the visual display of the timer
// respond to user response, and keep track of their score
// if user answer all questions / or timer runs out, end the quiz,
// and display the final score
// then ask for initials and display the high-score list

// this function gets called from multiple places, so we need to
// first check to see if we got sent an event object or not
var restart = function(event) {
    if (event) { event.preventDefault(); }
    if (highScoresDisplay) {
        highScoresDisplay.style.display = "none";
    }
    if (finalScoreDisplay) {
        finalScoreDisplay.style.display = "none";
    }
    startButton.style.display = "block";
    scoreBox.style.display = "none";
}

var startQuiz = function() {
    timer = timeAllotted;
    countDownDisplay.textContent = timer;
    
    // update the display every second
    countDown = setInterval(countDown, 1000);

    // this is the main quizTimer 
    quizTimer = setTimeout( endQuiz, timeAllotted * 1000);

    // remove the Start Button from the display
    startButton.style.display= "none";
    // reveal the Question Body on the page
    questionBody.style.display="block";

    // Display the first question to the uesr.
    questionNumber = 0;
    score = 0;
    timeRemaining.style.display="block";
    countDownDisplay.style.display="block";
    scoreBox.style.display = "none";
    displayQuestion();
}

// Don't start the quiz until the user hits the start button
startButton.onclick = startQuiz;

var displayQuestion = function() {
  
    questionNumberDisplay.textContent = questionNumber +1;
    console.log(questionNumber);
    displayQuestionTitle();
    displayQuestionOptions();
}

var countDown = function() {
    timer--;
    updateDisplay();
}


var displayQuestionTitle = function() {
    var qtitle= document.createElement("p");
    var questionTitle = questions[questionNumber].question;
    qtitle.setAttribute("class", "question-title");
    qtitle.textContent = questionTitle;

    // empty out the previous question's title
    if (questionDiv.hasChildNodes()) {
        questionDiv.removeChild(questionDiv.firstChild);
     }
    questionDiv.append(qtitle);
}




var handleOption = function(event) {
    var userChoice = event.target.getAttribute('data-choice');
    
    // comparing a string to an int here - thats why I'm using the double equals
    if (userChoice == questions[questionNumber].correct) {
        handleCorrectChoice();
    }  else {
        handleIncorrectChoice();
    }
}

var handleCorrectChoice = function() {
    correctAudio.load();
    correctAudio.play();
    score = score + questions[questionNumber].points;
    displayCorrectness();
}

var handleIncorrectChoice = function() {
    // As per the acceptance criteria, we are reducing the overall time left
    // when the user gets a wrong answer.
    // This seems like adding insult to injury to me personally
    timer = timer -1;
    incorrectAudio.load(); 
    incorrectAudio.play();
    displayInCorrectness();
   
    
}
var displayQuestionOptions = function() {
    
    // empty out the previous question's options
    while (optionsDiv.hasChildNodes()) {
        optionsDiv.removeChild(optionsDiv.firstChild);
     }

   
    questions[questionNumber].options.forEach( function (option, index) {
        var thisOption = document.createElement("p");
        thisOption.textContent = option;
        thisOption.setAttribute("class", "option");
        thisOption.setAttribute("data-choice", index);
        thisOption.onclick=handleOption;
        optionsDiv.append(thisOption);
    });
    optionsDiv.style.display="block";
}

var displayCorrectness = function() {
    optionsDiv.style.display="none";
    correctDisplay.style.display="block";
    updateDisplay();
    pause = setTimeout( nextQuestion, pauseAmount * 1000);
}

var displayInCorrectness = function() {
    optionsDiv.style.display="none";
    incorrectDisplay.style.display="block";
    updateDisplay();
    pause = setTimeout( nextQuestion, pauseAmount  * 1000);
}



var nextQuestion = function () {
    scoreBox.style.display = "inline-block";
    clearTimeout(pause);
     // give the user back the time that was taken while we paused to
     // display "correct" or "incorrect"
    timer += pauseAmount;   
    
   
    correctDisplay.style.display="none";
    incorrectDisplay.style.display="none";
    questionNumber++;
    
    if ((questionNumber < questions.length) || (timer <= 0)) {
        displayQuestion();
    } else {
        endQuiz();
    }
    
}

var updateDisplay = function() {
    countDownDisplay.textContent = timer;  
    scoreDisplay.textContent = score;
 
}

var endQuiz = function() {
    
    clearTimeout(quizTimer);
    clearInterval(countDown);

    questionBody.style.display = "none";
    displayFinalScore();
}


var displayFinalScore = function() {
    countDownDisplay.style.display="none";
    timeRemaining.style.display="none";
    finalScore.textContent = score;
    initialsInput.value = "";
    finalScoreDisplay.style.display = "block";
    saveButton.onclick =        saveScore;
    dontSaveButton.onclick =    restart;
    highScoresButton.onclick =  displayHighScores;
}


var saveScore = function(event) {
    event.preventDefault();
    if (initialsInput && initialsInput.value) {
      userInitials = initialsInput.value.toUpperCase();

      // create a new score object
      highScores.push({ "initials": userInitials, "score": score});

      //store a stringified version of our entire high-scores object into LocalStorage
      localStorage.setItem("quiz-high-scores", JSON.stringify(highScores));

      displayHighScores();
    }
    
}

var displayHighScores = function(event) {
    // this function gets called from 2 different places
    // so we need to check if it was sent an event or not
    if (event) { event.preventDefault(); }

    finalScoreDisplay.style.display = "none";

    if (highScores.length > 0) {

        while(highScoresList.firstChild) {
            highScoresList.firstChild.remove();
        }

        highScores.sort((a, b) => (a.score < b.score) ? 1 : -1)

        highScores.forEach( function(element,index) {
    
            var entryInitials = document.createElement('p');
            entryInitials.classList.add("initials-element");
            if (index == 0) {
                entryInitials.classList.add("initials-element-winner");
            }
            entryInitials.textContent = element["initials"];
            highScoresList.appendChild(entryInitials);
            var entryScore = document.createElement('p');
            entryScore.classList.add("scores-element");
            if (index == 0) {
                entryScore.classList.add("initials-element-winner");
            }
            entryScore.textContent = element.score;
            highScoresList.appendChild(entryScore);
            
        } );

        playAgainButton.onclick=restart;
        clearHighScoresButton.onclick=clearHighScores;
        highScoresDisplay.style.display = "block";
    } else {
        restart();
    }

}

var clearHighScores = function() {
    highScores = [];
    localStorage.setItem("quiz-high-scores", "");
    restart();
}
