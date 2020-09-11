
// let array = ['This is a random questions', 'How many licks in a lollipop?', 'What color is the sky', 'How old is the oldest person?', 'What year was I born?', 'What year are we in?']
const card_text = document.querySelector('.card_text');
card_text.style.setProperty('--animate-duration', '.5s');
card_text.style.setProperty('animation-fill-mode',  'none');
const card = document.querySelector('.card');
const text = document.querySelector('h6');
const loggedIn = document.querySelector('.logged-in');
const login = document.querySelector('.login');
const levelBar = document.querySelector('#level');
const difficultyBar = document.querySelector('#difficulty');
const logo = document.querySelector('.logo');
const item3 = document.querySelector('.item3');
const option1 = document.querySelector('#option_1');
const option2 = document.querySelector('#option_2');
const nextBtn = document.querySelector('#next_question');
const loginForm = document.querySelector('.name-form');
const numRight = document.querySelector('#num-right');
const numWrong = document.querySelector('#num-wrong');
const opField1 = document.querySelector('#op1');
const opField2 = document.querySelector('#op2');
const rightAnsLabel1 = document.querySelector('#ans-opt-1');
const rightAnsLabel2 = document.querySelector('#ans-opt-2');
const questionForm = document.querySelector('#question-form');
const body = document.querySelector('.login');
const createdQuestions = document.querySelector('#created_questions');
const numQuestions = document.querySelector('#num-questions');
const editBtn = document.querySelector('#edit-btn');
const delBtn = document.querySelector('#del-btn');
const modal = document.getElementById("myModal");
const modalBtn = document.getElementById("myBtn");
let modalText = document.querySelector('#modal-text')
const item1 = document.querySelector('.item1')
const item2 = document.querySelector('.item2')
const item4 = document.querySelector('.item4')
const item5 = document.querySelector('.item5')
let consecutiveRight = 0
let filteredQ = []
let rightAns = []
let wrongAns = []
let createdQuestionsArray = []
let shown = 0
const eSTheme = ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93" ]
const mSTheme = ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"]
const hSTheme = ["#1A535C", "#4ECDC4", "#F7FFF7", "#FF6B6B", "#FFE66D"]
const satTheme = ["#e63946", "#a8dadc", "#457b9d", "#1d3557", "#f1faee"]
let twoAwards = false
const toolModal = document.getElementById("toolModal");
const span = document.getElementsByClassName("close")[0];
const toolbar = document.querySelector('.toolbar')
let thisUser = null


//when card is clicked, a new question is pulled
nextBtn.addEventListener('click', function(e){
    resetCard();
    pickAQuestion(filteredQ)
  
});


//right & wrong option buttons
card_text.addEventListener('click', function(e){
    if (e.target.matches("#option_1")){
    option1.disabled = true;
    option2.disabled = true;   
        if(e.target.dataset.btn === e.target.dataset.correct){
            rightAns.push(option1.dataset.qId)
            option1.style.background = 'rgb(33 214 23)';
            numRight.innerHTML = `<br>${rightAns.length}`
            countCorrectQuestions();
            countConsecutiveRight(true);
        } else {
            wrongAns.push(option1.dataset.qId)
            option1.style.background = '#E63946'
            numWrong.innerHTML = `<br>${wrongAns.length}`
            countWrongQuestions();
            countConsecutiveRight(false);
        }
    countQuestionsAnswered();
} else if (e.target.matches("#option_2") ){
    option1.disabled = true;
    option2.disabled = true;
        if(e.target.dataset.btn === e.target.dataset.correct){
            rightAns.push(option2.dataset.qId)
            option2.style.background = 'rgb(33 214 23)';
            numRight.innerHTML = `<br>${rightAns.length}`
            countCorrectQuestions();
            countConsecutiveRight(true);
        } else {
            wrongAns.push(option2.dataset.qId)
            option2.style.background = '#E63946'
            numWrong.innerHTML = `<br>${wrongAns.length}`
            countWrongQuestions();
            countConsecutiveRight(false);
        }
    countQuestionsAnswered();   
    } 
})


