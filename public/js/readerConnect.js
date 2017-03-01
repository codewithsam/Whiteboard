$(function(){
	var id = window.hbsid, name = window.hbsname;
	var currPage = 1;
	var totalpage = 0;
	var thePDF = null;
	var canvas = $('#canvas');
	var context = canvas[0].getContext('2d');
	var socket = io.connect("127.0.0.1:2000");
	PDFJS.getDocument('/js/hello.pdf').then(function(pdf) {
	        thePDF = pdf;
	        totalpage = pdf.numPages;
	        pdf.getPage( 1 ).then( handlePages );
	});



function handlePages(page)
{
	console.log(currPage);
    var viewport = page.getViewport( 1.5 );
		    canvas.height = viewport.height;
		    canvas.width = viewport.width;
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
		socket.emit('PDFsync', currPage);
		console.log("Sending: "+ currPage);
});

$('#next').click(function(){
		if(currPage >=totalpage){}else{currPage++;}
		thePDF.getPage(currPage).then(handlePages);	
		socket.emit('PDFsync', currPage);
		console.log("Sending: "+ currPage);
});

socket.on('PDFpageSync', function(data){
	console.log(data);
	currPage = data;
	thePDF.getPage(data).then(handlePages);
});

var doc = $(document),
		win = $(window),
		ctx = context;
	
	// Generate an unique ID
	var id = Math.round($.now()*Math.random());
	
	// A flag for drawing activity
	var drawing = false;
	var eraserMode = false;
	var penMode = true;

	var clients = {};
	var cursors = {};
$('#pen').click(function(){
	eraserMode = false;
	penMode =true;
});
$('#eraser').click(function(){
	penMode =false;
	eraserMode = true;
});
	
	socket.on('PDFpenMoving', function (data) {
		
		if(! (data.id in clients)){
			// a new user has come online. create a cursor for them
			cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
		}
		
		// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
		
		// Is the user drawing?
		if(data.drawing && clients[data.id]){
			
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer
			if(data.mode == 'penMode'){
				drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
			}
			else if(data.mode == 'eraseMode'){
				eraseLine(data.x,data.y);
			}
			else{
				console.log("Nothing to do");
			}
			
		}
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});

	var prev = {};
	console.log(canvas);
	canvas.on('mousedown',function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
		
	});
	
	doc.bind('mouseup mouseleave',function(){
		drawing = false;
	});

	var lastEmit = $.now();

	doc.on('mousemove',function(e){
		if($.now() - lastEmit > 30){
			if(penMode){
				socket.emit('PDFpenMove',{
					'x': e.pageX,
					'y': e.pageY,
					'drawing': drawing,
					'mode': 'penMode',
					'id': id
				});
			}
			if(eraserMode){
				socket.emit('PDFpenMove',{
					'x': e.pageX,
					'y': e.pageY,
					'drawing': eraser,
					'mode': 'eraseMode',
					'id': id
				});
			}
			
			lastEmit = $.now();
		}
		
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){
			if(penMode){
				drawLine(prev.x, prev.y, e.pageX, e.pageY);
			}
			else if(eraserMode){
				eraseLine(prev.x, prev.y);
			}
			prev.x = e.pageX;
			prev.y = e.pageY;
			
		}
	});

	// Remove inactive clients after 10 seconds of inactivity
	setInterval(function(){
		
		for(ident in clients){
			if($.now() - clients[ident].updated > 10000){
				
				// Last update was more than 10 seconds ago. 
				// This user has probably closed the page
				
				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}
		
	},10000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.globalCompositeOperation = "source-over";
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	function eraseLine(fromx,fromy){
		ctx.globalCompositeOperation = "destination-out";
        ctx.arc(fromx, fromy, 5, 0, Math.PI * 2, false);
        ctx.fill();
	}
});