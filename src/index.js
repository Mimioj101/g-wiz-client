
// let array = ['This is a random questions', 'How many licks in a lollipop?', 'What color is the sky', 'How old is the oldest person?', 'What year was I born?', 'What year are we in?']
const card_text = document.querySelector('.card_text');
card_text.style.setProperty('--animate-duration', '.5s');
card_text.style.setProperty('animation-fill-mode',  'none')
const card = document.querySelector('.card')
const text = document.querySelector('h6')
const loggedIn = document.querySelector('.logged-in')
const login = document.querySelector('.login')
const levelBar = document.querySelector('#level')
const difficultyBar = document.querySelector('#difficulty')
const logo = document.querySelector('.logo')
const item3 = document.querySelector('.item3')
const option1 = document.querySelector('#option_1')
const option2 = document.querySelector('#option_2')
const nextBtn = document.querySelector('#next_question')
const loginForm = document.querySelector('.name-form')
const numRight = document.querySelector('#num-right')
const numWrong = document.querySelector('#num-wrong')
const opField1 = document.querySelector('#op1')
const opField2 = document.querySelector('#op2')
const rightAnsLabel1 = document.querySelector('#ans-opt-1')
const rightAnsLabel2 = document.querySelector('#ans-opt-2')
const questionForm = document.querySelector('#question-form')
const body = document.querySelector('.login')
let filteredQ = []
let rightAns = []
let wrongAns = []


//when card is clicked, a new question is pulled
nextBtn.addEventListener('click', function(e){
        card_text.classList.add('animate__animated', 'animate__flip');
        pickAQuestion(filteredQ)
        option1.style.background = 'white'
        option2.style.background = 'white'
        option1.disabled = false;
        option2.disabled = false;
        // const bod = document.querySelector(body)
        // bod.dataset.userId
});


//right & wrong option buttons
    card_text.addEventListener('click', function(e){
      if (e.target.matches("#option_1")){
        option1.disabled = true;
        option2.disabled = true;
            if(e.target.dataset.btn === e.target.dataset.correct){
                rightAns.push(option1.dataset.q_id)
                option1.style.background = '#57886C'
                numRight.innerText = rightAns.length
            } else {
                wrongAns.push(option1.dataset.q_id)
                option1.style.background = '#E63946'
                numWrong.innerText = wrongAns.length
            }
    } else if (e.target.matches("#option_2") ){
        option1.disabled = true;
        option2.disabled = true;
            if(e.target.dataset.btn === e.target.dataset.correct){
                rightAns.push(option2.dataset.q_id)
                option2.style.background = '#57886C'
                numRight.innerText = rightAns.length
            } else {
                wrongAns.push(option2.dataset.q_id)
                option2.style.background = '#E63946'
                numWrong.innerText = wrongAns.length
            }   
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
    text.innerHTML = `<ul><li>${question.related_words[0]}</li>
    <li>${question.related_words[1]}</li>
    <li>${question.related_words[2]}</li>
    </ul>`
    option1.innerText = question.option_1
    option1.dataset.correct = question.correct_answer
    option1.dataset.q_id = question.id
    option2.innerText = question.option_2
    option2.dataset.correct = question.correct_answer
    option2.dataset.q_id = question.id
  }

loggedIn.hidden = true;
//card_text.hidden = true;



//login verified 
loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    loggedIn.hidden = false;
    login.style.backgroundColor = '#a8dadc';
    //login.children[0].remove();
    logo.hidden = true
    loginForm.hidden = true
    const currentUser = e.target.firstElementChild.value
    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json', 'accept': 'application/json'},
        body: JSON.stringify({name: currentUser})
    }
    fetch("http://localhost:3000/users/", options)
    .then(resp => resp.json())
    .then(user => storeUser(user))
    start();
})

const storeUser = (user) => {
 body.dataset.userId = user.id
}




//load game 
function start(){
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

// when user selects an option from level, sends option value and 1 (for difficulty) to getAllQuestions()
//also sends the option value to getDifficulty() to grab a list of all the difficulty numbers
levelBar.addEventListener('change', function(e){
    card.click();
    getAllQuestions(e.target.value, 1)
    getDifficulty(e.target.value)
})

//when user clicks on difficulty bar the value from both dropsdowns are sent to getAllQuestions()
difficultyBar.addEventListener('change', function(e){
    console.dir(e.target)
    card.click();
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



opField1.addEventListener('input', function(e){
    rightAnsLabel1.textContent = e.target.value
})

opField2.addEventListener('input', function(e){
    rightAnsLabel2.textContent = e.target.value
})

questionForm.addEventListener('submit', function(e){
    e.preventDefault();
    const button = e.target
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

    relatedWordsArr.push(rw1.value, rw2.value, rw3.value)

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
    .then(console.log)

    // const config = {
    //     method: "POST",
    //     headers: {
    //         "content-type": "application/json",
    //         "accept": "application/json"},
    //     body: JSON.stringify({
    //         user_id: XX,
    //         question_id: XX})
    // }

    // fetch("http://localhost:3000/user_questions", config)
    // .then(resp => resp.json())
    // .then(console.log)

})