// sets class back to plain classname after animation flip
card_text.addEventListener('animationend', function(e) {
    card_text.className = 'card_text'
  });

//call to API with level and difficulty passed in so it can be passed to filter function
function getAllQuestions(level, diff){
  fetch('http://localhost:3000/questions/')
  .then(resp => resp.json())
  .then(questions => filterQuestions(questions, level, diff))
}

//all the questions from database are passed into this function. Based on arg's passed in, filtered array
//is created and contains only questions within param
  function filterQuestions(questionsArray, level, diff){
    filteredQ = []
    filteredQ = questionsArray.filter(question => question.level === level && question.difficulty === parseInt(diff))
    pickAQuestion(filteredQ)
  }

  //pull a random question from filtered array
  function pickAQuestion(questions){
      displayQuestion(questions[Math.floor(Math.random() * questions.length)])
  }

  //display question on flashcard
  function displayQuestion(question){
    text.innerHTML = `<ul style="margin-left: -125px">
    <li>${question.related_words[0].charAt(0).toUpperCase() + question.related_words[0].slice(1).toLowerCase()}</li>
    <li>${question.related_words[1].charAt(0).toUpperCase() + question.related_words[1].slice(1).toLowerCase()}</li>
    <li>${question.related_words[2].charAt(0).toUpperCase() + question.related_words[2].slice(1).toLowerCase()}</li>
    </ul>`
    option1.innerText = question.option_1.charAt(0).toUpperCase() + question.option_1.slice(1).toLowerCase()
    option1.dataset.correct = question.correct_answer
    option1.dataset.qId = question.id
    option2.innerText = question.option_2.charAt(0).toUpperCase() + question.option_2.slice(1).toLowerCase()
    option2.dataset.correct = question.correct_answer
    option2.dataset.qId = question.id
  }
//before user logs in
loggedIn.hidden = true;




//login verified 
loginForm.addEventListener('submit', function(e){
    console.log(e.target.firstElementChild.value)
    e.preventDefault();
    loggedIn.hidden = false;
    //login.style.backgroundColor = '#a8dadc';
    //login.children[0].remove();
    logo.hidden = true
    loginForm.hidden = true
    let username = e.target.firstElementChild.value
    checkForUser(username)
    // const options = {
    //     method: 'POST',
    //     headers: {'content-type': 'application/json', 'accept': 'application/json'},
    //     body: JSON.stringify({name: currentUser})
    // }
    // fetch("http://localhost:3000/users/", options)
    // .then(resp => resp.json())
    // .then(myUser => storeUser(myUser))
    // start();
})

function checkForUser(loggedUser){
    fetch("http://localhost:3000/users/")
    .then(resp => resp.json())
    .then(users => { let found = null
        for(let user of users){
            if(user.name === loggedUser){
                found = user
            }
        }
        settingUpUser(found, loggedUser)
    })
}

function settingUpUser(user, loggedUser){
    if(user){
        storeUser(user)
        start();
    } else {
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json', 'accept': 'application/json'},
            body: JSON.stringify({name: loggedUser})
        }
        fetch("http://localhost:3000/users/", options)
        .then(resp => resp.json())
        .then(myUser => storeUser(myUser))
        start();
    }
}

//store User's ID to body tag when they log in
const storeUser = (myUser) => {
 thisUser = body.dataset.user = myUser.id
}

//load game 
function start(){
    setTheme(eSTheme);
    getAllQuestions('ES', 1);
    card_text.classList.add('animate__animated', 'animate__bounceInLeft');
    getDifficulty('ES');
    getLevels();   
}

//calls API to get a list of all questions then sorts through array to get uniqe level values
function getLevels(){
  fetch('http://localhost:3000/questions/')
  .then(resp => resp.json())
  .then(questions => {
        let levels = []
        let uniqValue = []
      for(let question of questions){
        levels.push(question.level)
      }
      levels.forEach((l) => {
          if(!uniqValue.includes(l)){
              uniqValue.push(l)
          }
      })
      populateLevelBar(uniqValue)
  })
}

