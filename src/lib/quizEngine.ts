export interface Question {
  id: string;
  type: "single" | "multi" | "fill";
  correctAnswer?: string;
  correctAnswers?: string[];
}

export function checkAnswer(question: Question, answer: string | string[]): boolean {
  if (question.type === "single" || question.type === "fill") {
    return answer === question.correctAnswer;
  }

  if (question.type === "multi") {
    const answerArray = Array.isArray(answer) ? answer : [answer];
    const correctArray = question.correctAnswers || [];
    return (
      answerArray.length === correctArray.length &&
      answerArray.every((a) => correctArray.includes(a))
    );
  }

  return false;
}

export function calculateScore(questions: Question[], answers: Record<string, string | string[]>): number {
  let correct = 0;
  questions.forEach((q) => {
    if (checkAnswer(q, answers[q.id])) {
      correct++;
    }
  });
  return Math.round((correct / questions.length) * 100);
}
