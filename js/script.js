window.onload = function(){ 
	var canvas = document.getElementById('myCanvas'),
	ctx    = canvas.getContext("2d"),
	pic    = new Image();

	pic.crossOrigin = "Anonymous";
	document.getElementById('but').addEventListener('click', imageAndQuote);
//	window.addEventListener('resize', resizeCanvas, false);


	function imageAndQuote(){
		pic.src = "https://picsum.photos/400/?random&" + new Date().getTime();
		pic.onload = function () {
			ctx.drawImage(pic, 0, 0);
			writeRandomTextOnCanvas();
		}
	}
	function writeRandomTextOnCanvas(){
		$(document).ready(function () {
			$.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?", function(data) {
				ctx.font = "bold 25px Arial";
				wrapText(data.quoteText, 20, 70, 370);
				ctx.font = "bold 20px Arial";
				wrapText(data.quoteAuthor, 190, 350, 180);
				var c = document.getElementById('myCanvas');
				var d = c.toDataURL("image/png");
				sendImageToServer(d);
			});
		})
	}
	function wrapText(text, marginLeft, marginTop, maxWidth){
		var words = text.split(" ");
		var countWords = words.length;
		var line = "";
		for (var n = 0; n < countWords; n++) {
			var testLine = line + words[n] + " ";
			var testWidth = ctx.measureText(testLine).width;
			if (testWidth > maxWidth) {
				showText(line, marginLeft, marginTop);
				line = words[n] + " ";
				marginTop += 30;
			}
			else {
				line = testLine;
			}
		}
		showText(line, marginLeft, marginTop);
	}
	function showText(text, x, y){
		ctx.fillStyle = "white";
		ctx.strokeStyle = "black";
		ctx.fillText(text, x, y);
		ctx.strokeText(text, x, y);
	}
	function sendImageToServer(dataURL) {
		$.ajax({
			type: "POST",
			url: "../index.php",
			data: { 
				imgBase64: dataURL
			}
		}).complete(function(o) {
			var download = document.getElementById("download");
			download.setAttribute("href", "http://i9990295.beget.tech/" + o.responseText);
		});

	}
};