
let array = ['This is a random questions', 'How many licks in a lollipop?', 'What color is the sky', 'How old is the oldest person?', 'What year was I born?', 'What year are we in?']
const card_text = document.querySelector('.card_text');
card_text.style.setProperty('--animate-duration', '.5s');
card_text.style.setProperty('animation-fill-mode',  'none')
const item5 = document.querySelector('.item5')
const card = document.querySelector('.card')
const text = document.querySelector('h6')
const loggedIn = document.querySelector('.logged-in')
const login = document.querySelector('.login')
const levelBar = document.querySelector('#level')
const difficultyBar = document.querySelector('#difficulty')
let filteredQ = []


//when card is clicked, a new question is pulled
card.addEventListener('click', function(e){
        card_text.classList.add('animate__animated', 'animate__flip');
        pickAQuestion(filteredQ)
});

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
    console.log(filteredQ)
    pickAQuestion(filteredQ)

  }

  //pull a random question from filtered array
  function pickAQuestion(questions){
      displayQuestion(questions[Math.floor(Math.random() * questions.length)])
  }

  //display question on flashcard
  function displayQuestion(question){
      console.log(question)
    text.innerHTML = `<ul><li>${question.related_words[0]}</li>
    <li>${question.related_words[1]}</li>
    <li>${question.related_words[2]}</li>
    </ul>`
  }

loggedIn.hidden = true;
card_text.hidden = true;


//login verified 
document.addEventListener('click', function(e){
    loggedIn.hidden = false;
    login.style.backgroundColor = '#a8dadc'

})

item5.addEventListener('click', function(e){
    start();
})

function start(){
    getAllQuestions('ES', 1);
    card_text.classList.add('animate__animated', 'animate__bounceInLeft');
    card_text.hidden = false;
    getDifficulty('ES');
    getLevels();
    
}

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
      //getDifficulty(level)
  })
}

levelBar.addEventListener('change', function(e){
    getAllQuestions(e.target.value, 1)
    getDifficulty(e.target.value)
})

difficultyBar.addEventListener('change', function(e){
    console.dir(e.target)
    getAllQuestions(e.target.previousElementSibling.value,e.target.value)
})

function getDifficulty(level){
    console.log(level.value)
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
      console.log(uniqValue + " values")
      populateDifficultyBar(uniqValue)
  })
  }

  function populateDifficultyBar(difficulty){
      console.log(difficulty)
      difficultyBar.innerHTML = ""
      for(let num of difficulty){
          let option = document.createElement('option')
          option.value = num
          option.innerText = num
          difficultyBar.append(option)
      }
  }


function populateLevelBar(levels){
    levelBar.innerHTML = ""
    
    let name = "";
    for(let level of levels){
        let option = document.createElement('option')
        option.value = level
        if(level == 'ES'){
            name = 'Elementry School'
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





