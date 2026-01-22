// Генератор задач для практики
export class ExerciseGenerator {
  // Случайные переменные (P, Q, R, S)
  static variables = ['P', 'Q', 'R', 'S'];
  
  // Операторы
  static operators = {
    AND: { symbol: '∧', name: 'Շարակցություն' },
    OR: { symbol: '∨', name: 'Ցրում' },
    NOT: { symbol: '¬', name: 'Ժխտում' },
    IMPLIES: { symbol: '→', name: 'Հետևում' },
    IFF: { symbol: '↔', name: 'Երկկողմանի' }
  };

  // 1. Генерирование таблицы истинности
  static generateTruthTable(numVars = 2) {
    const vars = this.variables.slice(0, numVars);
    const rows = Math.pow(2, numVars);
    const table = [];

    for (let i = 0; i < rows; i++) {
      const row = {};
      for (let j = 0; j < numVars; j++) {
        row[vars[j]] = (i >> (numVars - 1 - j)) & 1;
      }
      table.push(row);
    }
    return table;
  }

  // 2. Генерирование простой формулы (P ∧ Q, P ∨ Q, etc.)
  static generateSimpleFormula() {
    // Выбираем 2 или 3 переменные для формулы
    const vars = this.variables.slice(0, Math.random() > 0.5 ? 2 : 3);
    const opKeys = Object.keys(this.operators);
    const randomOps = [];

    // Для каждой пары переменных выбираем случайный оператор
    for (let i = 0; i < vars.length - 1; i++) {
      randomOps.push(opKeys[Math.floor(Math.random() * opKeys.length)]);
    }

    // Собираем строку формулы, например: P ∧ Q ∨ R
    let formula = vars[0];
    for (let i = 0; i < randomOps.length; i++) {
      const op = this.operators[randomOps[i]];
      formula += ` ${op.symbol} ${vars[i + 1]}`;
    }

    return formula;
  }

  // 3. Генерирование задачи на эквивалентность
  static generateEquivalenceTask() {
    const numVars = Math.random() > 0.5 ? 2 : 3;
    const vars = this.variables.slice(0, numVars);
    const formula1 = this.generateSimpleFormula();
    const formula2 = this.generateSimpleFormula();

    return {
      type: 'equivalence',
      question: `Արդյո՞ք այս բանաձևերը համարժեք են: ${formula1} և ${formula2}`,
      formula1,
      formula2,
      table: this.generateTruthTable(numVars)
    };
  }

  // 4. Генерирование задачи на CNF/DNF
  static generateNormalFormTask() {
    const formula = this.generateSimpleFormula();
    const type = Math.random() > 0.5 ? 'CNF' : 'DNF';

    return {
      type: 'normalForm',
      question: `Փոխակերպեք այս բանաձևը ${type} ձևի: ${formula}`,
      formula,
      targetForm: type
    };
  }

  // 5. Генерирование задачи "Текст -> Формула"
  static generateTextToFormulaTask() {
    const tasks = [
      {
        text: 'Եթե ուսում ես, ապա հաջողական կլինես',
        formula: 'P → Q',
        vars: { P: 'ուսում ես', Q: 'հաջողական կլինես' }
      },
      {
        text: 'Կամ դուք սովորել եք, կամ չունեք բավարար իմացություն',
        formula: 'P ∨ Q',
        vars: { P: 'սովորել եք', Q: 'չունեք բավարար իմացություն' }
      },
      {
        text: 'Լույսը վառված է և դուք տանում եք',
        formula: 'P ∧ Q',
        vars: { P: 'Լույսը վառված է', Q: 'դուք տանում եք' }
      },
      {
        text: 'Դա ճշմարիտ չէ, որ 2+2=5',
        formula: '¬P',
        vars: { P: '2+2=5' }
      },
    ];

    return tasks[Math.floor(Math.random() * tasks.length)];
  }

  // 6. Генерирование задачи на тавтологию
  static generateTautologyTask() {
    const formulas = [
      { formula: 'P ∨ ¬P', isTautology: true, name: 'Բացառված Միջինի Օրենք' },
      { formula: '(P → Q) ∨ (Q → P)', isTautology: false, name: 'Պայմանական Հերթ' },
      { formula: '¬(P ∧ ¬P)', isTautology: true, name: 'Հակասության Օրենք' },
      { formula: 'P ∧ (P ∨ Q)', isTautology: false, name: 'Բներգում' },
    ];

    const task = formulas[Math.floor(Math.random() * formulas.length)];
    return {
      type: 'tautology',
      question: `Արդյո՞ք այս բանաձևը տավտոլոգիա է: ${task.formula}`,
      formula: task.formula,
      isTautology: task.isTautology,
      name: task.name
    };
  }
}

// Режимы практики
export const PRACTICE_MODES = {
  QUICK: {
    id: 'quick',
    name: 'Արագ Տրենինգ',
    count: 5,
    timeLimit: null,
    description: '5 առաջադրանք - որտեղ որ ցանկանում եք'
  },
  EXAM: {
    id: 'exam',
    name: 'Քննություն',
    count: 20,
    timeLimit: 60, // minutes
    description: '20 առաջադրանք 60 րոպե միջազգային'
  },
  ERRORS: {
    id: 'errors',
    name: 'Վերանայել Սխալները',
    count: null,
    timeLimit: null,
    description: 'Միայն առաջադրանքներ, որտեղ սխալ եք թողել'
  }
};
