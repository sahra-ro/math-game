import React, { useEffect, useMemo, useState } from "react";

const LEVELS = [
  { id: "easy", title: "آسان", description: "جمع، تفریق و ضرب ساده", time: 45, points: 10 },
  { id: "medium", title: "متوسط", description: "تقسیم، پرانتز و اعداد بزرگ‌تر", time: 40, points: 15 },
  { id: "hard", title: "چالشی", description: "کسر، توان و معادله ساده", time: 35, points: 25 },
];

const TOPICS = {
  arithmetic: "محاسبات",
  fractions: "کسرها",
  equations: "معادله",
  powers: "توان و جذر",
  geometry: "سطح و حجم",
  statistics: "آمار و احتمال",
  integers: "اعداد صحیح",
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplifyFraction(n, d) {
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function createOptions(answer) {
  const options = new Set([answer]);
  while (options.size < 4) {
    const wrong = answer + randomInt(-10, 10);
    if (wrong !== answer && Number.isFinite(wrong)) options.add(wrong);
  }
  return shuffle([...options]);
}

function generateQuestion(levelId) {
  const typePool =
    levelId === "easy"
      ? ["add", "subtract", "multiply", "integers"]
      : levelId === "medium"
      ? ["divide", "parentheses", "equation", "geometry", "integers"]
      : ["fraction", "equation", "power", "sqrt", "geometry", "statistics"];

  const type = typePool[randomInt(0, typePool.length - 1)];

  if (type === "add") {
    const a = randomInt(10, levelId === "easy" ? 60 : 150);
    const b = randomInt(10, levelId === "easy" ? 60 : 150);
    const answer = a + b;
    return { topic: "arithmetic", question: `${a} + ${b} = ؟`, answer, options: createOptions(answer), explanation: `جواب برابر با ${answer} است.` };
  }

  if (type === "subtract") {
    const a = randomInt(30, 120);
    const b = randomInt(5, a - 1);
    const answer = a - b;
    return { topic: "arithmetic", question: `${a} - ${b} = ؟`, answer, options: createOptions(answer), explanation: `${a} منهای ${b} برابر با ${answer} است.` };
  }

  if (type === "multiply") {
    const a = randomInt(2, levelId === "easy" ? 12 : 20);
    const b = randomInt(2, levelId === "easy" ? 12 : 20);
    const answer = a * b;
    return { topic: "arithmetic", question: `${a} × ${b} = ؟`, answer, options: createOptions(answer), explanation: `${a} ضربدر ${b} برابر با ${answer} است.` };
  }

  if (type === "divide") {
    const b = randomInt(2, 12);
    const answer = randomInt(2, 18);
    const a = b * answer;
    return { topic: "arithmetic", question: `${a} ÷ ${b} = ؟`, answer, options: createOptions(answer), explanation: `چون ${b} × ${answer} = ${a}، پس جواب ${answer} است.` };
  }

  if (type === "parentheses") {
    const a = randomInt(2, 12);
    const b = randomInt(2, 15);
    const c = randomInt(2, 9);
    const answer = (a + b) * c;
    return { topic: "arithmetic", question: `(${a} + ${b}) × ${c} = ؟`, answer, options: createOptions(answer), explanation: `اول پرانتز: ${a + b}. بعد ضرب در ${c}. جواب ${answer} است.` };
  }

  if (type === "fraction") {
    const d = randomInt(2, 9);
    const n1 = randomInt(1, d - 1);
    const n2 = randomInt(1, d - 1);
    const simplified = simplifyFraction(n1 + n2, d);
    const answer = simplified.d === 1 ? `${simplified.n}` : `${simplified.n}/${simplified.d}`;
    return {
      topic: "fractions",
      question: `${n1}/${d} + ${n2}/${d} = ؟`,
      answer,
      options: shuffle([answer, `${n1 + n2}/${d + 1}`, `${Math.max(1, n1 + n2 - 1)}/${d}`, `${n1 + n2 + 1}/${d}`]),
      explanation: `وقتی مخرج‌ها برابرند، صورت‌ها را جمع می‌کنیم. جواب ساده‌شده: ${answer}.`,
    };
  }

  if (type === "equation") {
    const x = randomInt(2, 15);
    const a = randomInt(2, 8);
    const b = randomInt(1, 20);
    const result = a * x + b;
    return {
      topic: "equations",
      question: `اگر ${a}x + ${b} = ${result} باشد، x چند است؟`,
      answer: x,
      options: createOptions(x),
      explanation: `اول ${b} را کم می‌کنیم، بعد تقسیم بر ${a}. جواب ${x} است.`
    };
  }

  if (type === "integers") {
    const a = randomInt(-20, 20);
    const b = randomInt(-20, 20);
    const answer = a + b;
    return {
      topic: "integers",
      question: `${a} + (${b}) = ؟`,
      answer,
      options: createOptions(answer),
      explanation: `اعداد صحیح را با توجه به علامت جمع می‌کنیم. جواب ${answer} است.`
    };
  }

  if (type === "geometry") {
    const length = randomInt(2, 12);
    const width = randomInt(2, 10);
    const answer = length * width;
    return {
      topic: "geometry",
      question: `مساحت مستطیلی با طول ${length} و عرض ${width} چند است؟`,
      answer,
      options: createOptions(answer),
      explanation: `مساحت مستطیل برابر طول × عرض است. جواب ${answer} است.`
    };
  }

  if (type === "statistics") {
    const data = [randomInt(1, 10), randomInt(1, 10), randomInt(1, 10), randomInt(1, 10)];
    const answer = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
    return {
      topic: "statistics",
      question: `میانگین اعداد ${data.join(" ، ")} چند است؟`,
      answer,
      options: createOptions(answer),
      explanation: `جمع اعداد را بر تعداد آن‌ها تقسیم می‌کنیم. جواب ${answer} است.`
    };
  }

  if (type === "sqrt") {
    const roots = [4, 9, 16, 25, 36, 49, 64, 81];
    const value = roots[randomInt(0, roots.length - 1)];
    const answer = Math.sqrt(value);
    return {
      topic: "powers",
      question: `√${value} = ؟`,
      answer,
      options: createOptions(answer),
      explanation: `جذر عدد ${value} برابر ${answer} است.`
    };
  }

  const base = randomInt(2, 7);
  const power = randomInt(2, 3);
  const answer = Math.pow(base, power);
  return { topic: "powers", question: `${base}${power === 2 ? "²" : "³"} = ؟`, answer, options: createOptions(answer), explanation: `یعنی ${base} را ${power} بار در خودش ضرب کنیم. جواب ${answer} است.` };
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [levelId, setLevelId] = useState("easy");
  const [question, setQuestion] = useState(() => generateQuestion("easy"));
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [history, setHistory] = useState([]);

  const level = useMemo(() => LEVELS.find((item) => item.id === levelId) || LEVELS[0], [levelId]);
  const progress = Math.min((questionCount / 10) * 100, 100);
  const accuracy = questionCount > 1 ? Math.round((correctCount / (questionCount - 1)) * 100) : 0;

  useEffect(() => {
    if (screen !== "game" || feedback) return;

    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [screen, timeLeft, feedback]);

  const isNumbersOnly = (text) => {
    return !/[آ-یa-zA-Z]/.test(text);
  };

  function startGame(nextLevelId = levelId) {
    const selectedLevel = LEVELS.find((item) => item.id === nextLevelId) || LEVELS[0];
    setLevelId(nextLevelId);
    setQuestion(generateQuestion(nextLevelId));
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setStreak(0);
    setQuestionCount(1);
    setCorrectCount(0);
    setTimeLeft(selectedLevel.time);
    setHistory([]);
    setScreen("game");
  }

  function handleAnswer(option) {
    if (feedback) return;
    setSelected(option);
    const isCorrect = option === question.answer;
    const gainedPoints = isCorrect ? level.points + streak * 2 : 0;
    setFeedback({ isCorrect, gainedPoints });
    setHistory((prev) => [...prev, { question: question.question, answer: question.answer, selected: option ?? "بدون پاسخ", isCorrect }]);
    if (isCorrect) {
      setScore((prev) => prev + gainedPoints);
      setStreak((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  }

  function nextQuestion() {
    if (questionCount >= 10) {
      setScreen("result");
      return;
    }
    setQuestion(generateQuestion(levelId));
    setSelected(null);
    setFeedback(null);
    setQuestionCount((prev) => prev + 1);
    setTimeLeft(level.time);
  }

  return (
    <main dir="rtl" className="app">
      <style>{css}</style>

      <header className="header">
        <div>
          <h1>بازی ریاضی نابغه‌ها</h1>
          <p>تمرین ریاضی برای دانش‌آموزان راهنمایی</p>
        </div>

        <div className="headerActions">
          

          {screen === "game" && (
            <button
              className="headerExitBtn"
              onClick={() => setScreen("home")}
            >
              خروج از بازی
            </button>
          )}
        </div>
      </header>

      {screen === "home" && (
        <section className="grid two">
          <div className="hero card">
            <h2>ریاضی را مثل بازی تمرین کن!</h2>
            <p>جواب بده، امتیاز بگیر، رکورد بساز و با هر مرحله سریع‌تر و دقیق‌تر شو.</p>
            <div className="features">
              <div>⏱ تایمر</div>
              <div>⭐ امتیاز</div>
              <div>🏆 نتیجه</div>
            </div>
          </div>

          <div className="card">
            <h3>سطح بازی را انتخاب کن</h3>
            {LEVELS.map((item) => (
              <button key={item.id} onClick={() => setLevelId(item.id)} className={levelId === item.id ? "level active" : "level"}>
                <b>{item.title}</b>
                <span>{item.description}</span>
                <small>{item.points} امتیاز</small>
              </button>
            ))}
            <button className="primary" onClick={() => startGame(levelId)}>شروع بازی</button>
          </div>
        </section>
      )}

      {screen === "game" && (
        <section>
          <div className="stats">
            <div className="stat"><span>امتیاز</span><b>{score}</b></div>
            <div className="stat"><span>سؤال</span><b>{questionCount}/10</b></div>
            <div className="stat"><span>رکورد</span><b>{streak}</b></div>
            <div className={timeLeft <= 10 ? "stat danger" : "stat"}><span>زمان</span><b>{timeLeft}s</b></div>
          </div>

          <div className="card questionCard">
            <div className="topRow">
              <span className="pill light">{TOPICS[question.topic]}</span>
              <span className="pill light">{level.title}</span>
            </div>
            <h2 className={isNumbersOnly(question.question) ? "mathQuestion numbersOnly" : "mathQuestion"}>{question.question}</h2>
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>

            <div className="answers">
              {question.options.map((option) => {
                const isSelected = selected === option;
                const isAnswer = question.answer === option;
                const cls = feedback && isAnswer ? "answer correct" : feedback && isSelected && !isAnswer ? "answer wrong" : "answer";
                return <button key={String(option)} disabled={Boolean(feedback)} onClick={() => handleAnswer(option)} className={cls}>{option}</button>;
              })}
            </div>

            {feedback && (
              <div className={feedback.isCorrect ? "feedback ok" : "feedback bad"}>
                <b>{feedback.isCorrect ? `آفرین! +${feedback.gainedPoints} امتیاز گرفتی.` : "اشکالی نداره، یاد می‌گیری."}</b>
                <p>{question.explanation}</p>
                <button className="primary small" onClick={nextQuestion}>{questionCount >= 10 ? "دیدن نتیجه" : "سؤال بعدی"}</button>
              </div>
            )}
          </div>
        </section>
      )}

      {screen === "result" && (
        <section className="grid two">
          <div className="card result">
            <h2>🏆 نتیجه بازی</h2>
            <p>سطح: {level.title}</p>
            <div className="resultGrid">
              <div><span>امتیاز</span><b>{score}</b></div>
              <div><span>درست</span><b>{correctCount}/10</b></div>
              <div><span>دقت</span><b>{accuracy}%</b></div>
              <div><span>تعداد سؤال</span><b>10</b></div>
            </div>
            <button className="primary" onClick={() => startGame(levelId)}>بازی دوباره</button>
            <button className="secondary" onClick={() => setScreen("home")}>تغییر سطح</button>
          </div>

          <div className="card">
            <h3>مرور پاسخ‌ها</h3>
            <div className="history">
              {history.map((item, index) => (
                <div className="historyItem" key={index}>
                  <b>سؤال {index + 1}: {item.isCorrect ? "درست" : "اشتباه"}</b>
                  <p>{item.question}</p>
                  <small>پاسخ تو: {String(item.selected)} | جواب درست: {String(item.answer)}</small>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

const css = `
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #E8D8C4; color: #561C24; }
button { font-family: inherit; }
.app { max-width: 1100px; margin: 0 auto; padding: 24px; }
.header { background: #F5EBDD; border-radius: 28px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; box-shadow: 0 8px 30px rgba(15, 23, 42, .06); }
.header h1 { margin: 0; font-size: 28px; }
.header p { margin: 6px 0 0; color: #64748b; }
.grid { display: grid; gap: 20px; }
.two { grid-template-columns: 1.1fr .9fr; }
.card { background: #F5EBDD; border-radius: 28px; padding: 24px; box-shadow: 0 8px 30px rgba(15, 23, 42, .06); }
.hero { background: linear-gradient(135deg, #561C24, #6D2932); color: #F5EBDD; min-height: 420px; display: flex; flex-direction: column; justify-content: center; }
.hero h2 { font-size: 48px; line-height: 1.25; margin: 0 0 16px; color: #ffffff; }
.hero p { color: #E8D8C4; line-height: 2; font-size: 17px; }
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 24px; }
.features div { background: rgba(255,255,255,.12); padding: 18px; border-radius: 20px; text-align: center; }
.pill { background: #6D2932; color: #F5EBDD; padding: 9px 14px; border-radius: 999px; font-weight: 700; }
.pill.light { background: #C7B7A3; color: #561C24; }
.level { width: 100%; text-align: right; border: 1px solid #C7B7A3; background: #F5EBDD; border-radius: 22px; padding: 16px; margin: 8px 0; cursor: pointer; display: grid; gap: 6px; }
.level:hover { border-color: #6D2932; background: #E8D8C4; }
.level.active { background: #6D2932; color: #F5EBDD; border-color: #6D2932; }
.level span { color: #7A5C52; }
.level.active span { color: #F5EBDD; }
.level small { font-weight: 700; color: #561C24; }
.primary, .secondary { width: 100%; border: 0; border-radius: 18px; padding: 15px 18px; font-size: 16px; font-weight: 800; cursor: pointer; margin-top: 12px; }
.primary { background: #561C24; color: #F5EBDD; }
.primary:hover { background: #6D2932; }
.secondary { background: #C7B7A3; color: #561C24; }
.small { width: auto; padding: 12px 24px; }
.headerActions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.headerExitBtn {
  border: 1px solid #C7B7A3;
  background: transparent;
  color: #7A5C52;
  border-radius: 14px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.headerExitBtn:hover {
  background: #E8D8C4;
  color: #561C24;
}

.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }
.stat { background: #F5EBDD; border-radius: 22px; padding: 18px; box-shadow: 0 8px 30px rgba(15, 23, 42, .06); }
.stat span { display: block; color: #7A5C52; margin-bottom: 6px; }
.stat b { font-size: 26px; }
.danger { background: #6D2932; color: #F5EBDD; }
.mathQuestion {
  font-size: 44px;
  text-align: right;
  direction: rtl;
  margin: 28px 0;
  color: #561C24;
  line-height: 1.7;
}

.mathQuestion.numbersOnly {
  text-align: center;
  direction: ltr;
  unicode-bidi: bidi-override;
  letter-spacing: 1px;
}

.mathQuestion.numbersOnly {
  direction: ltr;
  unicode-bidi: bidi-override;
  letter-spacing: 1px;
}
.topRow { display: flex; justify-content: space-between; }
.progress { height: 12px; background: #C7B7A3; border-radius: 999px; overflow: hidden; margin-bottom: 24px; }
.progress div { height: 100%; background: #561C24; border-radius: 999px; }
.answers { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.answer { min-height: 78px; border: 1px solid #C7B7A3; background: #F5EBDD; color: #561C24; border-radius: 24px; font-size: 28px; font-weight: 900; cursor: pointer; }
.answer:hover { border-color: #6D2932; background: #E8D8C4; transform: translateY(-2px); }
.answer.correct { background: #C7B7A3; color: #561C24; border-color: #6D2932; }
.answer.wrong { background: #6D2932; color: #F5EBDD; border-color: #561C24; }
.feedback { margin-top: 22px; padding: 18px; border-radius: 24px; line-height: 1.9; }
.feedback.ok { background: #ecfdf5; border: 1px solid #86efac; color: #166534; }
.feedback.bad { background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c; }
.result { text-align: center; }
.resultGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 20px 0; }
.resultGrid div { background: #E8D8C4; border-radius: 20px; padding: 18px; }
.resultGrid span { display: block; color: #7A5C52; }
.resultGrid b { font-size: 28px; }
.history { max-height: 520px; overflow: auto; display: grid; gap: 10px; }
.historyItem { background: #E8D8C4; border: 1px solid #C7B7A3; border-radius: 18px; padding: 14px; }
.historyItem p { margin: 8px 0; }
.historyItem small { color: #7A5C52; }
@media (max-width: 800px) {
  .two, .stats, .answers, .features { grid-template-columns: 1fr; }
  .header { flex-direction: column; align-items: flex-start; }
  .hero h2 { font-size: 34px; }
  .questionCard h2 { font-size: 32px; }
}
`;
