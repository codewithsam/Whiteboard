var RenderCanvasObjects = (function(){
	var RenderCanvasObjects = function(canvas){

this.addnewcircle = function(data){
	var tp = data.type;
	var dt = data.data;
		var newcirc = {};
			for(var key in dt){
				newcirc[key] = dt[key];
			}
			newcirc.uuid = data.targetid;
			canvas.add(new fabric.Circle(newcirc));
		// if( tp == "path"){
		// 	canvas.add(new fabric.Path(dt));
		// }
	}
	this.addnewrect = function(data){
		var tp = data.type;
		var dt = data.data;
		var newcirc = {};
			for(var key in dt){
				newcirc[key] = dt[key];
			}
			newcirc.uuid = data.targetid;
			canvas.add(new fabric.Rect(newcirc));
	}
	this.addnewtriangle = function(data){
		var tp = data.type;
		var dt = data.data;
		var newcirc = {};
			for(var key in dt){
				newcirc[key] = dt[key];
			}
			newcirc.uuid = data.targetid;
			canvas.add(new fabric.Triangle(newcirc));
	}
	this.addnewellipse = function(data){
		var tp = data.type;
		var dt = data.data;
		var newcirc = {};
			for(var key in dt){
				newcirc[key] = dt[key];
			}
			newcirc.uuid = data.targetid;
			canvas.add(new fabric.Ellipse(newcirc));
	}
	this.addnewpath = function(data){
		var tp = data.type;
		var dt = data.data;
		var newcirc = {};
		console.log(dt);
		dt.uuid = data.targetid;
		canvas.add(new fabric.Path(dt.path, dt));
		canvas.renderAll();

			// console.log(data);
			// for(var key in dt){
			// 		newcirc[key] = dt[key];
			// 	console.log("Key:= "+newcirc[key]+" :: "+dt[key]);
			// }
			// newcirc.uuid = data.targetid;
			// // newcirc.pathOffset.x = ;
			// // newcirc.pathOffset.y = dt.pathOffset.y;
			// var myObj = dt.path;

			// var array = $.map(myObj, function(value, index) {
			//     return [value];
			// });
			// console.log(array);
			 // canvas.add(new fabric.Path([["M", 113.5, 0],["Q", 113.5, 0, 114, 0],["Q", 114.5, 0, 106.75, 1],["Q", 99, 2, 91, 4.5],["Q", 83, 7, 72, 11.5],["Q", 61, 16, 54.5, 21.5],["Q", 48, 27, 43.5, 30],["Q", 39, 33, 37.5, 37.5],["Q", 36, 42, 33, 45.5],["Q", 30, 49, 29.5, 52.5],["Q", 29, 56, 29, 58.5],["Q", 29, 61, 29, 61.5],["Q", 29, 62, 29, 64.5],["Q", 29, 67, 30, 68],["Q", 31, 69, 34, 70.5],["Q", 37, 72, 41, 72.5],["Q", 45, 73, 51, 73.5],["Q", 57, 74, 61, 76],["Q", 65, 78, 66, 78],["Q", 67, 78, 67, 78],["Q", 67, 78, 67, 78],["Q", 67, 78, 67, 78.5],["Q", 67, 79, 67, 79],["Q", 67, 79, 67, 79.5],["Q", 67, 80, 65, 81.5],["Q", 63, 83, 59, 86.5],["Q", 55, 90, 41.5, 98.5],["Q", 28, 107, 21, 110.5],["Q", 14, 114, 9.5, 117],["Q", 5, 120, 3, 120],["Q", 1, 120, 0.5, 120],["Q", 0, 120, 0, 120],["L", 0, 120]],{
			 // 	fill: '',
			 // 	fillRule: "source-over",
			 // 	height: 155,
			 // 	hoverCursor: null,
			 // 	includeDefaultValues: true,
			 // 	left: 429.5,
			 // 	selectable:	true,
			 // 	stroke: "rgb(0, 0, 0)",
			 // 	strokeDashArray: null,
			 // 	strokeLineCap: "round",
			 // 	strokeLineJoin: "round",
			 // 	strokeMiterLimit: 10,
			 // 	strokeWidth: 1,
			 // 	top: 104.5,
			 // 	transformMatrix: null,
			 // 	transparentCorners: true
			 // }));

			// var pth = new fabric.Path(array, {

			// 	fill: '',
			// 	fillRule: "source-over",
			// 	height: dt.height,
			// 	left: dt.left,
			// 	selectable: dt.selectable,
			// 	stroke: dt.stroke,
			// 	strokeDashArray: dt.strokeDashArray,
			// 	strokeLineCap: dt.strokeLineCap,
			// 	strokeLineJoin: dt.strokeLineJoin,
			// 	strokeMiterLimit: dt.strokeMiterLimit,
			// 	strokeWidth: dt.strokeWidth,
			// 	top: dt.top,
			// 	transformMatrix: dt.transformMatrix,
			// 	transparentCorners: dt.transparentCorners,
			// 	uuid: data.targetid
			// });
			// canvas.add(pth);
			// //console.log(pth.thiser());
			// canvas.renderAll();
	}
	this.addnewtext = function(data){
		var tp = data.type;
		var dt = data.data;
		
		var newcirc = {};
			for(var key in dt){
				newcirc[key] = dt[key];
			}
			newcirc.uuid = data.targetid;
			console.log(Object.keys(newcirc));
			var txtval = newcirc.text;
			canvas.add(new fabric.Text(txtval,newcirc));
			console.log("UUID: "+newcirc.uuid);


	}
	this.addnewgroup = function(data){
		var tp = data.type;
		var dt = data.data;
		console.log(dt);
		dtobj = dt.objects;
		dt.objects = '';
		canvas.add(new fabric.Group(dtobj,dt));
	}
}
return RenderCanvasObjects;
})(RenderCanvasObjects || {})

