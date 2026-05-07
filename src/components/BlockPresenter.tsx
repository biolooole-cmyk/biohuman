import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, Lightbulb, BookOpen, AlertTriangle } from 'lucide-react';
import { CourseBlock, QuizQuestion, QuizOption } from '../types';

interface BlockPresenterProps {
  block: CourseBlock;
  onComplete: (score: number) => void;
  isCompleted: boolean;
}

export const BlockPresenter: React.FC<BlockPresenterProps> = ({ block, onComplete, isCompleted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<string | null>(null);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (isCompleted || answers[questionId] !== undefined) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation(questionId);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < block.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finalize
      const correctCount = block.questions.reduce((acc, q) => {
        const ansIdx = answers[q.id];
        return q.options[ansIdx]?.isCorrect ? acc + 1 : acc;
      }, 0);
      onComplete((correctCount / block.questions.length) * 100);
    }
  };

  const currentQ = block.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (answers[currentQ?.id] !== undefined ? 1 : 0)) / block.questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Sidebar Info */}
        <div className="lg:col-span-3 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {block.id.substring(0, 2).toUpperCase()}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Блок Навчання</span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-8 leading-tight">{block.title}</h3>
          
          <div className="mt-auto space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Глосарій
              </h4>
              <div className="space-y-4">
                {block.glossary.slice(0, 2).map((g, i) => (
                  <div key={i}>
                    <div className="text-blue-600 font-bold text-xs mb-1">{g.term}</div>
                    <p className="text-[11px] text-slate-500 leading-normal italic">{g.simpleExplanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-6 p-8 md:p-10 border-r border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-extrabold uppercase tracking-tight">Теорія модуля</span>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base space-y-6 mb-8 pr-4">
            <p className="whitespace-pre-line">{block.theory}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {block.analogy && (
              <div className="bg-slate-50 p-5 border-l-4 border-blue-500 rounded-r-2xl">
                <span className="block text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest">Аналогія з життя</span>
                <p className="text-sm text-slate-700 italic leading-relaxed">{block.analogy}</p>
              </div>
            )}
            {block.lifeApplication && (
              <div className="bg-green-50 p-5 border-l-4 border-green-500 rounded-r-2xl">
                <span className="block text-[10px] font-black text-green-600 mb-2 uppercase tracking-widest">Застосування</span>
                <p className="text-sm text-slate-700 italic leading-relaxed">{block.lifeApplication}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="lg:col-span-3 p-8 bg-slate-900 text-white flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px] font-extrabold uppercase tracking-tight">Практика</span>
            <h3 className="text-sm font-bold">Бліц-тест</h3>
          </div>
          
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="wait">
              {currentQ && (
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                    <span>Питання {currentQuestionIndex + 1} з {block.questions.length}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-300 leading-normal">{currentQ.question}</p>
                  <div className="flex flex-col gap-2">
                    {currentQ.options.map((opt, oIndex) => {
                      const isSelected = answers[currentQ.id] === oIndex;
                      const hasAnswered = answers[currentQ.id] !== undefined;
                      
                      let btnClass = "p-3 text-left border rounded-xl text-[11px] font-bold transition-all ";
                      if (!hasAnswered) {
                        btnClass += "border-slate-800 hover:border-blue-500 hover:bg-slate-800";
                      } else if (opt.isCorrect) {
                        btnClass += "border-green-500 bg-green-500/10 text-green-400";
                      } else if (isSelected) {
                        btnClass += "border-red-500 bg-red-500/10 text-red-400";
                      } else {
                        btnClass += "border-slate-800 opacity-30";
                      }

                      return (
                        <button
                          key={oIndex}
                          disabled={hasAnswered}
                          onClick={() => handleAnswer(currentQ.id, oIndex)}
                          className={btnClass}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                  
                  {answers[currentQ.id] !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, h: 0 }}
                      animate={{ opacity: 1, h: 'auto' }}
                      className="space-y-4"
                    >
                      <div className="text-[10px] text-slate-400 italic leading-snug p-2 bg-slate-800/50 rounded-lg">
                        {currentQ.options[answers[currentQ.id]].explanation}
                      </div>
                      
                      <button
                        onClick={nextQuestion}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group"
                      >
                        {currentQuestionIndex < block.questions.length - 1 ? (
                          <>Далі <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span></>
                        ) : (
                          'Завершити блок'
                        )}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {isCompleted && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Блок успішно пройдено!</h4>
                  <p className="text-[10px] text-slate-500">Ви можете переходити до наступного матеріалу.</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-3">
             <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isCompleted ? 'bg-blue-500' : 'bg-slate-700'}`} 
                  style={{ width: `${progress}%` }}
                />
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase">{isCompleted ? 'Завершено' : `${Math.round(progress)}%`}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
