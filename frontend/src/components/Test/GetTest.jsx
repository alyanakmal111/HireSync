import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from '../Layout/Navbar';

const GetTest = () => {
  const [testData, setTestData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigateTo = useNavigate();
  const [unansweredQuestionsError, setUnansweredQuestionsError] = useState(false);

  useEffect(() => {
    const job = localStorage.getItem('jobId');
    const fetchTestData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/v1/test/getTest/` + job);
        const data = await response.json();
        
        setTestData(data.test || []);
        setJobTitle(data.jobTitle || 'Technical Assessment');
        
        const initialAnswers = (data.test || []).reduce((acc, question) => {
          acc[question._id] = '';
          return acc;
        }, {});
        setAnswers(initialAnswers);
      } catch (error) {
        console.error('Error fetching test data:', error);
        toast.error('Failed to load test. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, []);

  const handleSubmit = useCallback(async () => {
    const unansweredQuestions = testData.filter(question => !answers[question._id]);
    if (unansweredQuestions.length > 0) {
      setUnansweredQuestionsError(true);
      return;
    }

    setSubmitting(true);
    
    const formattedAnswers = testData.map(question => {
      const answerObj = question.options.find(option => option.isAnswer);
      return {
        id: answerObj._id,
        answer: answerObj.value,
      };
    });

    const data = {
      answers: formattedAnswers,
    };

    const job = localStorage.getItem('jobId');
    const application = localStorage.getItem('application');
    
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/test/submitTest/${job}/${application}`, data);
      console.log('Test submitted successfully:', response.data);
      toast.success('Test submitted successfully!');
      navigateTo("/");
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [testData, answers, navigateTo]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !submitting) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, submitting, handleSubmit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));
    setUnansweredQuestionsError(false);
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(answer => answer !== '').length;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="test-loading">
          <div className="loading-spinner"></div>
          <p>Loading your assessment...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="test-page">
        <div className="test-container-modern">
          {/* Test Header */}
          <div className="test-header">
            <div className="test-info">
              <h1 className="test-title">{jobTitle}</h1>
              <p className="test-subtitle">Technical Assessment</p>
            </div>
            <div className="test-timer">
              <div className="timer-display">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span className={timeRemaining < 300 ? 'timer-warning' : ''}>{formatTime(timeRemaining)}</span>
              </div>
              <p className="timer-label">Time Remaining</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="test-progress">
            <div className="progress-info">
              <span>Question {currentQuestionIndex + 1} of {testData.length}</span>
              <span>{getAnsweredCount()}/{testData.length} answered</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / testData.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          {testData.length > 0 && (
            <div className="question-card">
              <div className="question-header">
                <h2 className="question-text">{testData[currentQuestionIndex].question}</h2>
              </div>
              
              <div className="options-list">
                {testData[currentQuestionIndex].options.map((option, index) => (
                  <label key={option._id} className="option-item">
                    <input
                      type="radio"
                      name={testData[currentQuestionIndex]._id}
                      value={option.value}
                      checked={answers[testData[currentQuestionIndex]._id] === option.value}
                      onChange={() => handleAnswerChange(testData[currentQuestionIndex]._id, option.value)}
                      className="option-radio"
                    />
                    <div className="option-content">
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="option-text">{option.value}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Question Navigation */}
          <div className="question-navigation">
            <button 
              onClick={previousQuestion} 
              disabled={currentQuestionIndex === 0}
              className="nav-btn prev-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Previous
            </button>

            <div className="question-numbers">
              {testData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`question-number ${index === currentQuestionIndex ? 'active' : ''} ${answers[testData[index]._id] ? 'answered' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={nextQuestion} 
              disabled={currentQuestionIndex === testData.length - 1}
              className="nav-btn next-btn"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {unansweredQuestionsError && (
            <div className="error-message-modern">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Please answer all questions before submitting the test.
            </div>
          )}

          {/* Submit Button */}
          <div className="test-actions">
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="submit-test-btn"
            >
              {submitting ? (
                <>
                  <div className="spinner"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13"/>
                    <polygon points="22,2 15,22 11,13 2,9"/>
                  </svg>
                  Submit Test
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetTest;
