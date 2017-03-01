$(function(){
    var canvas= new fabric.Canvas('canvas');
	var feature = new Features(canvas);
	config = {
		freeDrawingBrush: null,
		session: guid(),
		relation: "teacher",
		resizeCanvas: function(){
			cw = $('.canvascontainer').width();
			ch = $('.canvascontainer').height();
		    canvas.setHeight(ch);
		    canvas.setWidth(cw);
		},
		context: document.getElementById('canvas').getContext('2d'),
		conn: new Connection(this.session, this.relation, canvas, "127.0.0.1:2000")
	}
	config.resizeCanvas();
	window.addEventListener('resize', config.resizeCanvas, false);
	console.log("Relation: " + config.relation + " And Session "+config.session);
	canvas.on('object:modified', function(e) {
		if(renderit){
			if (e.target) {
			    console.log('an object was Modified! ', e.target.type);
			    console.log(e.target.uuid);
			    var js = JSON.stringify(canvas.toDatalessJSON());
			    var dataless = {
			    	action: "modify",
			    	targetid: e.target.uuid,
			    	type: e.target.type,
			    	data: e.target,
			    	id: config.session
			    };
			    ajaxify(dataless,config.conn);
			}		
		}
	  
	});
	canvas.on('object:added', function(e) {
		if(renderit){
			if (e.target) {
			    var js = JSON.stringify(canvas.toJSON());
			    console.log(e.target.type);
			    console.log('an object was Added! ', Object.keys(e.target));
			    console.log("adding: "+e.target.uuid);
			    var dataless = {
			    	action: "add",
			    	targetid: e.target.uuid,
			    	type: e.target.type,
			    	data: e.target,
			    	id: config.session
			    };
			    ajaxify(dataless,config.conn);
			    console.log("SIZE SENT: "+window.siez(js)+" KB");

			}
		}
	});
	canvas.on('object:removed', function(e) {
		if(renderit){
			if (e.target) {
			    console.log('an object was Removed! ', e.target);
			    var js = JSON.stringify(canvas.toDatalessJSON());
			    var dataless = {
			    	action: "remove",
			    	targetid: e.target.uuid,
			    	id: config.session
			    };
			    ajaxify(dataless,config.conn);
			    console.log("SIZE SENT: "+window.siez(js)+" KB");
			}
		}
	});
	function ajaxify(dataless,conn){
		config.conn.socket.emit('mousemove',dataless);	
	}
	config.conn.socket.on('moving', function (data) {
		var tp = data.type
		var dt = data.data;
		window.renderit = false;
		this.addnewcircle = function(){
			var newcirc = {};
				for(var key in dt){
					newcirc[key] = dt[key];
				}
				newcirc.uuid = data.targetid;
				canvas.add(new fabric.Circle(newcirc));
		}
		this.addnewrect = function(){
			var newcirc = {};
				for(var key in dt){
					newcirc[key] = dt[key];
				}
				newcirc.uuid = data.targetid;
				canvas.add(new fabric.Rect(newcirc));
		}
		this.addnewtriangle = function(){
			var newcirc = {};
				for(var key in dt){
					newcirc[key] = dt[key];
				}
				newcirc.uuid = data.targetid;
				canvas.add(new fabric.Triangle(newcirc));
		}
		this.addnewellipse = function(){
			var newcirc = {};
				for(var key in dt){
					newcirc[key] = dt[key];
				}
				newcirc.uuid = data.targetid;
				canvas.add(new fabric.Ellipse(newcirc));
		}
		this.addnewpath = function(){
			var newcirc = {};
				for(var key in dt){
					newcirc[key] = dt[key];
				}
				newcirc.uuid = data.targetid;
				canvas.add(new fabric.Path(newcirc));
		}
		this.addnewtext = function(){
			var newcirc = {};
				for(var key in dt){
					newcirc[key] = dt[key];
				}
				newcirc.uuid = data.targetid;
				var txtval = newcirc["text"];
				canvas.add(new fabric.Text(txtval,dt));
				console.log(newcirc.uuid);
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
		}
		
		if(data.action == "add"){
			this.addobjectoncanv();
		}
		if(data.action == "modify"){
			for(var i=0; i<canvas.getObjects().length;i++){
				beta = canvas.getObjects()[i].get("uuid");
				if(beta == data.targetid){
					console.log("modified");
					canvas.remove(canvas.getObjects()[i]);
					this.addobjectoncanv();
				}
				console.log(Object.keys(dt));
			}
		}
		if(data.action == "remove"){
			for(var i=0; i<canvas.getObjects().length;i++){
				beta = canvas.getObjects()[i].get("uuid");
				if(beta == data.targetid){
					canvas.remove(canvas.getObjects()[i]);
				}
				console.log(Object.keys(dt));
			}
		}
	});
	$("#iconpencil").click(function(event) {
		feature.iconpencil();
	});
	$("#iconstore").click(function(){
		feature.iconstore();
	});
	$('.choosepencilcolor').click(function(event) {
			feature.choosepencilcolor($(this));
	});
	$('.choosepencilthickness').click(function(event) {
		feature.choosepencilthickness($(this));
	});
	$(".outtext").click(function(){
		feature.outtext();
	});
	$("#icondelete").click(function(){
		feature.icondelete();
	});
	$(window).keypress(function(event) {
		feature.deletekeypress(event);
	});
	$("#iconundo").click(function(event) {
		feature.iconundo();
	});
	$("#iconcursor").click(function(){
		feature.iconcursor();
	});
	$("#iconline").click(function(){
		feature.iconline();
	});
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
	$("#image_out").click(function(){
		feature.image_out();
	});
	$("#store_out").click(function(){
		feature.store_out();
	});
	$("#store_load").click(function(){
		feature.store_load();
	});
	$('html, body').css({
	    'overflow': 'hidden',
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
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}