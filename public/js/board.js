$(function(){
    canvas= new fabric.Canvas('canvas');
    canvas.selection = false;
	feature = new Features(canvas);
	renderCanvasObjects = new RenderCanvasObjects(canvas);
	window.renderit = true;
	config = {
		session: window.roomsession,
		uniqueuser: window.uniqueuser,
		role: window.userrole,
		resizeCanvas: function(){
			cw = $('.canvascontainer').width();
			ch = $('.canvascontainer').height();
		    canvas.setHeight(ch);
		    canvas.setWidth(cw);
		},
		context: document.getElementById('canvas').getContext('2d'),
		conn: new Connection(this.session, this.relation, canvas, "127.0.0.1:2000")
	}
window.resource = {
			color: "#000000",
			thickness: 6
		}


config.resizeCanvas();
window.addEventListener('resize', config.resizeCanvas, false);
console.log("Relation: " + config.role + " And Session: "+config.session+" username: "+config.uniqueuser);

config.conn.socket.on('connect', function(){
	$('.connectionstatus').html("Connected").css({'color': '#005502','min-height': '40px'})
	config.conn.socket.emit('addmetosess', {roomsess: window.roomsession, username: window.uniqueuser, role: window.userrole});
});
config.conn.socket.on('disconnect', function(){
	$('.connectionstatus').html("Disconnected<span>Trying to reconnect...</span>").css({
		'color': '#FF0000',
		'min-height': '50px'
	});
});

 if(config.role == "teacher"){
 	setInterval(function(){ 
 		updateCanvasObjects(); 
 	}, 8000);
 }

function updateCanvasObjects(){
	console.log('emitting');
	totaluuid = [];
	for(var i=0; i<canvas.getObjects().length;i++){
		totaluuid.push(canvas.getObjects()[i].get("uuid"));
	}
	config.conn.socket.emit('updateCanvasObject', {id: config.session, data: totaluuid});
}
config.conn.socket.on('updateconnlist', function(data){
	$('.cub-ullist').html('');
	for(var i=0; i<data.length;i++){
		$('.cub-ullist').append('<li class="cub-uli">'+data[i]+'<span class="whichuserwriting">(writing...)</span></li>');
	}
});

config.conn.socket.on('updatingCanvasObject', function(data){
	if(config.role != 'teacher'){
		console.log('gettin emit');
		stuuid = [];
		for(var i=0; i<canvas.getObjects().length;i++){
			stuuid.push(canvas.getObjects()[i].get("uuid"));
		}
		var array1 = data;
		var array2 = stuuid;
		var index;
		for (var i=0; i<array2.length; i++) {
		    index = array1.indexOf(array2[i]);
		    if (index > -1) {
		        array1.splice(index, 1);
		    }
		}
		config.conn.socket.emit('replyToCanvasObject', {id: config.session, data: array1, username: config.uniqueuser});
	}
});

config.conn.socket.on('replyingToCanvasObject', function(data){
	var updatetheseobjects = [];
	console.log('emitting with reply');
	for(var i=0; i<data.data.length;i++){
		for(var j=0; j<canvas.getObjects().length;j++){
			beta = canvas.getObjects()[j].get("uuid");
			if(beta == data.data[i]){
				var tempgetob = canvas.getObjects()[j].toJSON(['uuid']);
				tempgetob.uuid = canvas.getObjects()[j].get("uuid");
				console.log(tempgetob.uuid);
				updatetheseobjects.push(tempgetob);
			}
		}
	}
	config.conn.socket.emit('affectCanvasObjects', {data: updatetheseobjects, id: data.id, username: data.username});
});

config.conn.socket.on('affectingCanvasObjects', function(data){
	console.log(data);
	for(i=0;i<data.data.length;i++){
		console.log("why? circle");
		if( data.data[i].type == "circle"){
			window.renderit = false;
			renderCanvasObjects.addnewcircle({targetid: data.data[i].uuid, type: data.data[i].type,data: data.data[i]});
		}
		if(data.data[i].type == "rect"){
			window.renderit = false;
			renderCanvasObjects.addnewrect({targetid: data.data[i].uuid, type: data.data[i].type,data: data.data[i]});
		}
		if(data.data[i].type == "triangle"){
			window.renderit = false;
			renderCanvasObjects.addnewtriangle({targetid: data.data[i].uuid, type: data.data[i].type,data: data.data[i]});
		}
		if(data.data[i].type == "ellipse"){
			window.renderit = false;
			renderCanvasObjects.addnewellipse({targetid: data.data[i].uuid, type: data.data[i].type,data: data.data[i]});
		}
		if(data.data[i].type == "path"){
			window.renderit = false;
			renderCanvasObjects.addnewpath({targetid: data.data[i].uuid, type: data.data[i].type,data: data.data[i]});
		}
		if(data.data[i].type == "text"){
			window.renderit = false;
			renderCanvasObjects.addnewtext({targetid: data.data[i].uuid, type: data.data[i].type,data: data.data[i]});
		}
	}
});

config.conn.socket.on('clearingthecanvas', function(){
			renderit = true;
			canvas.clear();
			canvas.renderAll();
	    	canvas.calcOffset();
});
/* CANVAS CONFIG */

/*________________________________________________________________________________________________________________________ */

/*Object Sending*/


		canvas.on('object:modified', function(e){
			feature.onModify(e,ajaxify);
		});
		canvas.on('object:added', function(e) {
			feature.onAdd(e, ajaxify);
		});
		canvas.on('object:removed', function(e) {
			feature.onRemove(e,ajaxify);
		});
		canvas.on('path:created', function(e) {
			//console.log("path");
			feature.onPath(e,ajaxify);
		});


function ajaxify(dataless,conn){
	config.conn.socket.emit('mousemove',dataless);	
}


config.conn.socket.on('moving', function (data) {
	if(data.action != 'remove'){
		var tp = data.data.type;
		//var tp = data.type
		var dt = data.data;	
	}
	
	window.renderit = false;
	this.addnewcircle = function(){
		canvas.add(new fabric.Circle(dt));
		// if(autodata){
		// 	console.log("What wowowowow");
		// }
		// var newcirc = {};
		// 	for(var key in dt){
		// 		newcirc[key] = dt[key];
		// 	}
		// 	newcirc.uuid = data.targetid;
		// 	canvas.add(new fabric.Circle(newcirc));
		// // if( tp == "path"){
		// // 	canvas.add(new fabric.Path(dt));
		// // }
	}
	this.addnewrect = function(){
		canvas.add(new fabric.Rect(dt));
		// var newcirc = {};
		// 	for(var key in dt){
		// 		newcirc[key] = dt[key];
		// 	}
		// 	newcirc.uuid = data.targetid;
		// 	canvas.add(new fabric.Rect(newcirc));
	}
	this.addnewtriangle = function(){
		canvas.add(new fabric.Triangle(dt));
		// var newcirc = {};
		// 	for(var key in dt){
		// 		newcirc[key] = dt[key];
		// 	}
		// 	newcirc.uuid = data.targetid;
		// 	canvas.add(new fabric.Triangle(newcirc));
	}
	this.addnewellipse = function(){
		canvas.add(new fabric.Ellipse(dt));
		// var newcirc = {};
		// 	for(var key in dt){
		// 		newcirc[key] = dt[key];
		// 	}
		// 	newcirc.uuid = data.targetid;
		// 	canvas.add(new fabric.Ellipse(newcirc));
	}
	this.addnewpath = function(){
		canvas.add(new fabric.Path(dt.path, dt));
		// var newcirc = {};
		// console.log(dt);
		// dt.uuid = data.targetid;
		// canvas.add(new fabric.Path(dt.path, dt));
		canvas.renderAll();
	}
	this.addnewtext = function(){
			canvas.add(new fabric.Text(dt.text,dt));


	}
	this.addnewgroup = function(){
		console.log(dt);
		dtobj = dt.objects;
		dt.objects = '';
		canvas.add(new fabric.Group(dtobj,dt));
	}

	this.addobjectoncanv = function(){
		if( tp == "circle"){
			this.addnewcircle();
		}
		if(tp == "rect"){
			this.addnewrect();
		}
		if(tp == "triangle"){
			this.addnewtriangle();
		}
		if(tp == "ellipse"){
			this.addnewellipse();
		}
		if(tp == "path"){
			this.addnewpath();
		}
		if(tp == "text"){
			this.addnewtext();
		}
		if(tp == "group"){
			canvas.loadFromDatalessJSON(dt,function(){
				canvas.renderAll();
			});

		}
	}
	this.addgrouponcanv = function(groupobject,groupdataid){
		console.log("entered");
		
		this.addobjectoncanv();
	}
	
	if(data.action == "add"){

		this.addobjectoncanv();
	}
	if(data.action == "modify"){

					console.log("modified.............");
		if(tp == "group"){
			this.addobjectoncanv();
		}else{
			for(var i=0; i<canvas.getObjects().length;i++){
				beta = canvas.getObjects()[i].get("uuid");
				if(beta == dt.uuid){
					canvas.remove(canvas.getObjects()[i]);
					this.addobjectoncanv();
				}
			}	
		}
	}
	if(data.action == "remove"){
		for(var i=0; i<canvas.getObjects().length;i++){
			beta = canvas.getObjects()[i].get("uuid");
			if(beta == data.targetid){
				canvas.remove(canvas.getObjects()[i]);
			}
		}
	}
	if(data.action == "purecanvas"){
		console.log("Got it!");
		var json = data.data;
canvas.clear();
canvas.loadFromJSON(json);

			for(var i=0; i<canvas.getObjects().length;i++){
				beta = canvas.getObjects()[i].uuid;
				console.log(beta);
			}

	}
	
//console.log(data.action+" to dom: "+ data.type+" Content: "+JSON.stringify(dt));
});



/*Object Sending*/

/* CANVAS FUNCTIONS */


	$("#iconpencil").click(function(event) {
		feature.iconpencil();
	});
	$("#iconstore").click(function(){
		feature.iconstore();
		config.conn.socket.emit('clearthecanvas',{id: config.session, username: config.uniqueuser});
	});

	/* pencil color choose */
	// $('.choosepencilcolor').click(function(event) {
	// 		window.resource.color = $(this).data("pencilcolor");
	// 		feature.choosepencilcolor($(this));
	// });
	$('.color').change(function(e){
		window.resource.color = this.value;
		canvas.freeDrawingBrush.color = "#"+window.resource.color;
		console.log(window.resource.color);
	})

	// $('.choosepencilthickness').click(function(event) {
	// 	window.resource.thickness = $(this).children("span").data("pencilthickness");
	// 	feature.choosepencilthickness($(this));
	// });

	$('.thickborder').click(function(){
		window.resource.thickness = $(this).data("winthickness");
		canvas.freeDrawingBrush.width = window.resource.thickness;
		console.log(window.resource.thickness);
	});

	/* pencil color choose */

	/* text input */
	$(".outtext").click(function(){
		feature.outtext();
	});
	/* text input */

	/* Delete Feature */
	$("#icondelete").click(function(){
		feature.icondelete();
	});
	$(window).keypress(function(event) {
		feature.deletekeypress(event);
	});
	/* Delete Feature */

	/*Undo Feature */
	$("#iconundo").click(function(event) {
		feature.iconundo();
	});
	/*Undo Feature */

	/* cursor Feature */
	$("#iconcursor").click(function(){
		feature.iconcursor();
	});
	/* cursor Feature */

	/* Line Feature */
	$("#iconline").click(function(){
		feature.iconline();

	});
	/* Line Feature */

	/* Shapes Feature */

	$("#iconshaperectangle").click(function(){
		feature.iconshaperectangle();
	});
	$("#iconshapecircle").click(function(){
		feature.iconshapecircle();
	});
	$("#iconshapetriangle").click(function(){
		feature.iconshapetriangle();
	});
	$("#iconshapeellipse").click(function(){
		feature.iconshapeellipse();
	});
	/* Shapes Feature */

	/*Save As Image*/

	$("#image_out").click(function(){
		feature.image_out();
	});

	$("#store_out").click(function(){
		feature.store_out();
	});
	$("#store_load").click(function(){
		feature.store_load();
	});



function OpenInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}
$(".uploadpdf").click(function(){
	var pdfurl = "http://127.0.0.1:2000/reader/"+config.session+"/"+config.uniqueuser+"/"+config.role+"/hello.pdf";
	var data = {
		pdfurl: pdfurl,
		id: config.session
	};
 	OpenInNewTab(pdfurl);
 	config.conn.socket.emit('pdfwindow',data);	
});

config.conn.socket.on('openwindow', function (filedata) {
	OpenInNewTab(filedata.pdfurl);
});















$('html, body').css({
	'width': '100%',
    'height': '100%'
});


 });




window.siez = function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes/1024;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


