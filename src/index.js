
let array = ['This is a random questions', 'How many licks in a lollipop?', 'What color is the sky', 'How old is the oldest person?', 'What year was I born?', 'What year are we in?']
const card_text = document.querySelector('.card_text');
card_text.style.setProperty('--animate-duration', '.5s');
card_text.style.setProperty('animation-fill-mode',  'none')
const item2 = document.querySelector('.item2')
const card = document.querySelector('.card')
const text = document.querySelector('h6')
const loggedIn = document.querySelector('.logged-in')
const login = document.querySelector('.login')
let filteredQ = []



card.addEventListener('click', function(e){

        card_text.classList.add('animate__animated', 'animate__flip');
        pickAQuestion(filteredQ)
});

card_text.addEventListener('animationend', function(e) {
    card_text.className = 'card_text'
  });



  fetch('http://localhost:3000/questions/')
  .then(resp => resp.json())
  .then(filterQuestions)

  function filterQuestions(questionsArray){
    filteredQ = []
    filteredQ = questionsArray.filter(question => question.level === 'ES' && question.difficulty === 1)
    pickAQuestion(filteredQ)

  }

  function pickAQuestion(questions){
      displayQuestion(questions[Math.floor(Math.random() * questions.length)])
  }

  function displayQuestion(question){
    text.innerHTML = `<ul><li>${question.related_words[0]}</li>
    <li>${question.related_words[1]}</li>
    <li>${question.related_words[2]}</li>
    </ul>`
  }

loggedIn.hidden = true;
card_text.hidden = true;

document.addEventListener('click', function(e){
    loggedIn.hidden = false;
    login.style.backgroundColor = '#a8dadc'

})

item2.addEventListener('click', function(e){
    start();
})

function start(){
    card_text.classList.add('animate__animated', 'animate__bounceInLeft');
        pickAQuestion(filteredQ)
        card_text.hidden = false;
}





