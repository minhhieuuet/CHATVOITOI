var express=require("express");
var app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

var server=require('http').Server(app);
var io=require('socket.io')(server);

var userarr=[];
var username;
io.on("connection",function(socket){
	socket.on("client-send-username",function(data){
		socket.username=data;
		username=data;
		if(userarr.indexOf(data)>=0){
			socket.emit("server-send-login-fail");
		}
		else
		{
			userarr.push(data);
			socket.emit("server-send-info",socket.username);
			io.sockets.emit("server-send-user-online",userarr);
			socket.on("client-send-mess",function(data){
				 io.sockets.emit("server-send-mess",{name:socket.username,mess:data});

			});
		}
	});



});

io.on("disconnect",function(){
	userarr.splice(userarr.indexOf(username),1);
});


server.listen(8080);

app.get("/",function(req,res){
	res.render("trangchu");
});