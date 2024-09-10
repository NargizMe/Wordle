import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { s } from "./Wordle.style";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { azWords } from "./words";

const azKeys = {
  lineOne: ["Q", "Ü", "E", "R", "T", "Y", "U", "İ", "O", "P", "Ö", "Ğ"],
  lineTwo: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "I", "Ə"],
  lineThree: ["Z", "X", "C", "V", "B", "N", "M", "Ç", "Ş"],
};

const enKeys = {
  lineOne: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  lineTwo: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  lineThree: ["Z", "X", "C", "V", "B", "N", "M"],
};

const Wordle = () => {
  const [lines, setLines] = useState(
    Array(6)
      .fill("")
      .map(() => Array(5).fill(""))
  );
  const [colors, setColors] = useState(
    Array(6)
      .fill("")
      .map(() => Array(5).fill(""))
  );
  const [currentLine, setCurrentLine] = useState(0);
  const [btnStatus, setBtnStatus] = useState({ status: "SUBMIT", show: false });
  const inputRefs = useRef([]);
  const [word, setWord] = useState("");

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * azWords.length);
    setWord(azWords[randomIndex]);
    setLines(
      Array(6)
        .fill("")
        .map(() => Array(5).fill(""))
    );
    setColors(
      Array(6)
        .fill("")
        .map(() => Array(5).fill("transparent"))
    );
    setCurrentLine(0);
    setBtnStatus({ status: "SUBMIT", show: false });
  };

  const checkWord = (txt) => {
    console.log(word);

    let newColors = [...colors];
    const wordLetters = word.split("");
    const txtLetters = [...txt];
    const matchedIndices = [];

    // First pass: mark correct letters in the correct position as green
    txt.forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newColors[currentLine][index] = "green";
        matchedIndices.push(index);
        wordLetters[index] = null; // Mark this letter in the word as processed
        txtLetters[index] = null; // Mark this letter in the guess as processed
      }
    });

    // Second pass: mark letters that are in the word but not in the correct position
    txt.forEach((letter, index) => {
      if (letter && txtLetters[index] !== null) {
        const letterIndex = wordLetters.indexOf(letter);
        if (letterIndex !== -1) {
          newColors[currentLine][index] = "orange";
          wordLetters[letterIndex] = null; // Mark this letter in the word as processed
        } else {
          newColors[currentLine][index] = "grey";
        }
      }
    });

    setColors(newColors);

    if (word === txt.join("")) {
      Alert.alert("You won!", "Congratulations!", [
        { text: "OK", onPress: startNewGame },
      ]);
    } else if (currentLine === 5) {
      Alert.alert("You lost!", `The word was: ${word}`, [
        { text: "Try Again", onPress: startNewGame },
      ]);
    }
  };

  const handleKeyPress = (key) => {
    let currentInputs = lines[currentLine];
    let currentIndex = currentInputs.findIndex((input) => input === "");

    if (key === "DEL") {
      if (currentIndex === -1) currentIndex = currentInputs.length;
      if (currentIndex > 0) {
        currentIndex--;
        currentInputs[currentIndex] = "";
        updateLineState(currentInputs);
        inputRefs.current[currentLine][currentIndex].focus();
      }
      setBtnStatus({ status: "SUBMIT", show: false });
    } else if (key === "SUBMIT") {
      checkWord(lines[currentLine]);
      if (currentLine < 5) {
        setCurrentLine(currentLine + 1);
      }
      setBtnStatus({ status: "SUBMIT", show: false });
    } else {
      if (currentIndex === -1) return;
      currentInputs[currentIndex] = key;
      updateLineState(currentInputs);

      if (currentIndex === 4 && azWords.includes(currentInputs.join(""))) {
        setBtnStatus({ status: "SUBMIT", show: true });
      } else if (currentIndex !== 4) {
        setBtnStatus({ status: "SUBMIT", show: false });
      } else if (!azWords.includes(currentInputs.join(""))) {
        setBtnStatus({ status: "NOT A WORD", show: false });
      }

      if (currentIndex < currentInputs.length - 1) {
        inputRefs.current[currentLine][currentIndex + 1].focus();
      }
    }
  };

  const updateLineState = (newInputs) => {
    const updatedLines = [...lines];
    updatedLines[currentLine] = newInputs;
    setLines(updatedLines);
  };

  const renderInputs = () => {
    return lines.map((line, lineIndex) => (
      <View key={lineIndex} style={s.inputRow}>
        {line.map((value, index) => (
          <TextInput
            key={index}
            value={value}
            ref={(ref) => {
              if (!inputRefs.current[lineIndex]) {
                inputRefs.current[lineIndex] = [];
              }
              inputRefs.current[lineIndex][index] = ref;
            }}
            style={[s.input, { backgroundColor: colors[lineIndex][index] }]}
            editable={false}
            onFocus={() => inputRefs.current[lineIndex][index].blur()}
          />
        ))}
      </View>
    ));
  };

  const renderKeyboard = () => {
    return Object.keys(azKeys).map((key, rowIndex) => (
      <View key={rowIndex} style={s.keyboardRow}>
        {azKeys[key].map((letter, index) => (
          <TouchableOpacity
            style={s.keyboardBtn}
            key={index}
            onPress={() => handleKeyPress(letter)}
          >
            <Text style={s.keyText}>{letter}</Text>
          </TouchableOpacity>
        ))}
        {key === "lineThree" && (
          <TouchableOpacity
            style={s.keyboardDelBtn}
            onPress={() => handleKeyPress("DEL")}
          >
            <Text style={s.keyText}>
              <FontAwesome6 name="delete-left" size={22} color="black" />
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  return (
    <View style={s.container}>
      <View style={s.inputContainer}>{renderInputs()}</View>
      <View style={s.keyboardContainer}>
        {renderKeyboard()}
        <TouchableOpacity
          onPress={() => handleKeyPress("SUBMIT")}
          style={s.submitBtn}
          disabled={!btnStatus.show}
        >
          <Text
            style={[
              s.submitBtnTxt,
              !btnStatus.show ? { backgroundColor: "grey" } : null,
            ]}
          >
            {btnStatus.status}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Wordle;
