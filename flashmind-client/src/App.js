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
            <nav className="border-b border-stone-200 px-8 py-5 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-navy-800 tracking-tight">
                    🧠 FlashMind
                </h1>
                <button
                    onClick={quizMode ? () => setQuizMode(false) : startQuiz}
                    disabled={cards.length === 0}
                    className="px-5 py-2 bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-800 transition disabled:opacity-40"
                >
                    {quizMode ? "Exit Quiz" : "Start Quiz"}
                </button>
            </nav>

            <div className="max-w-3xl mx-auto px-8 py-10">
                {/* QUIZ MODE */}
                {quizMode && currentCard ? (
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-6 uppercase tracking-widest">
                            {remaining} cards remaining · {score.correct} correct · {score.incorrect} incorrect
                        </p>
                        <div
                            onClick={() => setFlipped(!flipped)}
                            className="cursor-pointer bg-white border border-stone-200 rounded-lg p-12 mb-6 hover:shadow-md transition min-h-48 flex items-center justify-center"
                        >
                            <div className="text-center">
                                <p className="text-xs uppercase tracking-widest text-blue-600 mb-3">
                                    {flipped ? "Answer" : "Question"}
                                </p>
                                <p className="text-xl text-gray-800">
                                    {flipped ? currentCard.answer : currentCard.question}
                                </p>
                                {!flipped && (
                                    <p className="text-xs text-gray-400 mt-6">Click to reveal answer</p>
                                )}
                            </div>
                        </div>
                        {flipped && (
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => handleAnswer(false)}
                                    className="px-8 py-3 bg-red-100 text-red-700 font-medium rounded hover:bg-red-200 transition"
                                >
                                    ✗ Incorrect
                                </button>
                                <button
                                    onClick={() => handleAnswer(true)}
                                    className="px-8 py-3 bg-green-100 text-green-700 font-medium rounded hover:bg-green-200 transition"
                                >
                                    ✓ Correct
                                </button>
                            </div>
                        )}
                    </div>
                ) : quizMode && !currentCard ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-4">🎉</p>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
                        <p className="text-gray-500 mb-6">
                            {score.correct} correct · {score.incorrect} incorrect
                        </p>
                        <button
                            onClick={startQuiz}
                            className="px-6 py-2.5 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* ADD CARD FORM */}
                        <div className="bg-white border border-stone-200 rounded-lg p-6 mb-8">
                            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-400 mb-4">
                                Add a Flashcard
                            </h2>
                            <div className="flex flex-col gap-3">
                                <input
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Question"
                                    className="border border-stone-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
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
                                    className="px-4 py-2.5 bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-800 transition"
                                >
                                    Add Card
                                </button>
                            </div>
                        </div>

                        {/* CARD LIST */}
                        <h2 className="text-sm font-medium uppercase tracking-widest text-gray-400 mb-4">
                            Your Cards ({cards.length})
                        </h2>
                        {cards.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-12">
                                No cards yet — add one above!
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="bg-white border border-stone-200 rounded-lg p-5 flex justify-between items-start hover:border-blue-300 transition"
                                    >
                                        <div>
                                            {card.category && (
                                                <span className="text-xs font-medium uppercase tracking-widest text-blue-600 mb-1 block">
                          {card.category}
                        </span>
                                            )}
                                            <p className="text-sm font-medium text-gray-800 mb-1">{card.question}</p>
                                            <p className="text-sm text-gray-500">{card.answer}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteCard(card.id)}
                                            className="text-gray-300 hover:text-red-400 transition ml-4 text-lg"
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