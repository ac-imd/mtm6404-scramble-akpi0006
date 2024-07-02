const { useState, useEffect } = React;

function shuffle(src) {
    const copy = [...src];
    const length = copy.length;
    for (let i = 0; i < length; i++) {
        const x = copy[i];
        const y = Math.floor(Math.random() * length);
        const z = copy[y];
        copy[i] = z;
        copy[y] = x;
    }
    if (typeof src === 'string') {
        return copy.join('');
    }
    return copy;
}

const initialWords = [
    'react', 'javascript', 'programming', 'design', 'html', 'css', 
    'shuffle', 'scramble', 'game', 'developer'
];

function App() {
    const [words, setWords] = useState(initialWords);
    const [currentWord, setCurrentWord] = useState('');
    const [guess, setGuess] = useState('');
    const [points, setPoints] = useState(0);
    const [strikes, setStrikes] = useState(0);
    const [passes, setPasses] = useState(3);

    useEffect(() => {
        const savedGame = JSON.parse(localStorage.getItem('scrambleGame'));
        if (savedGame) {
            setWords(savedGame.words);
            setCurrentWord(savedGame.currentWord);
            setPoints(savedGame.points);
            setStrikes(savedGame.strikes);
            setPasses(savedGame.passes);
        } else {
            startNewGame();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('scrambleGame', JSON.stringify({
            words, currentWord, points, strikes, passes
        }));
    }, [words, currentWord, points, strikes, passes]);

    function startNewGame() {
        const shuffledWords = shuffle([...initialWords]);
        setWords(shuffledWords);
        setCurrentWord(shuffle(shuffledWords[0]));
        setPoints(0);
        setStrikes(0);
        setPasses(3);
        localStorage.removeItem('scrambleGame');
    }

    function handleGuessChange(e) {
        setGuess(e.target.value);
    }

    function handleGuessSubmit(e) {
        e.preventDefault();
        if (guess === words[0]) {
            setPoints(points + 1);
            const remainingWords = words.slice(1);
            setWords(remainingWords);
            setCurrentWord(shuffle(remainingWords[0] || ''));
        } else {
            setStrikes(strikes + 1);
        }
        setGuess('');
    }

    function handlePass() {
        if (passes > 0) {
            const remainingWords = words.slice(1);
            setWords(remainingWords);
            setCurrentWord(shuffle(remainingWords[0] || ''));
            setPasses(passes - 1);
        }
    }

    if (words.length === 0 || strikes >= 3) {
        return (
            <div>
                <h1>Game Over</h1>
                <p>Your Score: {points}</p>
                <button onClick={startNewGame}>Play Again</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Scramble Game</h1>
            <p>Points: {points}</p>
            <p>Strikes: {strikes}</p>
            <p>Passes: {passes}</p>
            <p>Scrambled Word: {currentWord}</p>
            <form onSubmit={handleGuessSubmit}>
                <input type="text" value={guess} onChange={handleGuessChange} />
                <button type="submit">Guess</button>
            </form>
            <button onClick={handlePass} disabled={passes <= 0}>Pass</button>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
