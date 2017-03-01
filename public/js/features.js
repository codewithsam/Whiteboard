var Features = (function(){
	
	var Features = function(canvas){
		this.iconpencil = function(){
			renderit = true;
			canvas.isDrawingMode = true;
			freeDrawingBrush = new fabric.PencilBrush(canvas);
			canvas.freeDrawingBrush.color = "#"+window.resource.color;
		    canvas.renderAll();
	    	canvas.calcOffset();
		}
		// this.choosepencilcolor = function(self){
		// 	renderit = true;
		// 	var pencilcolor = self.data("pencilcolor");
		// 	if(freeDrawingBrush){
		// 		canvas.freeDrawingBrush.color = "#"+pencilcolor;
		// 	}else{
		// 		freeDrawingBrush = new fabric.PencilBrush(canvas);
		// 		canvas.freeDrawingBrush.color = "#"+pencilcolor;
		// 	}
		// }
		// this.choosepencilthickness = function(self){
		// 	renderit = true;
		// 	var pencilthickness = self.children("span").data("pencilthickness");
		// 	if(freeDrawingBrush){
		// 		canvas.freeDrawingBrush.width = pencilthickness;
		// 	}else{
		// 		freeDrawingBrush = new fabric.PencilBrush(canvas);
		// 		canvas.freeDrawingBrush.width = pencilthickness;
		// 	}
		// }
		this.iconstore = function(){
			renderit = true;
			canvas.clear();
			canvas.renderAll();
	    	canvas.calcOffset();
		}
		this.outtext = function(){
			renderit = true;
	    	canvas.isDrawingMode = false;
	    	if (canvas.getContext) {
	        	var context = canvas.getContext('2d');
			}
			var text, size, color;
			var mouse_pos = { x:0 , y:0 };
			text = $('.textstr').val();

			size = $('.textsize').val();
			if(size === ''){
				size = 30;
				console.log("empty");

			}
			color=$('.textcolor').val();
		        
		        canvas.add(new fabric.Text(text, {
		        	size: parseInt(size, 10),
		            fontFamily: 'Arial',
		            fontSize: size,
		            left: $(window).width()/3,
		            top: 80,
		            textAlign: "left",
		            fontWeight: 'bold',
		            fill: color,
		            uuid: guid()
	        	}));
		        canvas.renderAll();
		        canvas.calcOffset();
		}
		this.icondelete = function(){
			renderit = true;
	    	canvas.isDrawingMode = false;
		    var activeObject = canvas.getActiveObject(),
		    activeGroup = canvas.getActiveGroup();
		    if (activeObject) {
		            canvas.remove(activeObject);
		    }
		    else if (activeGroup) {
		            var objectsInGroup = activeGroup.getObjects();
		            canvas.discardActiveGroup();
		            objectsInGroup.forEach(function(object) {
		            canvas.remove(object);
		            });
		    }
		}
		this.deletekeypress = function(event){
			var key = event.keyCode || event.charCode;
			if(key == 46){
				$("#icondelete").click();
			}
		}
		this.iconundo = function(){
			renderit = true;
			var lastItemIndex = (canvas.getObjects().length - 1);
			var item = canvas.item(lastItemIndex);
			canvas.remove(item);
			canvas.renderAll();
		}
		this.iconcursor = function(){
			renderit = true;
			canvas.isDrawingMode = false;
		}
		this.iconline = function(){
			renderit = true;
			canvas.isDrawingMode = false;
			if (canvas.getContext) {
				var context = canvas.getContext('2d');
			}
			canvas.observe('mouse:down', function(e) { mousedown(e); });
			canvas.observe('mouse:move', function(e) { mousemove(e); });
			canvas.observe('mouse:up', function(e) { mouseup(e); });
			var started = false;
			var startX = 0;
			var startY = 0;
			function mousedown(e) {
			    var mouse = canvas.getPointer(e.e);
			    started = true;
			    startX = mouse.x;
			    startY = mouse.y;
			    canvas.off('mouse:down');
			}
			function mousemove(e) {

			    if(!started) {

			        return false;

			    }
			    canvas.off('mouse:move');

			}
			function mouseup(e) {

			    if(started) {

			        var mouse = canvas.getPointer(e.e);

			        canvas.add(new fabric.Line([startX, startY, mouse.x, mouse.y],{ stroke: "#"+window.resource.color, strokeWidth: window.resource.thickness}));
			        canvas.renderAll();
			        canvas.calcOffset(); 

			        started = false;
			        canvas.off('mouse:up');
			    }
			}
		}
		this.iconshaperectangle = function(){
			renderit = true;
			var mouse_pos = { x:0 , y:0 };
	  		canvas.isDrawingMode = false;
			canvas.observe('mouse:down', function(e) {
				mouse_pos = canvas.getPointer(e.e);
				canvas.add(new fabric.Rect({
					left: mouse_pos.x,
				    top: mouse_pos.y,
				    width: 75,
				    height: 50,
				    fill: 'white',
				    stroke: "#"+window.resource.color,
				    strokeWidth: window.resource.thickness,
				    padding: 10,
				    uuid: guid()
		  		}));
				canvas.off('mouse:down');
			});
		}
		this.iconshapecircle = function(){
			console.log(window.resource.color);

			renderit = true;
			var mouse_pos = { x:0 , y:0 };
			canvas.isDrawingMode = false;
			canvas.observe('mouse:down', function(e) {
				mouse_pos = canvas.getPointer(e.e);
				canvas.add(new fabric.Circle({
				    left: mouse_pos.x,
				    top: mouse_pos.y,
				    radius: 30,
				    fill: 'white',
				    stroke: "#"+window.resource.color,
				    strokeWidth: window.resource.thickness,
				    uuid: guid()
		  		}));
		  		uuid = "";
				canvas.off('mouse:down');
			});
		}
		this.iconshapetriangle = function(){
			renderit = true;
			var mouse_pos = { x:0 , y:0 };
			canvas.isDrawingMode = false;
			canvas.observe('mouse:down', function(e) {
				mouse_pos = canvas.getPointer(e.e);
				canvas.add(new fabric.Triangle({
				    left: mouse_pos.x,
				    top: mouse_pos.y,
				    fill: 'white',
				    stroke: "#"+window.resource.color,
				    strokeWidth: window.resource.thickness,
				    width: 60,
				    height: 80,
				    uuid: guid()
		  		}));
				canvas.off('mouse:down');
			});
		}
		this.iconshapeellipse = function(){
			renderit = true;
			var mouse_pos = { x:0 , y:0 };
			canvas.isDrawingMode = false;
			canvas.observe('mouse:down', function(e) {
			mouse_pos = canvas.getPointer(e.e);
				canvas.add(new fabric.Ellipse({
				    rx: 45,
				    ry: 25,
				    fill: 'white',
				    stroke: "#"+window.resource.color,
				    strokeWidth: window.resource.thickness,
				    left: mouse_pos.x,
				    top: mouse_pos.y,
				    uuid: guid()
  				}));
				canvas.off('mouse:down');
			});
		}
		this.image_out = function(){
			renderit = true;
		    canvas.isDrawingMode = false;
		    var json = JSON.stringify(canvas);
		    tempCanvas = document.createElement('canvas');
		    tempCanvas.id = 'tmp_canvas';
		    var temp_canvas = new fabric.Canvas('tmp_canvas',{backgroundColor : "#fff"});
		    temp_canvas.setWidth(cw);
		    temp_canvas.setHeight(ch);
		    wrapperEl = document.createElement('div');
		    wrapperEl.className = 'CONTAINER_CLASS';
		    fabric.util.makeElementUnselectable(wrapperEl);
		    $('body').append(tempCanvas.wrapperEl);
		    temp_canvas.loadFromJSON(json);
		    temp_canvas.renderAll();
		    temp_canvas.calcOffset();
		    var base64 = temp_canvas.toDataURL("png");
		    var image = new Image();
		    image.onload = function() {
		        window.open(image.src);
		    }
		    image.src = base64;
		    $("#tmp_canvas").remove();
		}
		this.store_out = function(){
			renderit = true;
		    canvas.isDrawingMode = false;
			if(!window.localStorage){alert("This function is not supported by your browser."); return;}
		    var json = JSON.stringify(canvas);
		    window.localStorage.setItem("hoge", json);
		}
		this.store_load = function(){
			renderit = true;
		    canvas.isDrawingMode = false;
		    if(!window.localStorage){alert("This function is not supported by your browser."); return;}
		    canvas.clear();
		    canvas.loadFromJSON(window.localStorage.getItem("hoge"));
		    canvas.renderAll();
		    canvas.calcOffset();
		}




		
		Features.prototype.onAdd = function(e,ajaxify) {
			var dataless = {};
			if(renderit){
					if (e.target && e.target.type !== 'path') {
					    var js = JSON.stringify(canvas.toJSON());
					    console.log(e.target.type);
					    console.log("adding: "+e.target.uuid);
					    var objdata = e.target.toJSON(['uuid']);
					    dataless = {
					    	action: "add",
					    	data: objdata,
					    	id: config.session
					    };
					    ajaxify(dataless,config.conn);
				dataless = null;

					    console.log("SIZE SENT: "+window.siez(js)+" KB");
					}
				}
		};



		Features.prototype.onModify = function(e,ajaxify){
			var js = JSON.stringify(canvas.toDatalessJSON());
			window.renderit = true;
			var dataless = {};
			if(window.renderit){
				
				if (e.target && e.target.type !== 'group') {
				    console.log('an object was Modified! ', e.target.type);
				    console.log(e.target.uuid);
				    var objdata = e.target.toJSON(['uuid']);
				    dataless = {
				    	action: "modify",
				    	data: objdata,
				    	id: config.session
				    };
				}
			//     if(e.target.type == "group"){
			// 		console.log('Group Modified! ', e.target.type);
			// 	    dataless = {
			// 	    	action: "modify",
			// 	    	type: e.target.type,
			// 	    	data: js,
			// 	    	id: config.session
			// 	    };
			// 	 console.log(e.target);
			// 	}
				ajaxify(dataless,config.conn);
				dataless = null;
						
			}
		};
		Features.prototype.onRemove = function(e,ajaxify){
			var dataless = {};
			if(window.renderit){
				if (e.target) {
				    console.log('an object was Removed! ', e.target);
				    var js = JSON.stringify(canvas.toDatalessJSON());
				    dataless = {
				    	action: "remove",
				    	targetid: e.target.uuid,
				    	id: config.session
				    };
				    ajaxify(dataless,config.conn);
				dataless = null;

				    console.log("SIZE SENT: "+window.siez(js)+" KB");
				}
			}
		};
		Features.prototype.onPath = function(e,ajaxify){
			if(window.renderit){
				if(e){
					e.path.uuid = guid();
					var objdata = e.path.toJSON(['uuid']);
					var dataless = {
					    	action: "add",
					    	data: objdata,
					    	id: config.session
					    };
					    console.log(e.path);
					    ajaxify(dataless,config.conn);
				}
			}
		};




	}


return Features;

})(Features || {});