const hello = ["Hello human! what\'s up?",
    "hi, how are you doing?",
    "What\'s up?",
    "Ahoy matey! How are ye?",
    "What\'s shaking?"
  ],

  joke = ["How many programmers does it take to change a light bulb? None, it\'s a hardware problem...",
    "Why do mummies have trouble keeping friends? Because they\'re so wrapped up in themselves.",
    "What did one ocean say to the other ocean? Nothing, they just waved.",
    "Two goldfish are in a tank. One turns to the other and says, Do you know how to drive this thing?",
    "Why did the pirate buy an eye patch?  Because he couldn\'t afford an iPad!",
    "What did the pirate say on his 80th birthday? Aye Matey!",
    "Why don\'t scientists trust atoms? Because they make up everything."
  ];

// Store voices
let voices = [];
// UI elements
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");
const processing = document.getElementById("processing");

// Wait on voices to be loaded before fetching list
window.speechSynthesis.onvoiceschanged = () => { 
  voices = window.speechSynthesis.getVoices(); 
};

// Speech to Text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let toggleBtn = null;
if (typeof SpeechRecognition === "undefined") {
  startBtn.remove();
  result.innerHTML = "<strong>Your browser does not support Speech API. Please download latest Chrome version.<strong>";
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true; // If true, the silence period is longer
  recognition.interimResults = true;
  recognition.onresult = event => {
    const current = event.resultIndex;
    const recognitionResult = event.results[current];
    const recognitionText = recognitionResult[0].transcript;
	
    if (recognitionResult.isFinal) {
      processing.innerHTML = "processing ...";

      const response = process(recognitionText);
      const p = document.createElement("p");
      p.innerHTML = `<strong>You said:</strong> ${recognitionText} </br><strong>Sonya said:</strong> ${response}`;
      processing.innerHTML = "";
      result.appendChild(p);

      readOutLoud(response);
    } else {
      processing.innerHTML = `listening: ${recognitionText}`;
    }
  };
  let listening = false;
  toggleBtn = () => {
    if (listening) {
      recognition.stop();
      startBtn.textContent = "Start listening";
    } else {
      recognition.start();
      startBtn.textContent = "Stop listening";
    }
    listening = !listening;
  };
  startBtn.addEventListener("click", toggleBtn);
}

// Processor
function process(rawText) {
  let text = rawText.replace(/\s/g, "").replace(/\'/g, "");
  text = text.toLowerCase();
  let response = null;

  if (text.includes("hello") || text.trim() == "hi" || text.includes("hey")) {
    response = getRandomItemFromArray(hello);
  } else if (text.includes("yourname")) {
    response = "My name's Sonya.";
  } else if (text.includes("howareyou") || text.includes("whatsup")) {
    response = "I'm fine. How about you?";
  } else if (text.includes("whattimeisit")) {
    response = new Date().toLocaleTimeString();
  } else if (text.includes("joke")) {
    response = getRandomItemFromArray(joke);
  } else if (text.includes("play") && text.includes("despacito")) {
    response = "Opened it in another tab";
    window.open("https://www.youtube.com/watch?v=kJQP7kiw5Fk", "_blank", "noopener");
  } else if (text.includes("flip") && text.includes("coin")) {
    response = Math.random() < 0.5 ? "heads" : "tails";
  } else if (text.includes("bye") || text.includes("stop")) {
    response = "Bye!!";
    toggleBtn();
  } 

  if (!response) {
    window.open(`http://google.com/search?q=${rawText.replace("search", "")}`, "_blank", "noopener");
    return `I found some information for ${rawText}`;
  }

  return response;
}

function getRandomItemFromArray(array) {
  const randomItem = array[Math.floor(Math.random() * array.length)];
  return randomItem;
};

// Set the text and voice attributes.
function readOutLoud(message) {
  const speech = new SpeechSynthesisUtterance();
  
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1.8;
  speech.voice = voices[3];

  window.speechSynthesis.speak(speech);
}

