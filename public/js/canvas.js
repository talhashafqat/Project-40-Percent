window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  var canvasx = $(canvas).offset().left;
  var canvasy = $(canvas).offset().top;
  var last_mousex = last_mousey = 0;
  var mousex = mousey = 0;
  var mousedown = false;
  var tooltype = 'draw';
  var strokeColor = document.querySelector("#strokeColor")
  var clearButton = document.querySelector("clearButton")
  var displayImage = document.querySelector("#displayImage")
  var downloadButton = document.querySelector("#download")
  let base64Image;


  downloadButton.addEventListener("click", function(){
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var link = document.createElement('a');
    link.download = 'canvas.jpg';
    link.href = document.getElementById('canvas').toDataURL()
    link.click();
  });


  document.querySelector("#clear_button").addEventListener('click', function() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }, false);

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var color;
  var strokeWidth;

  const sliderValue = document.querySelector("span");
  const inputSlider = document.querySelector("#rangeInput");
  inputSlider.oninput = (() => {
    let value = inputSlider.value;
    sliderValue.textContent = value;
    strokeWidth = value;
    sliderValue.style.left = (value * 4.75) + "%";
    sliderValue.classList.add("show");
  });

  inputSlider.onblur = (() => {
    sliderValue.classList.remove("show");
  });

  strokeColor.addEventListener('input', () => {
    color = strokeColor.value;
  });

  // clearButton.addEventListener('click',() =>{
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  // })

  //Resizing


  //Variables
  $(canvas).on('mousedown', function(e) {
    last_mousex = mousex = parseInt(e.clientX-canvasx);
	last_mousey = mousey = parseInt(e.clientY-canvasy);
    mousedown = true;
});

//Mouseup
$(canvas).on('mouseup', function(e) {
    mousedown = false;
});

//Mousemove
$(canvas).on('mousemove', function(e) {
    mousex = parseInt(e.clientX-canvasx);
    mousey = parseInt(e.clientY-canvasy);
    if(mousedown) {
        ctx.beginPath();
        if(tooltype=='draw') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.lineWidth = strokeWidth;
        } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 20;
        }
        ctx.moveTo(last_mousex,last_mousey);
        ctx.lineTo(mousex,mousey);
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
    }
    last_mousex = mousex;
    last_mousey = mousey;
    //Output
    $('#output').html('current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown);
});

//Use draw|erase
use_tool = function(tool) {
    tooltype = tool; //update
}
});
