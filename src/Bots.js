import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap

const Bots = () => {
  const [time, setTime] = useState(0);

  const [reset, setReset] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);
  const [getText, setGetText] = useState(false);
  const [showText, setShowText] = useState(false);

  const [toType, setToType] = useState('');
  const [splitToType, setSplitToType] = useState(null);

  const [typed, setTyped] = useState('');
  const [splitTyped, setSplitTyped] = useState(['']);

  const [displayText, setDisplayText] = useState(['']);

  const [wrongWords, setWrongWords] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isRunning, setIsRunning] = useState(0);

  const [colourList, setColourList] = useState([]);
  const [botColourList, setBotColourList] = useState([]);

  const [mount] = useState(false);

  const [showButtons, setShowButtons] = useState(true);
  const [mode, setMode] = useState(0);
  const [speed, setSpeed] = useState(0);

  const [win, setWin] = useState(false);


  const clickEasy = () => {
    setMode(1);
    setSpeed(220);
  };

  const clickMed = () => {
    setMode(2);
    setSpeed(120);
  };

  const clickHard = () => {
    setMode(3);
    setSpeed(80);
  };

  const clickBack = () => {
    setMode(0);
  };

  useEffect(() => {
    if (mode !== 0) {
      setShowButtons(false);
    } else {
      setShowButtons(true);
    }
  }, [mode]);


  useEffect(() => {
    setIsRunning(0);  // to refresh if person clicks 'back' button and clicks solo again
  }, [mount]);

  const close = () => {
    setReset(true);
  };

  useEffect(() => {
    if (reset) {
      setShowText(false);
      document.getElementById('texteh').value = '';
      setTime(0);
      setToType('');
      setTyped('');
      setSplitToType(['']);
      setColourList([]);
      setBotColourList([]);
      setIsRunning(0);
    }
  }, [reset]);


  const genText = () => {
    setGetText(true);
    setReset(false);
  }

  const fetchData = async () => {
    /*
    const response = await fetch('/path/to/db');
    const data = await response.json();
    let textUwU = data.toType;
    */
    setToType('good morning children owo');
  };

  useEffect(() => {
    if (getText) {
      fetchData();
    }
  }, [getText]);

  useEffect(() => {
    if (getText) {
      let splitted = toType.split(' ');
      setSplitToType(splitted);
      setDisplayText(splitted.slice());
    }
  }, [toType]);

  useEffect(() => {
    if (getText) {
      console.log('no', displayText);
      setGetText(false);
      setShowText(true);
    }
  }, [displayText]);


  const handleTextChange = (e) => {
    let value = e.target.value;
    let splitted = value.split(' ');
    let reset = false;
    for (let i = splitted.length - 2; i >= 0; i--) {
      if (splitted[i] === '') {
        splitted.splice(i, 1);
        reset = true;
      }
    }
    if (reset) {
      value = '';
      for (let i = 0, n = splitted.length; i < n; i++) {
        value += splitted[i];
        if (i !== n - 1) {
          value += ' ';
        }
      }
    }

    setTyped(value);
    setSplitTyped(splitted);
    checkWords();

    if (isRunning === 0) {
      resetTimer();
      startTimer();
    }
  };

  useEffect(() => {
    if (isRunning === 1 && splitToType !== null) {
      if (splitTyped.length > splitToType.length || splitToType[splitToType.length - 1] === splitTyped[splitTyped.length - 1]) {
        setWin(true);
        stopTimer();
      }
    }
  }, [splitTyped, splitToType]);

  useEffect(() => {
    if (hasMounted) {
      checkWords();
    } else {
      setHasMounted(true);
    }
  }, [splitTyped]);

  const checkWords = useCallback(() => {
    let colours = [];
    let wrongs = 0;
    let toDisplay = splitToType.slice();

    for (let i = 0, n = splitTyped.length; i < n; i++) {
      let colour = [];

      for (let j = 0, m = splitTyped[i].length; j < m; j++) {
        let c = '#9a322e';

        if (i < splitToType.length) {
          if (j < splitToType[i].length) {
            if (splitToType[i][j] === splitTyped[i][j]) {
              c = '#26734d';
            }
          } else {
            toDisplay[i] += splitTyped[i].substring(j);
            // for (let k = j, o = splitTyped.length - 1; k < o; k++) {
            //   colour.push('#ffffff');
            // }
            break;
          }
        }

        colour.push(c);
      }

      if (splitToType[i] !== splitTyped[i]) {
        if (i < splitToType.length) {
          wrongs++;
        }
      }
      colours.push(colour);
    }

    setColourList(colours);
    setWrongWords(wrongs);
    setDisplayText(toDisplay);
  }, [splitToType, splitTyped]);


  const matchColour = (i, j) => {
    if (i < colourList.length) {
      if (j < colourList[i].length) {
        return { color: colourList[i][j] };
      } else if (i !== colourList.length - 1 && splitToType[i][j] === null) {
        return { color: '#ffffff' };
      }
    }
    return { color: '#2c2c2c' };
  };


  useEffect(() => {
    let interval;
    if (isRunning === 1) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(1);
  };

  const stopTimer = () => {
    setIsRunning(2);
    document.getElementById('texteh').disabled = true;
    document.getElementById('texteh').style.opacity = 0.5;
    document.getElementById('texteh').style.cursor = 'default';
    calculateWPM(time);
  };

  const resetTimer = () => {
    setTime(0);
  };

  const calculateWPM = (elapsed) => {
    setWpm(((splitToType.length - wrongWords + 1) / (elapsed / 1000 / 60)).toFixed(2));
  };


  const matchColourBot = (i) => {
    if (i < botColourList.length) {
      return { color: botColourList[i] };
    }
    return { color: '#2c2c2c' };
  };

  useEffect(() => {
    let interval;
    if (isRunning === 1) {
      let l = botColourList.slice();
      interval = setInterval(() => {
        if (l.length <= toType.length) {
          l.push('#26734d');
          setBotColourList(l);
        }
        if (l.length === toType.length) {
          stopTimer();
        }
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // document.addEventListener("DOMContentLoaded", function() {
  //   const editableDiv = document.getElementById('editable');
  //   editableDiv.innerHTML = "Type your text here.";

  //   editableDiv.addEventListener('input', function() {
  //     const text = editableDiv.innerText;
  //     setTyped(text);
  //     console.log(typed);
  //   });
  // });

  return (
    <div className="container">
      {showButtons ? (
        <div>
          <button
            className="btn btn-dark btn-block"
            onClick={clickEasy}
            style={{ padding: '10px 20px 10px 20px', borderRadius: '15px', marginRight: '10px', fontSize: '25px' }}
          >
            Easy
          </button>

          <button
            className="btn btn-dark btn-block"
            onClick={clickMed}
            style={{ padding: '10px 20px 10px 20px', borderRadius: '15px', marginRight: '10px', fontSize: '25px' }}
          >
            Medium
          </button>

          <button
            className="btn btn-dark btn-block"
            onClick={clickHard}
            style={{ padding: '10px 20px 10px 20px', borderRadius: '15px', marginRight: '10px', fontSize: '25px' }}
          >
            Hard
          </button>

          <div style={{ height: '20px' }}></div>
        </div>
      ) : (
        <div>
          {/* text+typebox / button for text */}
          <div className="row">
            {!showText ? (
              <div style={{ padding: '20px' }}>

                {/* button to generate text: */}
                <button
                  className="btn btn-dark btn-block"
                  onClick={genText}
                  style={{ padding: '10px 20px 10px 20px', borderRadius: '15px', fontSize: '25px' }}
                >
                  Generate Text
                </button>

              </div>
            ) : (
              <div>

                <p style={{ padding: '15px', backgroundColor: '#ffc53e' }}>
                  ????:{' '}
                  {toType.slice().split('').map((char, i) => (
                    <span key={i} style={matchColourBot(i)}>
                      {char}
                    </span>
                  ))}
                </p>

                {/* text */}
                <p style={{ padding: '15px' }}>
                  ?????????????:{' '}
                  {displayText.map((word, i) => (
                    <span key={i}>
                      {word.split('').map((char, j) => (
                        <span key={j} style={matchColour(i, j)}>
                          {char}
                        </span>
                      ))}
                      {' '}
                    </span>
                  ))}
                </p>

                {/* <p style={{ padding: '0 0 10px 0' }}>{toType}</p> */}

                {/* textbox */}
                <textarea
                  className="form-control"
                  id='texteh'
                  rows={10}
                  style={{ backgroundColor: "grey", border: "grey", height: '10px', boxShadow: '10px 10px #505050', borderRadius: '12px', opacity: '0.1' }}
                  placeholder=""
                  defaultValue={typed}
                  onInput={handleTextChange}
                />

                {/* time */}
                <h1 style={{ padding: '20px 0 15px 0' }}>
                  time: {(time / 1000).toFixed(2)}s
                </h1>
              </div>
            )}
          </div>


          { // <div id="editable" contentEditable="true"></div>
          }

          {/* <div className="row" style={{ marginTop: '20px' }}>
        <div className="col-12">
          <p className="text-center">
            {typed}
          </p>
        </div>
      </div> */}

          {isRunning === 2 ? (
            <div>
              <h1>
                wpm: {wpm}
              </h1>
              <h1 style={{ padding: '15px 0 15px 0' }}>
                wrong words: {wrongWords}

                <div style={{ padding: '15px 0 15px 0' }}>
                  {win ? (
                    <div>
                      You Win!
                    </div>
                  ) : (
                    <div>
                      You Lose :(
                    </div>
                  )}
                </div>

              </h1>
              {/* button to reset: */}
              <button
                className="btn btn-dark btn-block"
                onClick={close}
                style={{ padding: '10px 20px 10px 20px', borderRadius: '15px' }}
              >
                Reset
              </button>

              <div style={{ height: '20px' }}></div>
            </div>
          ) : (
            ''
          )}
        </div>
      )}

    </div>
  );
};

export default Bots;