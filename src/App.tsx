/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { courseData } from './data/courseData';
import { BlockPresenter } from './components/BlockPresenter';
import { ResultAnalysis } from './components/ResultAnalysis';
import { GraduationCap, MousePointer2 } from 'lucide-react';

export default function App() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [visibleBlocksCount, setVisibleBlocksCount] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleBlockComplete = (blockId: string, score: number) => {
    setScores(prev => ({ ...prev, [blockId]: score }));
    
    // Reveal next block or finish
    const currentBlockIndex = courseData.blocks.findIndex(b => b.id === blockId);
    if (currentBlockIndex < courseData.blocks.length - 1) {
      if (visibleBlocksCount <= currentBlockIndex + 1) {
        setVisibleBlocksCount(currentBlockIndex + 2);
      }
    } else {
      setIsFinished(true);
    }
  };

  const restartCourse = () => {
    setScores({});
    setVisibleBlocksCount(1);
    setIsFinished(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-8 bg-white border-b border-slate-200 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">
            <GraduationCap size={16} className="text-blue-600" />
            Інтерактивний Модуль • Біосоціальна Природа
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            АНТРОПОЛОГІЯ: <br /> 
            <span className="text-blue-600">МАГІЯ БІОСОЦІУМУ</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
            Досліджуйте фундаментальну різницю між інстинктом та свідомістю 
            у сучасному цифровому середовищі.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2 text-slate-400 group cursor-default">
              <span className="text-[10px] font-black uppercase tracking-wider">Скрольте для початку</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <MousePointer2 size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 gap-12">
          {courseData.blocks.slice(0, visibleBlocksCount).map((block, index) => (
            <BlockPresenter
              key={block.id}
              block={block}
              isCompleted={scores[block.id] !== undefined}
              onComplete={(score) => handleBlockComplete(block.id, score)}
            />
          ))}

          {/* Results Screen */}
          {isFinished && (
            <ResultAnalysis 
              scores={scores} 
              totalBlocks={courseData.blocks.length} 
              onRestart={restartCourse}
            />
          )}
        </div>
      </main>

      <footer className="px-8 py-8 bg-white border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider">
        <div className="flex gap-6 mb-4 md:mb-0">
          <span>Унікальна формула поверхні: S = (2π * r) / (C * Δp)</span>
          <span className="hidden md:inline text-slate-200">|</span>
          <span>Рівень: Intermediate</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          СИСТЕМА: ОНЛАЙН / СИНХРОНІЗАЦІЯ ЗАВЕРШЕНА
        </div>
      </footer>
    </div>
  );
}
