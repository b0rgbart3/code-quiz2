
//   Javascript code written by Bat Dority

// Global Settings
const delay = 6;  // seconds allotted for each question
const pause = .3;  // seconds to pause after displaying the answer

var correctAudio = new Audio('correct.mp3');
var incorrectAudio = new Audio('incorrect.mp3');
correctAudio.volume = .2;
incorrectAudio.volume = .2;

//   Data -- questions and answer options
//   This is an array of question objects that contain
//   the following keys:  question, options, correct, points
//   question:  a string
//   options:  an array of strings
//   correct:  an index into the array of options, for the correct answer
//   points:  a point value to score this question based on
//            it's difficulty level
const javascriptQuestions = [
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

var questionSet = [javascriptQuestions];
var questionNumber;

// keep an array of objects that documents the users responses
var answeredQuestions = [];  


// Present the question to the user, with buttons for each option
// when the user selects an option, determine if it was correct,
// then let them know if they got it right or not, and keep track of their score
// At the end of the questions, present the user with their score and ask
// for their initials, and store their initials and score in the highScores array

var chosenSetIndex = 0;
var questions = questionSet[chosenSetIndex];
var questionTimer;
var score;

var gameOver;
var paused;
var totalPoints;
var highScores = [];

var correctDisplayText = document.getElementById('correct-display');
var incorrectDisplayText = document.getElementById('incorrect-display');
var startButton = document.getElementById('start-button');
var questionBody = document.getElementById('question-body');
var scoreDisplayText = document.getElementById('score');
var finalScoreDisplay = document.getElementById('final-score');
var finalScoreValue = document.getElementById('final-score-value');
var highScoresDisplay = document.getElementById('high-scores-display');
var highScoresList = document.getElementById('high-scores-list');
var countDown = document.getElementById('count-down');


var initialsInput = document.getElementById('initials');
var saveButton = document.getElementById('save-button')
var dontSaveButton = document.getElementById('dont-save-button');
var highScoreButton = document.getElementById('high-score-button');
var playAgainButton = document.getElementById('play-again-button');


var init = function() {
     questionNumber = 0;
     score = 0;

     scoreDisplayText.textContent = score;
     gameOver = false;
     paused = false;
     totalPoints = 0;
}

init();

startButton.onclick=function() {

    startButton.style.display = "none";
    questionBody.style.display = "block";

    // Let the Quiz Begin!
    startQuiz();
};

playAgainButton.onclick = function() {
    highScoresDisplay.style.display = "none";
    questionBody.style.display = "block";
    
    // Let the Quiz Begin!
    startQuiz();
}

saveButton.onclick=function(event) {
    event.preventDefault();
    var userInitials = initialsInput.value.toUpperCase();
    if (userInitials.length > 1) {
        console.log('Save Score for: ' + userInitials + ", score: " + score);
        var highScoreObject = {"initials": userInitials, "score": score};
        highScores.push(highScoreObject);
        console.log(highScores);
        displayHighScores();
    }
};

dontSaveButton.onclick=function(event) {
    event.preventDefault();
    restart();
}
var restart= function() {
    finalScoreDisplay.style.display = "none";
    questionBody.style.display = "block";
    init();
    startQuiz();
}

highScoreButton.onclick=function(event) {
    event.preventDefault();
    displayHighScores();
}

var displayQuestionBody = function() {
    displayQuestion(questions[questionNumber]);
    displayOptions(questions[questionNumber]);
}

var displayHighScores = function() {
    if (highScores.length > 0) {
            finalScoreDisplay.style.display = "none";

            while(highScoresList.firstChild) {
                highScoresList.firstChild.remove();
            }

            highScores.sort((a, b) => (a.score < b.score) ? 1 : -1)

            highScores.forEach( function(element,index) {
            console.log("High score: " + element["initials"] + ", " + element.score);
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
        });

        highScoresDisplay.style.display = "block";
    } else {
        restart();
    }
}
var displayQuestion = function(question) {

    // Display the Title Text of the Question
    var questionDiv = document.getElementById('question-div');
    var questionTitle = document.createElement('p');
    questionTitle.classList.add("question-title");
    var questionNumberDisplayText = document.getElementById('question-number');
    // Title--------------
    questionTitle.textContent = question.question;

    // If there is already a title nodes, let's start by removing it
    if (questionDiv.firstChild) { questionDiv.firstChild.remove(); }
    questionDiv.appendChild(questionTitle);

    // Display the first question as 1, instead of 0
    questionNumberDisplayText.textContent = questionNumber+1;  
    
}

var displayOptions = function(question) {
      var optionsDiv = document.getElementById('options-div');
      // If there are already child nodes, let's start by removing them
      while( optionsDiv.firstChild ) { optionsDiv.firstChild.remove(); }

      var questionButtons = [];
      question.options.forEach( function(option, index) {
          questionButtons[index] = document.createElement('button');
          questionButtons[index].classList.add('option');
          questionButtons[index].textContent = option;

          // Button On-Click Event Handler
          questionButtons[index].onclick= function(event) {
              
            // only respond to buttons if the question hasn't already been answerd.
            if (!paused) {
              if (event.target.textContent === question.options[question.correct]) {
                  handleCorrectAnswer();
              } else {
                  handleIncorrectAnswer();
              }
            }
          };
          optionsDiv.appendChild(questionButtons[index]);
  
      });
}


var nextQuestion = function() {
    questionNumber++;
    
    if (questionNumber < questions.length) {
        displayQuestionBody();
        startTimer();
    } else {
        endQuiz();
    }
}


var startTimer=function() {
    paused = false;
    seconds = delay;
    questionTimer = setInterval( function() {
        seconds--;
        
            if ( seconds < 1 ) {
                clearInterval(questionTimer);
                countDown.textContent = delay;
                if (!paused) {
                    incorrectAudio.play();
                    nextQuestion();
                }
            } else {
                countDown.textContent = seconds;
            }
    } , 1000);

}

// startQuiz - start things off
var startQuiz = function() {
    init();
    // Kick off the first question
    questionNumber = 0;
    displayQuestionBody();
    startTimer();
}

// handleCorrectAnswer - let the user know they got this answer right
var handleCorrectAnswer = function() {
    var answerObject = { questionNumber: questionNumber, correct: true, value: questions[questionNumber].points };
    paused = true;
    answeredQuestions.push ( answerObject );
    score = score + questions[questionNumber].points;
    //totalPoints = totalPoints + questions[questionNumber].points;
    
    scoreDisplayText.textContent = score;
    correctDisplayText.style.display = "block";

    correctAudio.play();
    displayAnswer();
};

// handleCorrectAnswer - let the user know they got this answer wrong
var handleIncorrectAnswer = function() {
    var answerObject = { questionNumber: questionNumber, correct: false, value: questions[questionNumber].points };
    paused = true;
    answeredQuestions.push ( answerObject );
    scoreDisplayText.textContent = score;
   // totalPoints = totalPoints + questions[questionNumber].points;
    incorrectDisplayText.style.display = "block";
    incorrectAudio.play();
    displayAnswer();
};

// displayAnswer - respond to the users choice 
var displayAnswer = function() {
       // Here, we set a new timer to pause the program flow so the 
       // user can see the response of: Correct!  or Incorrect!
       
        // Clear the main delay timer
        clearTimeout(questionTimer);

        // Create new timer for the pause
        var waitTimeout= setTimeout(endPause, 1000 * pause);
}

// endPause - callback function when the pause timer is done
var endPause = function() {     
    paused = false;
    correctDisplayText.style.display = "none";
    incorrectDisplayText.style.display = "none";
    nextQuestion();
}

// endQuiz - we've displayed all the quesitons, and run out of time
// so let's display the final score

var endQuiz = function() {
    gameOver = true;
    questionBody.style.display = "none";
    initialsInput.value= "";
    totalPoints = 0;
    questions.forEach( function(element) {
        totalPoints += element.points;
    });

    finalScoreDisplay.style.display = "block";
    finalScoreValue.innerHTML = "&nbsp;&nbsp;" + score + " / " + totalPoints;
}