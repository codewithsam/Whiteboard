var express = require('express');
var mysql = require('mysql');
var app = express();
var http = require('http');
var	io = require('socket.io');
var hbs = require('hbs');
var so = io.listen(http.createServer(app).listen(2000))
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// 	var connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'password',
// 	database: 'screencast'
// });

// connection.connect(function(err, conn) {
//     if(err) {
//          console.log('MySQL connection error: ', err);
//          process.exit(1);
//     }

// });

// connection.query('select * from posts', function(err,rows,fields){
// 	if(!err){
// 		console.log(rows);
// 	}else{
// 		console.log(err);
// 	}
// });

// connection.end();

app.get('/:sessid', function(req,res){
	res.sendFile(__dirname + '/board.html');
});
app.get('/reader/:session/:uniqueuser/:userrole/:pdfnameurl', function(req, res){	
	res.render('reader', {session: req.params.session, uniqueuser: req.params.uniqueuser, userrole: req.params.userrole, pdfname: req.params.pdfnameurl});
});
app.get('/board/:session/:uniqueuser/:userrole', function(req,res){
	res.render('board', {uniqueuser: req.params.uniqueuser, roomsession: req.params.session, userrole: req.params.userrole});
});


var connectedusers = {};
var connectedpdfusers = {};
    so.sockets.on('connection', function (socket) {
    	socket.on('disconnect', function(){
    		if(socket.action != "undefined"){
    			var fromroom = socket.room;
	    		var fromuser = socket.username;
	    		var fromrole = socket.role;
	    		for(var key in connectedpdfusers[fromroom]){
	    			if(key == fromuser){
	    				delete connectedpdfusers[fromroom][key];
	    			}
	    		}
    		}
    		else{
    			var fromroom = socket.room;
	    		var fromuser = socket.username;
	    		var fromrole = socket.role;
	    		for(var key in connectedusers[fromroom]){
	    			if(key == fromuser){
	    				delete connectedusers[fromroom][key];
	    			}
	    		}
	    		var allusers = Object.keys(connectedusers[fromroom]);
	    		so.sockets.in(fromroom).emit('updateconnlist', allusers);
	    		console.log(connectedusers);
    		}
    	});
    socket.on('addmetosess', function(data){
    	var room = data.roomsess;
    	var username = data.username;
    	var role = data.role;
    	socket.join(room);
    	if(connectedusers.hasOwnProperty(room)){
    		socket["role"] = role;
    		socket["room"] = room;
    		socket["username"] = username;
    		connectedusers[room][username] = socket;
    		console.log("room:"+room+" || role: "+connectedusers[room][username]["role"]);
    	}else{
    		socket["role"] = role;
    		socket["room"] = room;
    		socket["username"] = username;
    		connectedusers[room] = {};
    		connectedusers[room][username] = socket;
    		console.log("room:"+room+" || role: "+connectedusers[room][username]["role"]);
    	}
    	var allusers = Object.keys(connectedusers[room]);
    	so.sockets.in(room).emit('updateconnlist', allusers);
    	console.log(connectedusers);
    });
	
    socket.on('addmetopdfsess', function(data){
    	var room = data.pdfroom;
    	var username = data.pdfusername;
    	var role = data.pdfuserrole;
    	socket.join(room);
    	if(connectedpdfusers.hasOwnProperty(room)){
    		socket["role"] = role;
    		socket["room"] = room;
    		socket["username"] = username;
    		socket["action"] = "pdfsocket";
    		connectedpdfusers[room][username] = socket;
    	}else{
    		socket["role"] = role;
    		socket["room"] = room;
    		socket["username"] = username;
    		socket["action"] = "pdfsocket";
    		connectedpdfusers[room] = {};
    		connectedpdfusers[room][username] = socket;
    	}
    });

	socket.on('mousemove', function (data) {
		//console.log(data.data.type);
		socket.broadcast.to(data.id).emit('moving', data);
	});
	socket.on('pdfwindow', function (data) {
		console.log(data);
		socket.broadcast.to(data.id).emit('openwindow', data);
	});
	socket.on('PDFsync', function(data){
		console.log("Sync Data: "+data);
		socket.broadcast.to(data.id).emit('PDFpageSync', data);
	});
	socket.on('PDFpenMove', function (data) {
		socket.broadcast.to(data.id).emit('PDFpenMoving', data);
	});
	socket.on('newPenMove', function(data){
		socket.broadcast.to(data.id).emit('newPenMoving', data);
	});
	socket.on('updateCanvasObject', function(data){
		socket.broadcast.to(data.id).emit('updatingCanvasObject', data.data);
	});
	socket.on('replyToCanvasObject', function(data){
		var fromroom = socket.room;
    		var fromuser = socket.username;
    		var fromrole = socket.role;
		for(var key in connectedusers[fromroom]){
			if(connectedusers[fromroom][key]["role"] == 'teacher'){
//				so.sockets.socket(connectedusers[data.id][key][id]).emit('replyingToCanvasObject', data);
				connectedusers[fromroom][key].emit('replyingToCanvasObject', data);
			}
		}


	});
	socket.on('affectCanvasObjects', function(data){
		for(var key in connectedusers[data.id]){
			if(key == data.username){
				connectedusers[data.id][key].emit('affectingCanvasObjects', data);
			}
		}
	});
	socket.on('clearthecanvas', function(data){
		socket.broadcast.to(data.id).emit('clearingthecanvas');
	});

});

