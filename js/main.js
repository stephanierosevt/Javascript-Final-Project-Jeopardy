(function () {
  let random =Math.floor(Math.random() * 1000); 
  let triviaCategoriesUrl = `http://jservice.io/api/categories?count=6&offset=${random}`
  let triviaUrl= `http://jservice.io/api/clues`
  let jeopardyCategories = [];
  let jeopardyCategoryIds = [];
  let dollars = ["100", "200", "400", "600", "800", "1000"];
  let jeopardyBoard = $(`<table/>`).addClass('jeopardyBoard');

  $( document ).ready(function() {
    jeopardyBoard.append(`<thead><tr></tr></thead><tbody></tbody>`);
    $("#grid").append(jeopardyBoard);


  $.ajax({
    url: `${triviaCategoriesUrl}`,
    data: {
      format: "json"
    },
    success: function (response) {
      jeopardyCategoriesToArray(response);
    }
  });
  })
  
  function jeopardyCategoriesToArray(response) {
    for (let i = 0; i < response.length; i++) {
      jeopardyCategories.push(response[i].title)
      jeopardyCategoryIds.push(response[i].id)
    }
    populateTableHeader(jeopardyCategories);
    populateTableRows(jeopardyCategoryIds);
  }

  function populateTableHeader() {
    for (let i = 0; i < jeopardyCategories.length; i++) {
      let categoryName = jeopardyCategories[i];
      var header = `<th>${categoryName}</th>`;
      $("table thead tr").append(header)
    }
  }

  function populateTableRows(jeopardyCategoryIds){
    for(let i = 0; i < dollars.length; i++) {
        let dollarAmount = dollars[i];
        $("table tbody").append(`<tr id=${i}></tr>`);
        for (let j = 0; j < jeopardyCategoryIds.length; j++) {
          let category = jeopardyCategoryIds[j];
          var cell = `<td><button type="button" alt=${dollarAmount} id=${category} class="questionValue">$${dollarAmount}</button></td>`;
          $(`#${i}`).append(`${cell}`);
      }
    }
  }


  //**********************On Click, retrieve question****************************** */

  $(document).on('click', '.questionValue', function () {
    let id = this.id
    let value = $(this).attr('alt');
    getQuestionFromService(value,id);
  })

  //service did not have a question available for every $$ amount
  function getQuestionFromService(value,id) {
    if (value != null) {
      endpoint = `${triviaUrl}?category=${id}&value=${value}`
    } else {
      endpoint = `${triviaUrl}?category=${id}`
    }
    $.ajax({
      url: endpoint,
      success: function (response) {
        if (undefined === response[0]){
          getQuestionFromService(null,id)
        } else{
          console.log(response)
        populateQuestionText(response[0].question, response[0].answer, response[0].category.title)
        }
      },
      error: function () {
        updateUIError()
      }
    })
  }

  function populateQuestionText(question, answer, category) {
    $('h1').css('visibility', 'collapse');
    $('#grid').css('visibility', 'collapse');
    $("#question").append(`<h2 id="categoryText">Category: ${category}</h2>`);
    $("#question").append(`<h2 id="questionText">${question}</h2>`);

    var revealAnswerButton = `<button type="button" class="cardButton" id="revealAnswer">Reveal Answer</button>`;
    var showGridButton = `<button type="button" class="cardButton" id="showGrid">Return to Board</button>`;
    
    $("#question").append(`<div id=buttons>${revealAnswerButton} ${showGridButton}</div>`);
    $("#question").append(`<div><h3 id="answerText">Answer:  ${answer}</span></h3></div>`);
    $("#answerText").css('visibility', 'hidden');

  }
 
  $(document).on('click','#revealAnswer',function(){
    $("#answerText").css('visibility', 'visible');
  }); 

  $(document).on('click','#showGrid',function(){
    $('h1').css('visibility', 'visible');
    $('#grid').css('visibility', 'visible');
    $("#question").html('');
  }); 


  function updateUIError() {
    alert('There was an error getting trivia data :(')
  }


})()