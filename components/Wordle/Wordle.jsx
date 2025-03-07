import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import { s } from "./Wordle.style";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { azWords } from "./words";
import { enWords } from "./words";
import enFlag from "../../assets/uk.png";
import ruFlag from "../../assets/russia.png";
import azFlag from "../../assets/azerbaijan.png";

const azKeys = {
  lineOne: ["q", "ü", "e", "r", "t", "y", "u", "i", "o", "p", "ö", "ğ"],
  lineTwo: ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ı", "ə"],
  lineThree: ["z", "x", "c", "v", "b", "n", "m", "ç", "ş"],
};

const enKeys = {
  lineOne: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  lineTwo: ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  lineThree: ["z", "x", "c", "v", "b", "n", "m"],
};

const ruKeys = {
  lineZero: ["ё", "ъ"],
  lineOne: ["я", "ш", "е", "р", "т", "ы", "у", "и", "о", "п", "ю", "щ", "э"],
  lineTwo: ["а", "с", "д", "ф", "г", "ч", "й", "к", "л", "ь", "ж"],
  lineThree: ["з", "х", "ц", "в", "б", "н", "м"],
};

const keyLang = {
  az: azKeys,
  en: enKeys,
  ru: ruKeys,
};

const wordsLang = {
  az: azWords,
  en: enWords,
  // ru: ,
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
  const [langModalVisible, setLangModalVisible] = useState(true);
  const [lang, setLang] = useState("az");

  function chooseLang(language) {
    setLang(language);
    setLangModalVisible(false);
    startNewGame(language);
  }

  const startNewGame = (language) => {
    const randomIndex = Math.floor(Math.random() * wordsLang[language].length);
    setWord(wordsLang[language][randomIndex]);
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
    let newColors = [...colors];
    const wordLetters = word.split("");
    const txtLetters = [...txt];
    const matchedIndices = [];
    console.log("word", word);
    console.log("txtLetters", txtLetters);

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
        { text: "OK", onPress: () => setLangModalVisible(true) },
      ]);
    } else if (currentLine === 5) {
      Alert.alert("You lost!", `The word was: ${word}`, [
        { text: "Try Again", onPress: () => setLangModalVisible(true) },
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

      if (
        currentIndex === 4 &&
        wordsLang[lang].includes(currentInputs.join(""))
      ) {
        setBtnStatus({ status: "SUBMIT", show: true });
      } else if (currentIndex !== 4) {
        setBtnStatus({ status: "SUBMIT", show: false });
      } else if (!wordsLang[lang].includes(currentInputs.join(""))) {
        setBtnStatus({ status: "NOT A WORD", show: false });
      }

      if (currentIndex < currentInputs.length - 1) {
        inputRefs.current[currentLine][currentIndex + 1].focus();
      }
      console.log("currentInputs.join()", currentInputs.join(""));
      console.log("word", word);
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
    return Object.keys(keyLang[lang]).map((key, rowIndex) => (
      <View key={rowIndex} style={s.keyboardRow}>
        {keyLang[lang][key].map((letter, index) => (
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={langModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setLangModalVisible(!langModalVisible);
        }}
      >
        <View style={s.modalContainer}>
          <View style={s.flagContainer}>
            <TouchableOpacity onPress={() => chooseLang("az")}>
              <Image style={s.flag} source={azFlag} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => chooseLang("en")}>
              <Image style={s.flag} source={enFlag} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => chooseLang("ru")}>
              <Image style={s.flag} source={ruFlag} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Wordle;
