/*

Ziwen Wang 101071063
Zeye Gu 101036562

Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON dat
*/

//Use javascript array of objects to represent lyrics and their locations
let lyrics = []
let lyricsText = []
var movingString = {word: "Moving",
                    x: 100,
					y:100,
					xDirection: 1, //+1 for leftwards, -1 for rightwards
					yDirection: 1, //+1 for downwards, -1 for upwards
					stringWidth: 50, //will be updated when drawn
					stringHeight: 24}; //assumed height based on drawing point size


let wordBeingMoved

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using lenght of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now
  for (let i = 0; i < lyrics.length; i++) {
    if (aCanvasX - lyrics[i].x < 8 * lyrics[i].word.length && aCanvasX - lyrics[i].x > 0 &&
      aCanvasY - lyrics[i].y > -15 && aCanvasY - lyrics[i].y < 0)
      return lyrics[i]
  }
  return null
}

//draw the lyrics
function drawCanvas() {

  let context = document.getElementById('canvas1').getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '12pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < lyrics.length; i++) {
    let data = lyrics[i]
	if(data.word[0] === "["){
		context.strokeStyle = 'green'
		let chordWord = data.word.substring(1,data.word.length-1)
		context.fillText(chordWord, data.x, data.y);
		context.strokeText(chordWord, data.x, data.y)
	
		context.strokeStyle = 'blue'
	}else{
		context.fillText(data.word, data.x, data.y);
    context.strokeText(data.word, data.x, data.y)
	
	}
  }

  context.stroke()
}
function updateText(){
	let textDiv = document.getElementById("text-area")
	lowtext = ""
	for(let i = 0; i < lyricsText.length;i++){
		lowtext += "<br>"
		for(let j = 0; j < lyricsText[i].length;j++){
		  lowtext += lyricsText[i][j].word
		  lowtext += " "
		}
	}
	textDiv.innerHTML = `<p> ${lowtext}</p>`
	return lowtext
}
function reStructure(){
	for (let i = 0; i < lyrics.length; i++) {
		let data = lyrics[i]
		data.y = Math.floor((data.y + 10)/20)*20 + 1
	}
	lyricsText = []
	//lyricsText.append()
	
	for(let ym = 0; ym < 50; ym++){
		lyricsText.push([])
		for (let i = 0; i < lyrics.length; i++) {
			let data = lyrics[i]
			if(ym == Math.floor((data.y-10)/40))
				lyricsText[ym].push(data)
		}
		lyricsText[0].sort(function(a, b){return b.x-a.x})
	}

	updateText()
	
	/*
	for (let i = 1; i < 500; i = i + 20) {
		console.log(i)
		let obj = null
		let currX = 10
		obj = findMinX(i)
		while(obj != null){
			console.log(obj)
			obj.x = currX
			currX = currX + obj.word.length * 10 + 10
			obj.y = i - 1
			obj = findMinX(i, obj)
		}
		
		
	}
	*/
	drawCanvas()
}

function findMinX(y){
	let obj = {isNull:true, x:100000}
	for (let i = 0; i < lyrics.length; i++) {
		let data = lyrics[i]
		if(data.y == y && data.x < obj.x){
			obj = data
		}
	}
	console.log(obj)
	if(obj.isNull)
		obj = null
	return obj
}

function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.pageY - rect.top
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    //document.addEventListener("mousemove", handleMouseMove, true)
    //document.addEventListener("mouseup", handleMouseUp, true)
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event // TODO:  stop any default
  // browser behaviour

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

function handleMouseMove(e) {

  console.log("mouse move")

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {
  console.log("mouse up")

  e.stopPropagation()

  //$("#canvas1").off(); //remove all event handlers from canvas
  //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas

}



//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  console.log("keydown code = " + e.which)

  let dXY = 5 //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY //down arrow

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)


    $.post("positionData", jsonString, function(data, status) {
      console.log("data: " + data)
      console.log("typeof: " + typeof data)
      let wayPoint = JSON.parse(data)
      wayPoints.push(wayPoint)
      for (let i in wayPoints) console.log(wayPoints[i])
    })
  }

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    $('#userTextField').val('') //clear the user text field
  }

  e.stopPropagation()
  e.preventDefault()
}


function handleSaveButton() {


  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ' '
  var lowtext = ""
  let userText = $('#userTextField').val(); //get text from user text input field
  if (userText && userText != '') {
    //user text was not empty
	console.log(lyrics)
    let userRequestObj = {
      text: userText,
	  wordArray: lyrics,
	  wordText: lyricsText
    } //make object to send to server
    let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
    $('#userTextField').val('') //clear the user text field

    //Prepare a POST message for the server and a call back function
    //to catch the server repsonse.
    //alert ("You typed: " + userText)
    $.post("saveUserText", userRequestJSON, function(data, status) {})
  }
}
function handleSubmitButton() {


  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ' '
  var lowtext = ""
  let userText = $('#userTextField').val(); //get text from user text input field
  if (userText && userText != '') {
    //user text was not empty
    let userRequestObj = {
      text: userText,
	  wordArray: lyrics
    } //make object to send to server
    let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
    $('#userTextField').val('') //clear the user text field

    //Prepare a POST message for the server and a call back function
    //to catch the server repsonse.
    //alert ("You typed: " + userText)
    $.post("userText", userRequestJSON, function(data, status) {
      console.log("data: " + data)
      console.log("typeof: " + typeof data)
      let responseObj = JSON.parse(data)
      movingString.word = responseObj.text
      //replace word array with new lyrics if there are any
      if (responseObj.wordArray){
        lyrics=[];
        lyrics = responseObj.wordArray
		if(responseObj.wordText){
			lyricsText = responseObj.wordText
			lowtext = updateText()
		}else{
			for(let i = 0; i < lyrics.length;i++){
			  if(lyrics[i].x === 10){
				lowtext += "<br>"
			  }
			  lowtext += lyrics[i].word
			  lowtext += " "
			}
		}

        console.log(lowtext);
        textDiv.innerHTML = `<p> ${lowtext}</p>`

      }


	drawCanvas()
	//lyrics = []
    })
  }
  lyrics = [] // clean the lyrics if submit nothing
	drawCanvas()
}
var chord = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "foo"]
function handleUpButton() {
	for (let i = 0; i < lyrics.length; i++) {
		if(lyrics[i].word[0] === "["){
			lyrics[i].word = lyrics[i].word.replace("b", "#")
			for (let j = 0; j < chord.length; j++) {
				if (lyrics[i].word.indexOf(chord[j]) == 1 && lyrics[i].word.indexOf(chord[j+1]) != 1){
					lyrics[i].word = "[" + chord[(j+1)%12] + lyrics[i].word.substring(chord[j].length + 1,lyrics[i].word.length)
					break
				}
			}
		}
	}
	drawCanvas()
}
function handleDownButton() {
	for (let i = 0; i < lyrics.length; i++) {
		if(lyrics[i].word[0] === "["){
			lyrics[i].word = lyrics[i].word.replace("b", "#")
			for (let j = 0; j < chord.length; j++) {
				if (lyrics[i].word.indexOf(chord[j]) == 1 && lyrics[i].word.indexOf(chord[j+1]) != 1){
					lyrics[i].word = "[" + chord[(j+12-1)%12] + lyrics[i].word.substring(chord[j].length + 1,lyrics[i].word.length)
					break
				}
			}
		}
	}
	drawCanvas()}


$(document).ready(function() {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  $(document).keydown(handleKeyDown)
  $(document).keyup(handleKeyUp)

  //timer = setInterval(handleTimer, 100)
  //clearTimeout(timer) //to stop

  drawCanvas()
})