function resetCard(){
    card_text.classList.add('animate__animated', 'animate__flip');
    option1.disabled = false;
    option2.disabled = false;
    option1.style.background = 'white'
    option2.style.background = 'white'
}
// when user selects an option from level, sends option value and 1 (for difficulty) to getAllQuestions()
//also sends the option value to getDifficulty() to grab a list of all the difficulty numbers
levelBar.addEventListener('change', function(e){
    resetCard();
    getAllQuestions(e.target.value, 1)
    getDifficulty(e.target.value)
    updateTheme(e.target.value)
})

//when user clicks on difficulty bar the value from both dropsdowns are sent to getAllQuestions()
difficultyBar.addEventListener('change', function(e){
    resetCard();
    getAllQuestions(e.target.previousElementSibling.value, e.target.value)
})

//calls API to get a list of all questions then sorts through array to get uniqe difficulty values
function getDifficulty(level){
  fetch('http://localhost:3000/questions/')
  .then(resp => resp.json())
  .then(questions => {
        let difficulty = []
        let uniqValue = []
      for(let question of questions){
        if(question.level === level){
            difficulty.push(question.difficulty)
        }
      }
      difficulty.forEach((d) => {
          if(!uniqValue.includes(d)){
              uniqValue.push(d)
          }
      })
      populateDifficultyBar(uniqValue)
  })
}

 //create options in select element for difficulties
function populateDifficultyBar(difficulty){
    let sorted = difficulty.sort(function(a, b){
    return a - b
    })
    difficultyBar.innerHTML = ""
    for(let num of sorted){
        let option = document.createElement('option')
        option.value = num
        option.innerText = num
        difficultyBar.append(option)
    }
}

//create options in select element for levels
function populateLevelBar(levels){
    levelBar.innerHTML = ""
    let name = "";
    for(let level of levels){
        let option = document.createElement('option')
        option.value = level
        if(level == 'ES'){
            name = 'Elementary School'
        } else if(level == 'MS'){
            name = 'Middle School'
        } else if (level == 'HS'){
            name = 'High School'
        } else {
            name = 'SAT'
        }
        option.innerText = name
        levelBar.append(option)
    }
}

//auto populate radio1 field
opField1.addEventListener('input', function(e){
    rightAnsLabel1.textContent = e.target.value
})

//auto populate radio2 field
opField2.addEventListener('input', function(e){
    rightAnsLabel2.textContent = e.target.value
})

//Grab values off Form 
questionForm.addEventListener('submit', function(e){
    e.preventDefault();
    let button = e.target
    const rw1 = document.querySelector("#rw1")
    const rw2 = document.querySelector("#rw2")
    const rw3 = document.querySelector("#rw3")
    const levelDrop = document.querySelector("#level-drpdwn")
    const diffDrop = document.querySelector("#difficulty-drpdwn")
    const op1Btn = document.querySelector("#op1Btn")
    let relatedWordsArr = []
    let corr_answer = 2

    if (op1Btn.checked) {
        corr_answer = 1
    }

    if (diffDrop.value === "Select A Difficulty"){
        diffDrop.value = 1
    }

    if (levelDrop.value === "Select A Level"){
        levelDrop.value = "ES"
    }

    relatedWordsArr.push(rw1.value, rw2.value, rw3.value)

    //create config options for API call to create a new obj
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"},
        body: JSON.stringify({
            related_words: relatedWordsArr,
            option_1: opField1.value,
            option_2: opField2.value,
            correct_answer: corr_answer,
            level: levelDrop.value,
            difficulty: diffDrop.value})
    }

    fetch("http://localhost:3000/questions", options)
    .then(resp => resp.json())
    .then(function(question){
        updateUserQuestions(question);
        createdQuestionsArray.push(question);
        updateNumQuestions();
        countCreatedQuestions();
    })
    //reset form
    questionForm.reset();
    rightAnsLabel1.textContent = "Option 1"
    rightAnsLabel2.textContent = "Option 2"
    
})

