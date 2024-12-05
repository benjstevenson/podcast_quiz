let currentQuestionIndex = 0;
let score = 0;
let quizData;

// Fetch quiz data
fetch('quiz-data.json')
    .then(response => response.json())
    .then(data => {
        quizData = data.questions;
        loadQuestion();
    });

function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const choicesContainer = document.getElementById('choices-container');
    const currentQuestion = quizData[currentQuestionIndex];

    // Clear previous question
    questionContainer.innerHTML = '';
    choicesContainer.innerHTML = '';

    // Display question
    const questionElement = document.createElement('h2');
    questionElement.textContent = currentQuestion.question;
    questionContainer.appendChild(questionElement);

    // Create choice buttons
    currentQuestion.choices.forEach((choice, index) => {
        const choiceElement = document.createElement('div');
        choiceElement.classList.add('choice');
        choiceElement.textContent = choice;
        choiceElement.addEventListener('click', () => selectChoice(choiceElement, index));
        choicesContainer.appendChild(choiceElement);
    });
}

function selectChoice(choiceElement, choiceIndex) {
    // Remove previous selections
    document.querySelectorAll('.choice').forEach(el => el.classList.remove('selected'));
    choiceElement.classList.add('selected');
    
    // Store selected choice
    window.selectedChoice = choiceIndex;
}

document.getElementById('submit-btn').addEventListener('click', () => {
    const resultContainer = document.getElementById('result-container');
    const currentQuestion = quizData[currentQuestionIndex];
    
    if (window.selectedChoice === undefined) {
        alert('Please select an answer');
        return;
    }

    // Highlight correct and incorrect choices
    document.querySelectorAll('.choice').forEach((el, index) => {
        if (index === currentQuestion.correctAnswer) {
            el.classList.add('correct');
        }
        if (index === window.selectedChoice && index !== currentQuestion.correctAnswer) {
            el.classList.add('incorrect');
        }
    });

    // Update score
    if (window.selectedChoice === currentQuestion.correctAnswer) {
        score++;
        document.getElementById('score').textContent = score;
    }

    // Show explanation
    resultContainer.innerHTML = `
        <strong>Explanation:</strong> 
        ${currentQuestion.explanation}
    `;

    // Move to next question or end quiz
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
            resultContainer.innerHTML = '';
            window.selectedChoice = undefined;
        } else {
            endQuiz();
        }
    }, 3000);
});

function endQuiz() {
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your final score is ${score} out of ${quizData.length}</p>
    `;
}