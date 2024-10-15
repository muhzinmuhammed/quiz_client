import React, { useState, useEffect } from 'react';
import data from '../../data/Index'; // Assuming this file has your questions array
import './home.css';
import { useTotalMarkMutation } from '../../features/api/userAuth/userAuth';

const Home = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0); 
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizFinished, setQuizFinished] = useState(false); 
  const [totalMark] = useTotalMarkMutation();

  useEffect(() => {
    // Timer effect
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (timeLeft === 0) {
      handleFinishQuiz(); // Automatically finish quiz if time is up
    }

    return () => clearInterval(timer); // Clean up timer when component unmounts
  }, [timeLeft]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
 

  const handleNextQuestion = () => {
    // Check if the selected option is correct and update score
    if (selectedOption === data[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1); // Increment score for the current question
    }
  
    // Save the selected answer for the current question
    setSelectedAnswers((prevAnswers) => [
      ...prevAnswers,
      { questionIndex: currentQuestion, selected: selectedOption },
    ]);
  
    // Move to the next question if available
    if (currentQuestion < data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(""); // Reset selected option for the next question
    }
  };
  
  const handleFinishQuiz = async () => {
    // Save the selected answer for the last question
    setSelectedAnswers((prevAnswers) => [
      ...prevAnswers,
      { questionIndex: currentQuestion, selected: selectedOption },
    ]);
  
    // Check if the last selected answer is correct and update score
    if (selectedOption == data[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1); // Increment score for the last question
    }
  
    setQuizFinished(true); // Mark quiz as finished
  
    // Prepare data to send to the server
    const userId = JSON.parse(localStorage.getItem('userId'));
  
    // Prepare answers with full question data
    const answers = selectedAnswers.map((answer) => {
      const selectedAnswerText = data[answer.questionIndex][answer.selected]; // Get the selected answer text
      return {
        questionNumber: answer.questionIndex + 1, // Store question number (1-indexed)
        question: data[answer.questionIndex].question, // Include the question text
        selectedAnswer: selectedAnswerText, // Store the selected answer text
        correctAnswer: data[answer.questionIndex][data[answer.questionIndex].answer], // Include the correct answer
      };
    });
  
    // Include the last question's data as well
    const lastSelectedAnswerText = data[currentQuestion][selectedOption]; // Get last selected answer text
    answers.push({
      questionNumber: currentQuestion + 1, // Last question number (1-indexed)
      question: data[currentQuestion].question, // Last question text
      selectedAnswer: lastSelectedAnswerText, // Last selected answer text
      correctAnswer: data[currentQuestion][data[currentQuestion].answer], // Last correct answer
    });
  
    // Final score to send to the server
    console.log(score, "Selected answers with questions");
  
    const result = await totalMark({
      values: {
        totalMark: score, // Ensure score is correctly calculated
        options: answers // Store the selected answers along with questions
      },
      _id: userId
    });
  
    console.log(result);
  };
  
  

  return (
    <div className="quiz-container">
      {!quizFinished ? (
        <>
          <div className="timer">
            Time Left: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </div>
          <h2>Question {currentQuestion + 1} of {data.length}:</h2>
          <p>{data[currentQuestion].question}</p>

          <div className="options">
            <label>
              <input
                type="radio"
                name="option"
                value="option1"
                checked={selectedOption === "option1"}
                onChange={handleOptionChange}
              />
              {data[currentQuestion].option1}
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="option"
                value="option2"
                checked={selectedOption === "option2"}
                onChange={handleOptionChange}
              />
              {data[currentQuestion].option2}
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="option"
                value="option3"
                checked={selectedOption === "option3"}
                onChange={handleOptionChange}
              />
              {data[currentQuestion].option3}
            </label>
          </div>

          {currentQuestion < data.length - 1 ? (
            <button onClick={handleNextQuestion} disabled={!selectedOption}>
              Next
            </button>
          ) : (
            <button onClick={handleFinishQuiz} disabled={!selectedOption}>
              Finish
            </button>
          )}
        </>
      ) : (
        <div className="quiz-results">
          <h2>Quiz Finished!</h2>
         
          <p>Your Score: {score} out of {data.length}</p>
          <p>Correct Answers:</p>
          <ul>
            {data.map((question, index) => {
              const userAnswer = selectedAnswers.find(
                (a) => a.questionIndex === index
              )?.selected;

              return (
                <li key={index}>
                  {index + 1}. {question.question}
                  <br />
                  Correct Answer: {question[question.answer]}
                  <br />
                  Your Answer: {userAnswer ? question[userAnswer] : 'No answer'}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
