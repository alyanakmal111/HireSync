

import { useState } from 'react';
import axios from 'axios';
import '../../App.css'; 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from '../Layout/Navbar';

function CreateTest() {
    const navigateTo = useNavigate();
    const [questions, setQuestions] = useState([
        {
            question: '',
            options: [
                { value: '', isAnswer: false },
                { value: '', isAnswer: false },
                { value: '', isAnswer: false },
                { value: '', isAnswer: false }
            ]
        }
    ]);

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex].value = value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.forEach((option, i) => {
            newQuestions[questionIndex].options[i].isAnswer = i === optionIndex;
        });
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: '',
                options: [
                    { value: '', isAnswer: false },
                    { value: '', isAnswer: false },
                    { value: '', isAnswer: false },
                    { value: '', isAnswer: false }
                ]
            }
        ]);
    };

    const removeQuestion = (index) => {
        if (index === 0) return; // Cannot remove the first question
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };
    
    const handleSubmit = () => {
        const job=localStorage.getItem('jobId')
        axios.post('http://localhost:4000/api/v1/test/createTest/'+job, { questions })
        
            .then(response => {
                console.log('Success:', response.data);
                toast.success('Test created successfully');
                navigateTo("/");
                
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error(error.response.data.message);
            });
    };

    return (
        <div className="create_test_page">
            <Navbar />
            <div className="create_test_container">
                <h2>Create Assessment Test</h2>
                <div className="questions_wrapper">
                    {questions.map((q, index) => (
                        <div key={index} className="question_card">
                            <div className="question_header">
                                <span className="question_number">Question {index + 1}</span>
                                {index > 0 && (
                                    <button 
                                        className="remove_question_btn"
                                        onClick={() => removeQuestion(index)}
                                        title="Remove this question"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <div className="question_content">
                                <label>Question</label>
                                <textarea 
                                    className="question_textarea"
                                    value={q.question} 
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder="Enter your question here..."
                                />
                                <div className="options_section">
                                    <label>Options (Select the correct answer)</label>
                                    {q.options.map((option, optionIndex) => (
                                        <div className='option_wrapper' key={optionIndex}>
                                            <input
                                                type="radio"
                                                name={`question_${index}`}
                                                checked={option.isAnswer}
                                                onChange={() => handleAnswerChange(index, optionIndex)}
                                                className="option_radio"
                                            />
                                            <input
                                                type="text"
                                                value={option.value}
                                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                placeholder={`Option ${optionIndex + 1}`}
                                                className="option_input"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="action_buttons">
                    <button className='add_question_btn' onClick={addQuestion}>
                        <span>+</span> Add Question
                    </button>
                    <button className='submit_test_btn' onClick={handleSubmit}>
                        Submit Test
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateTest;