//creates a record in user_questions table
function updateUserQuestions(question){
    const config = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"},
        body: JSON.stringify({
            user_id: thisUser,
            question_id: question.id})
    }
    //make post request
    fetch("http://localhost:3000/user_questions", config)
    .then(resp => resp.json())
    .then(uQ => displayUserQuestion(question, uQ.id))
}

//create an li for each question created by user. Display related words in createdQuestions div
function displayUserQuestion(question, uQ){
    // if(typeof question != string){
    //     question = question.id
    // }
    const stringWord = question.related_words.join(", ")
    const span = document.createElement('span')
    createdQuestions.prepend(span)
    span.innerHTML = 
    ` ${stringWord}<br>
        <button style="font-size: 25px; border-radius: 30px;" id="edit-btn" data-uq-id="${uQ}" data-q-id="${question.id}">Edit</button>
        <button style="background: red;border-radius: 30px;width: 40px;height: 40px;font-size: 30px;" id="del-btn" data-uq-id="${uQ}" data-q-id="${question.id}">X</button>
        <br>`
}

//changes the innerText of Created Questions under Stats
function updateNumQuestions(){
    numQuestions.innerHTML = `<br>${createdQuestionsArray.length}`
}  

//resets form whenever user clicks submit or update on form
function resetForm(){
    questionForm.reset();
    rightAnsLabel1.textContent = "Option 1"
    rightAnsLabel2.textContent = "Option 2"
}

//listens for clicks on li edit btn, li delete btn, and form submit-edit btn
document.addEventListener('click', function(e){
    const button = e.target
    if (button.matches('#edit-btn')) {
        editQuestion(button.dataset.qId, button.dataset.uqId)
        button.parentElement.remove();
    } else if (button.matches('#del-btn')){
        deleteQuestion(button.dataset.qId, button.dataset.uqId)
        button.parentElement.remove();
        resetForm();
    } else if (button.matches('#btn-edit')){
        let updateId = button.dataset.update
        const rw1 = document.querySelector("#rw1")
        const rw2 = document.querySelector("#rw2")
        const rw3 = document.querySelector("#rw3")
        const levelDrop = document.querySelector("#level-drpdwn")
        const diffDrop = document.querySelector("#difficulty-drpdwn")
        const op1Btn = document.querySelector("#op1Btn")
        let relatedWordsArr = []
        let corr_answer = 2
    
        if (op1Btn.checked) {
            corr_answer = 1
        }

        if (diffDrop.value === "Select A Difficulty"){
            diffDrop.value = 1
        }
    
        if (levelDrop.value === "Select A Level"){
            levelDrop.value = "ES"
        }    
    
        relatedWordsArr.push(rw1.value, rw2.value, rw3.value)
    
        const span = document.createElement('span')
        createdQuestions.prepend(span)
        span.innerHTML = 
        ` ${relatedWordsArr.join(', ')}<br>
        <button style="font-size: 25px; border-radius: 30px;" id="edit-btn" data-uq-id="${document.querySelector('#btn-edit').dataset.record}" data-q-id="${document.querySelector('#btn-edit').dataset.update}">Edit</button>
        <button style="background: red;border-radius: 30px;width: 40px;height: 40px;font-size: 30px;" id="del-btn" data-uq-id="${document.querySelector('#btn-edit').dataset.update}" data-q-id="${document.querySelector('#btn-edit').dataset.record}">X</button>`


        const options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"},
            body: JSON.stringify({
                related_words: relatedWordsArr,
                option_1: opField1.value,
                option_2: opField2.value,
                correct_answer: corr_answer,
                level: levelDrop.value,
                difficulty: diffDrop.value})
        } 
        fetch("http://localhost:3000/questions/" + updateId, options)
        .then(resp => resp.json())
        resetForm();
        document.querySelector('#btn-edit').hidden = true
        document.querySelector('#submit-create').hidden = false
    }

})

