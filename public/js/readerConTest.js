$(function(){
	var pdfsessionid = window.pdfsession, pdfuser = window.pdfusername;
    var pdfrole = window.pdfuserrole, pdffile = window.pdfurlname;
	var url = "/js/"+pdffile;
    var currPage = 1;
	var totalpage = 0;
	var thePDF = null;
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var ctx = context;
	var socket = io.connect("127.0.0.1:2000");
    var scale = 1.5;

    socket.on('connect', function(){
        socket.emit('addmetopdfsess', {pdfroom: pdfsessionid, pdfusername: pdfuser, pdfuserrole: pdfrole});
    });




	PDFJS.getDocument(url).then(function(pdf) {
	        thePDF = pdf;
	        totalpage = pdf.numPages;
	        pdf.getPage( 1 ).then( handlePages );
	});

function handlePages(page)
{
    var scale = 1.5;
      var viewport = page.getViewport(scale);
    var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
	console.log(currPage);
		    var renderContext = {
		    	canvasContext: context,
		    	viewport: viewport
		    };
		page.render(renderContext);
}
$('#previous').click(function(){
		context.rect(200,200,500,500);
		context.stroke();
		if(currPage <=1){}else{currPage--;}
		thePDF.getPage(currPage).then(handlePages);
		socket.emit('PDFsync', {id: pdfsessionid,page: currPage});
		console.log("Sending: "+ currPage);
});

$('#next').click(function(){
		if(currPage >=totalpage){}else{currPage++;}
		thePDF.getPage(currPage).then(handlePages);	
		socket.emit('PDFsync', {id: pdfsessionid,page: currPage});
		console.log("Sending: "+ currPage);
});

socket.on('PDFpageSync', function(data){
	console.log(data);
	currPage = data.page;
	thePDF.getPage(data.page).then(handlePages);
});

// var doc = $(document),
// 		win = $(window),
// 		ctx = context;
// var drawing;
	
// 	socket.on('PDFpenMoving', function (data) {
		
		
// 		if(data.drawing){
// 			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
// 		}
		
// 		// Saving the current client state
// 		clients[data.id] = data;
// 		clients[data.id].updated = $.now();
// 	});

// 	var prev = {};
// 	console.log(canvas);
// 	canvas.on('mousedown',function(e){
// 		e.preventDefault();
// 		drawing = true;
// 		prev.x = parseInt(e.pageX - offsetX);
// 		prev.y = parseInt(e.pageY - offsetY);
		
// 	});
	
// 	doc.bind('mouseup mouseleave',function(e){
// 		prev.x = parseInt(e.pageX - offsetX);
// 		prev.y = parseInt(e.pageY - offsetY);
// 		drawing = false;
// 	});

// 	var lastEmit = $.now();

// 	doc.on('mousemove',function(e){
// 		if($.now() - lastEmit > 30){
// 			// socket.emit('PDFpenMove',{
// 			// 	'x': e.pageX,
// 			// 	'y': e.pageY,
// 			// 	'drawing': drawing,
// 			// 	'id': id
// 			// });
// 			lastEmit = $.now();
// 		}
		
// 		// Draw a line for the current user's movement, as it is
// 		// not received in the socket.on('moving') event above
		
// 		if(drawing){
			
// 			drawLine(prev.x, prev.y, e.pageX, e.pageY);
			
// 			prev.x = e.pageX;
// 			prev.y = e.pageY;
// 		}
// 	});

// 	// Remove inactive clients after 10 seconds of inactivity
// 	// setInterval(function(){
		
// 	// 	for(ident in clients){
// 	// 		if($.now() - clients[ident].updated > 10000){
				
// 	// 			// Last update was more than 10 seconds ago. 
// 	// 			// This user has probably closed the page
				
// 	// 			cursors[ident].remove();
// 	// 			delete clients[ident];
// 	// 			delete cursors[ident];
// 	// 		}
// 	// 	}
		
// 	// },10000);

// 	function drawLine(fromx, fromy, tox, toy){
// 		ctx.moveTo(fromx, fromy);
// 		ctx.lineTo(tox, toy);
// 		ctx.stroke();
// 	}




        var mouseX;
        var mouseY;
        var lastX;
        var lastY;
        var strokeColor = "red";
        var strokeWidth = 2;

        var isMouseDown = false;


        function handleMouseDown(e) {
            mouseX = parseInt(e.pageX);
            mouseY = parseInt(e.pageY);

            // Put your mousedown stuff here
            lastX = mouseX;
            lastY = mouseY;
            isMouseDown = true;
        }

        function handleMouseUp(e) {
            mouseX = parseInt(e.pageX);
            mouseY = parseInt(e.pageY);

            // Put your mouseup stuff here
            isMouseDown = false;
        }

        function handleMouseOut(e) {
            mouseX = parseInt(e.pageX);
            mouseY = parseInt(e.pageY);

            // Put your mouseOut stuff here
            isMouseDown = false;
        }

        function handleMouseMove(e) {
            mouseX = parseInt(e.pageX);
            mouseY = parseInt(e.pageY);

            // Put your mousemove stuff here
            if (isMouseDown) {
                ctx.beginPath();
                if (mode == "pen") {
                    ctx.globalCompositeOperation = "source-over";
                    ctx.moveTo(lastX, lastY);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                    socket.emit('newPenMove',{
                        'lastX': lastX,
                        'lastY': lastY,
                        'mouseX': mouseX,
                        'mouseY': mouseY,
                        'mode': 'penmode',
                        'id': pdfsessionid
                    });
                    ctx.closePath();
                } else {
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fill();
                    socket.emit('newPenMove', {
                        'lastX': lastX,
                        'lastY': lastY,
                        'mouseX': mouseX,
                        'mouseY': mouseY,
                        'mode': 'erasermode',
                        'id': pdfsessionid
                    });
                    ctx.closePath();
                }
                lastX = mouseX;
                lastY = mouseY;
            }
        }

        socket.on('newPenMoving', function(data){
            if(data.mode == 'penmode'){
                ctx.beginPath();
                ctx.globalCompositeOperation = "source-over";
                ctx.moveTo(data.lastX, data.lastY);
                ctx.lineTo(data.mouseX, data.mouseY);
                ctx.stroke();
                ctx.closePath();
            }
            if(data.mode == 'erasermode'){
                ctx.beginPath();
                ctx.globalCompositeOperation = "destination-out";
                    ctx.arc(data.lastX, data.lastY, 5, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.closePath();
            }
            lastX = mouseX;
            lastY = mouseY;
        });

        $("#canvas").mousedown(function (e) {
            handleMouseDown(e);
        });
        $("#canvas").mousemove(function (e) {
            handleMouseMove(e);
        });
        $("#canvas").mouseup(function (e) {
            handleMouseUp(e);
        });
        $("#canvas").mouseout(function (e) {
            handleMouseOut(e);
        });

        var mode = "pen";
        $("#pen").click(function () {
            mode = "pen";
        });
        $("#eraser").click(function () {
            mode = "eraser";
        });

});