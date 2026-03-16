import { useState, useEffect } from "react";

const API = "http://localhost:8080/api/cards";

export default function App() {
    const [cards, setCards] = useState([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [category, setCategory] = useState("");
    const [currentCard, setCurrentCard] = useState(null);
    const [flipped, setFlipped] = useState(false);
    const [quizMode, setQuizMode] = useState(false);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [remaining, setRemaining] = useState(0);

    // Fetch all cards on load
    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        const res = await fetch(API);
        const data = await res.json();
        setCards(data);
    };

    const addCard = async () => {
        if (!question || !answer) return;
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, answer, category }),
        });
        setQuestion("");
        setAnswer("");
        setCategory("");
        fetchCards();
    };

    const deleteCard = async (id) => {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        fetchCards();
    };

    const startQuiz = async () => {
        setQuizMode(true);
        setScore({ correct: 0, incorrect: 0 });
        setFlipped(false);
        await getNextCard();
    };

    const getNextCard = async () => {
        const res = await fetch(`${API}/next`);
        const data = await res.json();
        setCurrentCard(data);
        setFlipped(false);
        const remRes = await fetch(`${API}/remaining`);
        const remData = await remRes.json();
        setRemaining(remData);
    };

    const handleAnswer = async (correct) => {
        setScore((prev) => ({
            ...prev,
            correct: correct ? prev.correct + 1 : prev.correct,
            incorrect: correct ? prev.incorrect : prev.incorrect + 1,
        }));
        if (remaining === 0) {
            setQuizMode(false);
            setCurrentCard(null);
        } else {
            await getNextCard();
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans">

            {/* NAV */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-50/90 bacdrop-blur-md border-b border-stone-200 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🧠</span>
                    <h1 className="text-2xl font-bold text-navy-800 tracking-tight">
                        FlashMind
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {quizMode && (
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                            {score.correct + score.incorrect} answered · {score.correct} correct
                        </span>
                    )}
                    <button
                        onClick={quizMode ? () => setQuizMode(false) : startQuiz}
                        disabled={cards.length === 0}
                        className="px-5 py-2 bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-800 transition disabled:opacity-40"
                    >
                        {quizMode ? "Exit Quiz" : "Start Quiz"}
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-8 pt-28 pb-16">
                {/* QUIZ MODE */}
                {quizMode && currentCard ? (
                    <div>
                        {/*progress bar*/}
                        <div className="w-full bg-stone-200 rounded-full h-1 mb-8">
                            <div className="bg-blue-600 h-1 rounded-full transition-all duration-500" style={{
                                width: `${((score.correct + score.incorrect) / cards.length) * 100}`
                            }}>

                            </div>

                        </div>
                    {/*card*/}
                        <div
                            onClick={() => setFlipped(!flipped)}
                            className="cursor-pointer bg-white border border-stone-200 rounded-lg p-12 mb-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 min-h-64 flex items-center justify-center"
                        >
                            <div className="text-center">
                                {currentCard.category && (
                                    <span className="text-xs font-medium uppercase tracking-widest text-blue-500 mb-4 block">
                                        {currentCard.category}
                                    </span>
                                )}
                                <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                                    {flipped ? "Answer" : "Question"}
                                </p>
                                <p className="text-xl text-gray-800 leading-relaxed">
                                    {flipped ? currentCard.answer : currentCard.question}
                                </p>
                                {!flipped && (
                                    <p className="text-xs text-gray-400 mt-8">Click to reveal answer</p>
                                )}
                            </div>
                        </div>
                        {/*answer buttons*/}
                        {flipped ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAnswer(false)}
                                    className="flex-1 py-3 bg-red-50 text-red-600 font-medium rounded-sm hover:bg-red-100 transition border border-red-100"
                                >
                                    ✗ Incorrect
                                </button>
                                <button
                                    onClick={() => handleAnswer(true)}
                                    className="flex-1 py-3 bg-green-50 text-green-600 font-medium rounded-sm hover:bg-green-100 transition border border-green-100"
                                >
                                    ✓ Correct
                                </button>
                            </div>
                        ) : (
                            <p className="text-center text-xs text-gray-300 uppercase tracking-widest">
                                {remaining} cards remaining
                            </p>
                        )}
                    </div>
                ) : quizMode && !currentCard ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-6">🎉</p>
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Quiz Complete!</h2>
                        <p className="text-gray-400 mb-2">
                            {score.correct} correct · {score.incorrect} incorrect
                        </p>
                        <p className="text-3xl font-bold text-blue-700 mb-8">
                            {Math.round((score.correct / cards.length) * 100)}%
                        </p>
                        <button
                            onClick={startQuiz}
                            className="px-6 py-2.5 bg-blue-700 text-white rounded-sm hover:bg-blue-800 transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* ADD CARD FORM */}
                        <div className="bg-white border border-stone-200 rounded-lg p-6 mb-8">
                            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
                                Add a Flashcard
                            </h2>
                            <div className="flex flex-col gap-3">
                                <input
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Question"
                                    className="border border-stone-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition"
                                />
                                <input
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Answer"
                                    className="border border-stone-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                                />
                                <input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Category (optional)"
                                    className="border border-stone-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                                />
                                <button
                                    onClick={addCard}
                                    className="px-4 py-2.5 bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-800 transition disabled:opacity-40"
                                >
                                    Add Card
                                </button>
                            </div>
                        </div>

                        {/* CARD LIST */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
                                Your Cards
                            </h2>
                            <span className="text-xs text-gray-400">{cards.length}</span>
                        </div>
                        {cards.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-stone-200 rounded-lg">
                                <p className="text-3xl mb-3">📚</p>
                                <p className="text-gray-400 text-sm">No cards yet — add one above!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="bg-white border border-stone-200 rounded-lg p-5 flex justify-between items-start hover:border-blue-300 transition group"
                                    >
                                        <div className="flex-1">
                                            {card.category && (
                                                <span className="text-xs font-medium uppercase tracking-widest text-blue-500 mb-2 block">{card.category}</span>
                                            )}
                                            <p className="text-sm font-medium text-gray-800 mb-1">{card.question}</p>
                                            <p className="text-sm text-gray-400">{card.answer}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteCard(card.id)}
                                            className="text-stone-200 hover:text-red-400 transition ml-4 text-xl opacity-0 group-hover:opacity-100"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}