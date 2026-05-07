export interface GlossaryTerm {
  term: string;
  definition: string;
  simpleExplanation: string;
  application: string;
}

export interface QuizOption {
  text: string;
  explanation: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface CourseBlock {
  id: string;
  title: string;
  subtitle: string;
  theory: string;
  analogy?: string;
  lifeApplication?: string;
  commonErrors?: string[];
  glossary: GlossaryTerm[];
  questions: QuizQuestion[];
}

export interface CourseData {
  blocks: CourseBlock[];
  finalQuiz: QuizQuestion[];
}
