# code-quiz
This application displays a series of questions to quiz the user on their knowledge of Javascript.

<a href='https://b0rgbart3.github.io/code-quiz2/'>Live Demo</a>
## User Story

```
AS A coding bootcamp student
I WANT to take a timed quiz on JavaScript fundamentals that stores high scores
SO THAT I can gauge my progress compared to my peers
```

## Acceptance Criteria

```
GIVEN I am taking a code quiz
WHEN I click the start button
THEN a timer starts and I am presented with a question
WHEN I answer a question
THEN I am presented with another question
WHEN I answer a question incorrectly
THEN time is subtracted from the clock
WHEN all questions are answered or the timer reaches 0
THEN the game is over
WHEN the game is over
THEN I can save my initials and score
```
## Features

1.  Each question has a weighted-score value from 1 - 10.  
2.  The final score is displayed to the user at the end of the quiz.
3.  The user is given the option to save their score, with their initials, so their score can be compred against others.
4.  Keeps track of the users current and final score
5.  Displays high scores with player initials in a list
6.  Stores a list of highscores in local storage (data persistence)
7.  Allows user to play again.
8.  As per acceptance criteria:
    when the user gets a wrong answer, we reduce the
    time they have left

## Technologies
1.  Javascript
2.  HTML5 / CSS3
3.  HTML5 based audio with MP3s for correct and incorrect answers
4.  Sass compiler for button styling

## screens
![Question Screen](question.jpg)

![HighScores Screen](highscores.jpg)