//fetches question by Id and populates form fields
const editQuestion = (qId, uqId) => {
    document.querySelector('#btn-edit').hidden = false
    document.querySelector('#submit-create').hidden = true
    document.querySelector('#btn-edit').dataset.update = qId
    document.querySelector('#btn-edit').dataset.record = uqId
    //might work
    
        //end test above
    
    fetch("http://localhost:3000/questions/" + qId)
    .then(resp => resp.json())
    .then(question => {  

        const rwOne = document.querySelector("#rw1")
        const rwTwo = document.querySelector("#rw2")
        const rwThree = document.querySelector("#rw3")
        const levelDropdown = document.querySelector("#level-drpdwn")
        const diffDropdown = document.querySelector("#difficulty-drpdwn")
        rwOne.value = question.related_words[0]
        rwTwo.value = question.related_words[1]
        rwThree.value = question.related_words[2]
        levelDropdown.value = question.level
        diffDropdown.value = question.difficulty
        opField1.value = question.option_1
        opField2.value = question.option_2
        rightAnsLabel1.innerText = question.option_1
        rightAnsLabel2.innerText = question.option_2
        if (question.correct_answer === 1) {
            op1Btn.checked = true
        } else {
            op2Btn.checked = true
        }
    })
}

//removes record from table and updates stats info
const deleteQuestion = (qId, uqId) => {
    const options = {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"},
    }
    fetch("http://localhost:3000/user_questions/" + uqId, options)
    fetch("http://localhost:3000/questions/" + qId, options)
    createdQuestionsArray.pop();
    updateNumQuestions();
}

///////////// BADGES //////////////////

const countQuestionsAnswered = () => {
    const totalQuestionsAnswered = rightAns.length + wrongAns.length
    if (totalQuestionsAnswered === 10) {
        modalText.innerHTML = `Congrats, You've answered 10 questions!<br><img src="./styles/orange10.png"width='300px'>`
        giveAward('#orange10')
        twoAwards = true

    } else if (totalQuestionsAnswered === 30) {
        modalText.innerHTML = `Congrats, You've answered 30 questions!<br><img src="./styles/orange30.png"width='300px'>`
        giveAward('#orange30')
        twoAwards = true
    }
    
}

function giveAward(elementId){
    modalBtn.click();
    document.querySelector(elementId).hidden = false
    modalText.classList.add('animate__animated', 'animate__jackInTheBox')
    document.querySelector(elementId).classList.add('animate__animated', 'animate__bounceInLeft')
    document.querySelector('.toolbar').classList.add('animate__animated', 'animate__heartBeat', 'animate__repeat-3')
    twoAwards = false
}

const countCorrectQuestions = () => {
    const totalRightAnswers = rightAns.length
    if(twoAwards){
        setTimeout(function(){}, 2000);
    }
    if (totalRightAnswers === 1) {
        modalText.innerHTML = `Congrats, you've answered 1 question correctly!<br><img src="./styles/green1.png"width='300px'>`
        giveAward('#green1')
        twoAwards = true
    } else if (totalRightAnswers === 5) {
        setTimeout(function(){modalText.innerHTML = `Congrats, you've answered 5 question correctly!<br><img src="./styles/green5.png"width='300px'>`
        giveAward('#green5'); }, 3000);
        twoAwards = true
    } else if (totalRightAnswers === 25) {
        setTimeout(function(){modalText.innerHTML = `Congrats, you've answered 25 question correctly!<br><img src="./styles/green25.png"width='300px'>`
        giveAward('#green25'); }, 3000);
        twoAwards = true
    }
}

const countWrongQuestions = () => {
    const totalWrongQuestions = wrongAns.length
    if(twoAwards){
        setTimeout(function(){}, 2000);
    }
    if (totalWrongQuestions === 1) {
        modalText.innerHTML = `Congrats! You're an Idiot! You've answered 1 question incorrectly.<br><img src="./styles/red1.png"width='300px'>`
        giveAward('#red1')
        twoAwards = true
    } else if (totalWrongQuestions === 25) {
        modalText.innerHTML = `Congrats! You're an Idiot! You've answered 25 questions incorrectly.<br><img src="./styles/red25.png"width='300px'>`
        giveAward('#red25')
        twoAwards = true
    }
}

