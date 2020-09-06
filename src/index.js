console.log("Hello World")

let array = ['This is a random questions', 'How many licks in a lollipop?', 'What color is the sky', 'How old is the oldest person?', 'What year was I born?', 'What year are we in?']
const card_text = document.querySelector('.card_text');
card_text.style.setProperty('--animate-duration', '.5s');
card_text.style.setProperty('animation-fill-mode',  'none')
const item2 = document.querySelector('.item2')
const card = document.querySelector('.card')


card_text.addEventListener('click', function(e){
    if(e.target.matches('img')){
        e.target.nextElementSibling.innerText = array[Math.floor(Math.random() * 8)]
        card_text.classList.add('animate__animated', 'animate__flip');
       
    }    
});

card_text.addEventListener('animationend', function(e) {
    card_text.className = 'card_text'
  });



  fetch('http://localhost:3000/questions/')
  .then(resp => resp.json())
  .then(filterQuestions)

  function filterQuestions(questionsArray){

    let filteredQ = questionsArray.filter(question => question.level === 'ES' && question.difficulty === 1)
    pickAQuestion(filteredQ)

  }





