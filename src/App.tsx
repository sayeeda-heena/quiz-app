 import './index.css'
import { useState, useEffect } from 'react';

type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

const SAMPLE_QUESTIONS: Question[] = [
   { id: 1, question: "Which language runs in a web browser?", options: ["Java", "C", "Python", "JavaScript"], correctIndex: 3 },
   { id: 2, question: "Which company developed React?", options: ["Google", "Facebook", "Microsoft", "Twitter"], correctIndex: 1 },
   { id: 3, question: "What's the HTML tag for the largest heading?", options: ["<h1>", "<head>", "<title>", "<header>"], correctIndex: 0 },
   { id: 4, question: "Which operator is used for assignment in JavaScript?", options: ["==", "=", "===", "+="], correctIndex: 1 },
  
  ]; 

function App() {
  const QUESTIONS = SAMPLE_QUESTIONS;
  const QUESTION_TIMER = 10; //timer 10s

  const [index, setIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIMER);
  const [isAnswerRevealed, setIsAnswerReleaved] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if(finished || isAnswerRevealed) return;
    if(timeLeft <= 0 ) {
      setIsAnswerReleaved(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t-1),1000);
    return () => clearTimeout(timer);
  },[timeLeft, finished, isAnswerRevealed]);

   useEffect(() => {
    setTimeLeft(QUESTION_TIMER);
    setSelected(null);
    setIsAnswerReleaved(false);
   }, [index]);

   function handleSelect(optionIndex: number) {
    if(isAnswerRevealed) return;
    setSelected(optionIndex);
    setIsAnswerReleaved(true);
    const q = QUESTIONS[index];
    if(optionIndex === q.correctIndex) setScore((s) => s + 1);
   }

   function handleNext() {
    if(index + 1 < QUESTIONS.length) {
      setIndex((i) => i + 1);

    }else{
      setFinished(true);
    }
   }

   function playAgain() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(QUESTION_TIMER);
    setIsAnswerReleaved(false);
    setFinished(false);
   }

   function handleExit() {
    try{
      window.close(); // attempt to close the tab
    }catch {
      // fallback in case window.close is blocked
      window.location.href = "about:blank";
    }

   }

   if (finished) {
    let message = "";
    if(score === QUESTIONS.length) message = "Excellent";
    else if(score >= Math.ceil(QUESTIONS.length/2)) message = "Good Job!"
    else message = "Better luck next time!";

    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-white p-4'>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 text-center">
        <h2 className='text-3xl font-bold mb-2'>Quiz Completed</h2>
        <p text-lg text-gray-600 mb-2>Your score</p>
        <div className="flex items-baseline justify-center gap-3 mb-4">
        <span className="text-5xl font-extrabold text-indigo-600">{score}</span>
        <span className="text-lg text-gray-500">/ {QUESTIONS.length}</span>
        </div>
        <p className="text-xl font-medium mb-6">{message}</p>
        <div className="flex justify-center gap-3">
          <button onClick={playAgain} className='px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:opacity-95'>
            Play Again</button>
          <button onClick={handleExit} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
            Exit</button>
        </div>
      </div>
      </div>
    );
   }

   const q = QUESTIONS[index];

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
   <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Question {index + 1} of {QUESTIONS.length}</h3>
  <div className="text-right">
  <div className="text-sm text-gray-500">Time left</div>
  <div className="text-xl font-bold">{timeLeft}s</div>
  </div>
  </div>
  
  <div className="mb-6">
<h2 className="text-2xl font-semibold mb-3">{q.question}</h2>
<div className='grid gap-3'>
 {q.options.map((opt, i) => {
  const isSelected = selected === i;
  const isCorrect = q.correctIndex === 1;
  const base = "p-3 rounded-lg border cursor-pointer transition-all";
  let style = "bg-white border-gray-200";
  if(isAnswerRevealed) {
    if (isCorrect) style = "bg-green-50 border-green-300";
    else if (isSelected && !isCorrect) style ="bg-red-50 border-red-300";
    else style ="bg-white border-gray-200 opacity-60";
  }else if (isSelected) style ="bg-indigo-50 border-indigo-300";
  return (
    <button key={i} onClick={() => handleSelect(i)} disabled={isAnswerRevealed}
     className={`${base} ${style} flex items-center justify-between`}>
      <span className="text-left">{opt}</span>
      <span className="text-sm text-gray-500">{String.fromCharCode(65 + i)}</span>

     </button>
  );
 })}

</div>
</div>

{isAnswerRevealed && (
<div className="mt-4 flex justify-center">
<button onClick={handleNext} className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:opacity-95">
Next
</button>
</div>
)}

  </div>
</div>

   );

}

export default App;