const countConsecutiveRight = (isRight) => {
    if (isRight) {
        consecutiveRight += 1
    } else {
        consecutiveRight = 0
    }
    if(twoAwards){
        setTimeout(function(){}, 2000);
    }

    if (consecutiveRight === 5 && document.querySelector('#yellow5').hidden === true) {
        modalText.innerHTML = `Congrats, You've correctly answered 5 consecutive questions!<br><img src="./styles/yellow5.png"width='300px'>`
        giveAward('#yellow5')
        twoAwards = true
    } else if (consecutiveRight === 10 && document.querySelector('#yellow10').hidden === true) {
        modalText.innerHTML = `Congrats, You've correctly answered 10 consecutive questions!<br><img src="./styles/yellow10.png"width='300px'>`
        giveAward('#yellow10')
        twoAwards = true
    } else if (consecutiveRight === 25 && document.querySelector('#yellow25').hidden === true) {
        modalText.innerHTML = `Congrats, You've correctly answered 25 consecutive questions!<br><img src="./styles/yellow25.png"width='300px'>`
        giveAward('#yellow25')
        twoAwards = true
    }
}

const countCreatedQuestions = () => {
    const totalCreatedQuestions = createdQuestionsArray.length
    if(twoAwards){
        setTimeout(function(){}, 2000);
    }
    if (totalCreatedQuestions === 1) {
        modalText.innerHTML = `Wow, You've contributed your 1st question! Thanks!<br><img src="./styles/blue1.png"width='300px'>`
        giveAward('#blue1')
        twoAwards = true
    } else if (totalCreatedQuestions === 10) {
        modalText.innerHTML = `Wow, You've contributed your 10th question! Thanks!<br><img src="./styles/blue10.png"width='300px'>`
        giveAward('#blue10')
        twoAwards = true
    }
}

// open the modal 
modalBtn.addEventListener('click', function(e){
   
    modal.style.display = "block";
   blur();
    
   
})

function blur(){
    item1.style.filter = 'blur(8px)';
    item2.style.filter = 'blur(8px)';
    item3.style.filter = 'blur(8px)';
    item4.style.filter = 'blur(8px)';
    item5.style.filter = 'blur(8px)';
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(e){
    if(e.target.matches('p#modal-text')){
    document.querySelector('.toolbar').classList.remove('animate__animated', 'animate__heartBeat', 'animate__repeat-3')
    modal.style.display = "none";
    modal.style.dispaly = "block";
    unBlur();
    
    }

})

function unBlur(){
    item1.style.filter = 'blur(0px)';
    item2.style.filter = 'blur(0px)';
    item3.style.filter = 'blur(0px)';
    item4.style.filter = 'blur(0px)';
    item5.style.filter = 'blur(0px)';
}


function setTheme(theme){
    item1.style.background = theme[0]
    item2.style.background = theme[1]
    item3.style.background = theme[2]
    item4.style.background = theme[3]
    item5.style.background = theme[4]
}


function updateTheme(level){
    let theme = eSTheme
    switch(level){
        case "ES":
            theme = eSTheme
            break;
        case "MS":
            theme = mSTheme
            break;
        case "HS":
            theme = hSTheme
            break;
        default:
            theme = satTheme
    }
    setTheme(theme)
}

span.onclick = function() {
    document.querySelector('#toolModal').classList.add('animate__animated', 'animate__fadeOutUpBig')
    unBlur();
    setTimeout(function(){document.querySelector('#toolModal').classList.remove('animate__animated', 'animate__fadeOutUpBig'); toolModal.style.display = "none" ; }, 1000);
    //toolModal.style.display = "none";
  }

toolbar.addEventListener('click', function(e){
    toolModal.style.display = "block";
    document.querySelector('#toolModal').classList.add('animate__animated', 'animate__fadeInDownBig')
    blur();
    setTimeout(function(){document.querySelector('#toolModal').classList.remove('animate__animated', 'animate__fadeInDownBig') ; }, 1000);
})
