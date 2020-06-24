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

var locallyStoredHighScores = JSON.parse( localStorage.getItem("quiz-high-scores") );

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
    { question: "Commonly used datatypes in JavaScript DO NOT include:",
     options: ["strings","booleans","alerts","numbers"],
     correct: 2,
     points: 5
    },
    { question: "Arrays in JavaScript can be used to store:",
        options: ["numbers and strings","other arrays","booleans","all of the above"],
        correct: 3,
        points: 10
    },
    { question: "The condition in an if/else statement is enclosed within ______:",
    options: ["quotes","curly brackets","parenthesis","square brackets"],
    correct: 2,
    points: 4
    },
];
var timeAllotted = questions.length * 6;  // seconds allotted for entire quiz

// Set pointers to the DOM elements
var startButton =       document.getElementById("start-button");
var questionBody =      document.getElementById("question-body");
var questionDiv =       document.getElementById("question-div");
var optionsDiv =        document.getElementById("options-div");
var countDownDisplay =  document.getElementById("count-down");
var correctDisplay =    document.getElementById("correct-display");
var incorrectDisplay =  document.getElementById("incorrect-display");
var scoreDisplay =      document.getElementById("score");
var finalScoreDisplay = document.getElementById("final-score");
var finalScore =        document.getElementById("final-score-value");
var saveButton =        document.getElementById("save-button");
var dontSaveButton =    document.getElementById("dont-save-button");
var initialsInput =     document.getElementById("initials");
// Pseudo code:                             //
// Start the timer countdown
// display a question
// update the visual display of the timer
// respond to user response, and keep track of their score
// if user answer all questions / or timer runs out, end the quiz,
// and display the final score
// then ask for initials and display the high-score list

var restart = function(event) {
    event.preventDefault();
    if (finalScoreDisplay) {
        finalScoreDisplay.style.display = "none";
    }
    startButton.style.display = "block";
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
    displayQuestion();
}

// Don't start the quiz until the user hits the start button
startButton.onclick = startQuiz;

var displayQuestion = function() {
  
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
}

var displayCorrectness = function() {
    correctDisplay.style.display="block";
    updateDisplay();
    pause = setTimeout( nextQuestion, pauseAmount * 1000);
}

var displayInCorrectness = function() {
    incorrectDisplay.style.display="block";
    updateDisplay();
    pause = setTimeout( nextQuestion, pauseAmount  * 1000);
}



var nextQuestion = function () {
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
    console.log(timer);
}

var endQuiz = function() {
    

    clearTimeout(quizTimer);
    clearInterval(countDown);
    console.log("ended.");

    questionBody.style.display = "none";
    displayFinalScore();
}


var displayFinalScore = function() {
    finalScore.textContent = score;
    finalScoreDisplay.style.display = "block";
    saveButton.onclick=saveScore;
    dontSaveButton.onclick=restart;
}


var saveScore = function(event) {
    event.preventDefault();
    if (initialsInput && initialsInput.value) {
      userInitials = initialsInput.value.toUpperCase();

      // create a new score object
      highScores.push({ "initials": userInitials, "score": score});

      //store a stringified version of our entire high-scores object into LocalStorage
      localStorage.setItem("quiz-high-scores", JSON.stringify(highScores));
    }
    
}