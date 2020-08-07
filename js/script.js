const sentences = [
    "type this line to find out how many words per minute or wpm you can type",
    "form milk find hold nose ship each bug such slip on army also not bad wear rise",
    "hide tale rice city too real job wood long gain slow fact mind make pick seem",
    // "hello",
    // "howdy",
    // "normal",
    // "type it out"
];

// variables
let currentIndex = 0;
let errorOccured = [];
const backspace_code = 8;
let text = document.getElementById('text-to-type').innerHTML;
const input = document.getElementById('edit-text');

// timer vars
let startTime, endTime;

let currentKeyPressed, originalChar;

// vars for deteccting accuracy & speed
let lengthOfSentence;
let errorsCount = 0;

const greenColor = 'rgba(67, 190, 49, 0.8)';
const redColor = 'rgba(231, 28, 35, 0.8)';
const blackColor = '#000000';

// functions
const calculateAccuracy= () =>{
    let accuracy = 100 - ((errorsCount / lengthOfSentence)*100 );
    accuracy = accuracy.toFixed(2);
    return accuracy;
}

const calculateWPM = (timeElapsed) => {
    let wpm = (lengthOfSentence / 5) / timeElapsed;
    return wpm;
}
const calculateTime = (startTime , endTime) => {
    let startSeconds  = (startTime.getMinutes()*60) + (startTime.getSeconds());
    let endSeconds = (endTime.getMinutes()*60) + (endTime.getSeconds());
    let diff = endSeconds - startSeconds;
    if(diff <= 0){
        diff = 1;
    }
    // return difference in minutes
    return (diff/60);
}
const setSentenceRandomly = function(){
    currentIndex =0;
    let randomIndex = Math.floor(Math.random() * sentences.length);
    document.getElementById('text-to-type').innerHTML = sentences[randomIndex];
    text = sentences[randomIndex];
    lengthOfSentence = text.length;
}

const clearInput = ()=>{
    input.value = "";
}
const removeColor = function(charID){
    document.getElementById(charID).style.backgroundColor = blackColor;
}

const showColor = function(index,removePrevious){
    // remove previous color
    if(removePrevious){
        let del_char = text.charAt(index - 1).toUpperCase();
        if(del_char == ' '){
            del_char = 'space-bar';
        }
        removeColor(del_char);
    }

    // mark upcoming character as green
    let char = text.charAt(index).toUpperCase();
    if(char == ' '){
        char = 'space-bar';
    }
    // mark red if wrong character is typed
    if(errorOccured.length > 0){
        errorOccured.forEach(element => {
            removeColor(element);
        });
    }
    document.getElementById(char).style.backgroundColor = greenColor;
    
    
}

const showError = function(keyPressed){
    if(keyPressed == ' '){
        keyPressed = 'space-bar';
    }
    document.getElementById(keyPressed).style.backgroundColor = redColor;
    
}

// MAIN method
const main = function() {
    document.getElementById('edit-text').focus();

    setSentenceRandomly();
    
    showColor(currentIndex, false);

    input.addEventListener('keydown', function(e){
        if(e.keyCode == backspace_code){
            e.preventDefault();
        }
    });

    input.addEventListener('keypress', function(e){
        if(currentIndex >= text.length){
            e.preventDefault();
            return;
        }
        currentKeyPressed = String.fromCharCode(e.charCode);
        originalChar = text.charAt(currentIndex);
        if(currentKeyPressed == originalChar){
            if(currentIndex == 0){
                startTime = new Date();
            }
            currentIndex++;
            if(currentIndex <= (lengthOfSentence -1)){
                showColor(currentIndex, true);
            }
            errorOccured = [];
        } else {
            errorsCount++;
            currentKeyPressed = currentKeyPressed.toUpperCase();
            if(currentKeyPressed == ' ') currentKeyPressed = 'space-bar';
            errorOccured.push(currentKeyPressed);
            showError(currentKeyPressed);
            e.preventDefault();
        }
    });

    input.addEventListener('keyup', (e)=>{
        if(currentKeyPressed == originalChar){
            if(currentIndex >= (lengthOfSentence)){
                endTime = new Date();
                removeColor(currentKeyPressed.toUpperCase());
                let wpmSpeed = calculateWPM(calculateTime(startTime, endTime));
                document.getElementById('speed-value').innerHTML = parseInt(wpmSpeed);
                document.getElementById('acc-value').innerHTML = calculateAccuracy();

                clearInput();
                setSentenceRandomly();
                showColor(currentIndex, false);

            }
        }
    });
    
}

window.addEventListener('load', main);