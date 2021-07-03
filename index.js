const express=require('express')
 const {generatemessage,generatelocationmessage}=require('./messages');
const {  addUser,
  removeUser,
  getUser,
  getUsersInRoom }=require('./users')


const http=require('http');
const filter=require('bad-words')
const app=express()
const port=process.env.PORT||3000;

const path=require('path');
const socketio=require('socket.io')

const publicDirectoryPath=path.join(__dirname);
app.use(express.static( publicDirectoryPath));

const server=http.createServer(app);
const io=socketio(server)

let count=0;
io.on('connection',(socket)=>
{
console.log('new connection occured');



socket.on('join',(options,callback)=>
{
 const {error,user}=addUser({id :socket.id, ...options})
if(error)
{
 return callback(error)
}

    socket.join(user.room);

      socket.emit('message',generatemessage('Admin','welcome !'));
      socket.broadcast.to(user.room).emit('message',generatemessage('Admin',`${user.username} has joined`))
    
    
    
      io.to(user.room).emit('roomdata',{

room: user.room,
users:getUsersInRoom(user.room)

     })
     
      callback()

})
socket.on('sendmessage',(message,callback)=>
{
const user=getUser(socket.id);
const filter1=new filter();
if(filter1.isProfane(message))
{
  return callback('profanity is not allowed');
}



 io.to(user.room).emit('message',generatemessage(user.username,message));



 
 callback();
})



socket.on('sendlocation',(coords,callback)=>
{
  const user=getUser(socket.id);
    io.to(user.room).emit('locationmessage', generatelocationmessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
    callback();
})




socket.on('disconnect',()=>
{
 const user=removeUser(socket.id);
if(user)
{
  io.to(user.room).emit('message',generatemessage('Admin',`${user.username} has left!`));

io.to(user.room).emit('roomdata',{

room:user.room,
users:getUsersInRoom(user.room)

})

}

})

})



server.listen(port,()=>
{
console.log("server is running"+port);
})