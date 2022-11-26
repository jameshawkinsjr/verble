import classnames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { State } from "../src/enums/state";

const { IDLE, LISTENING, ERROR } = State;

const Home = () => {
  const [guess, setGuess] = useState("-----");
  const [state, setState] = useState<State>(IDLE);
  const [dailyWord, setDailyWord] = useState("itchy");
  const [wordState, setWordState] = useState([
    "white",
    "white",
    "white",
    "white",
    "white",
  ]);

  const [numGuesses, setNumGuesses] = useState(0);

  const onClick = () => {
    setState(LISTENING);
    console.log("clicked microphone");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    let recognition = new SpeechRecognition();

    recognition.onstart = () => {
      console.log("starting listening, speak in microphone");
    };
    recognition.onspeechend = () => {
      console.log("stopped listening");
      recognition.stop();
    };
    recognition.onresult = (result) => {
      let voiceGuess = result.results[0][0].transcript;

      if (voiceGuess.length !== 5 || guess === voiceGuess) {
        setState(ERROR);
      } else {
        setGuess(voiceGuess.toUpperCase());
        setNumGuesses(numGuesses + 1);
        console.log(voiceGuess);
      }
    };

    recognition.start();
  };

  useEffect(() => {
    if (guess === "-----") {
      return;
    }
    const msg = new SpeechSynthesisUtterance();
    const synth = window.speechSynthesis;

    const determineColor = (i: number) => {
      const guessLetter = guess[i].toLowerCase();
      const dailyWordLetter = dailyWord[i].toLowerCase();

      const isInDailyWord = dailyWord.indexOf(guessLetter) >= 0;
      const isExact = dailyWordLetter === guessLetter;

      if (isExact) {
        return "green";
      } else if (isInDailyWord) {
        return "yellow";
      } else {
        return "white";
      }
    };

    let responses = [];
    let wordStateUpdate = [];
    for (let i = 0; i < guess.length; i++) {
      let color = determineColor(i);

      wordStateUpdate[i] = color;

      responses.push(`Letter ${guess[i]} is ${color}`);
    }

    setWordState(wordStateUpdate);
    msg.text = responses.join(" ");
    synth.speak(msg);
    setState(IDLE);
  }, [guess, dailyWord]);

  const LoadingBar = () => {
    const isListening = state === LISTENING;
    return (
      <>
        <div className={styles.boxContainer}>
          <div
            className={classnames(styles.box, {
              [styles.quiet]: isListening,
              [styles.boxError]: state === ERROR,
            })}
          />
          <div
            className={classnames(styles.box, {
              [styles.normal]: isListening,
              [styles.boxError]: state === ERROR,
            })}
          />
          <div
            className={classnames(styles.box, {
              [styles.loud]: isListening,
              [styles.boxError]: state === ERROR,
            })}
          />
          <div
            className={classnames(styles.box, {
              [styles.quiet]: isListening,
              [styles.boxError]: state === ERROR,
            })}
          />
          <div
            className={classnames(styles.box, {
              [styles.normal]: isListening,
              [styles.boxError]: state === ERROR,
            })}
          />
          <div
            className={classnames(styles.box, {
              [styles.quiet]: isListening,
              [styles.boxError]: state === ERROR,
            })}
          />
          <div
            className={classnames(styles.box, {
              [styles.loud]: isListening,
              [styles.boxError]: state === ERROR,
            })}
          />
          <div
            className={classnames(styles.box, {
              [styles.quiet]: isListening,
              [styles.boxError]: state === ERROR,
            })}
          />
        </div>
      </>
    );
  };

  const Guess = () => {
    return (
      <div className={styles.guessContainer}>
        <h2
          className={classnames({
            [styles.white]: wordState[0] === "white",
            [styles.yellow]: wordState[0] === "yellow",
            [styles.green]: wordState[0] === "green",
          })}
        >
          {guess[0]}
        </h2>
        <h2
          className={classnames({
            [styles.white]: wordState[1] === "white",
            [styles.yellow]: wordState[1] === "yellow",
            [styles.green]: wordState[1] === "green",
          })}
        >
          {guess[1]}
        </h2>
        <h2
          className={classnames({
            [styles.white]: wordState[2] === "white",
            [styles.yellow]: wordState[2] === "yellow",
            [styles.green]: wordState[2] === "green",
          })}
        >
          {guess[2]}
        </h2>
        <h2
          className={classnames({
            [styles.white]: wordState[3] === "white",
            [styles.yellow]: wordState[3] === "yellow",
            [styles.green]: wordState[3] === "green",
          })}
        >
          {guess[3]}
        </h2>
        <h2
          className={classnames({
            [styles.white]: wordState[4] === "white",
            [styles.yellow]: wordState[4] === "yellow",
            [styles.green]: wordState[4] === "green",
          })}
        >
          {guess[4]}
        </h2>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Verble - The listening game</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Verble</h1>
        <h2>Number of Guesses:</h2>
        {numGuesses}
        {state === ERROR ? (
          <h2 className={styles.error}>Invalid Word. Try again.</h2>
        ) : (
          <>
            <h2>Your Guess:</h2>
            <Guess />
          </>
        )}

        <p className={styles.description}>
          {state === LISTENING ? (
            <button>Listening</button>
          ) : (
            <button onClick={onClick}>Click here and say your guess</button>
          )}
        </p>

        <LoadingBar />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/jameshawkinsjr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by James Hawkins
        </a>
      </footer>
    </div>
  );
};

export default Home;
