const socket =io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

const $messages=document.querySelector('#messages');
const messagetemplate=document.querySelector('#message-template').innerHTML;

const locationmessagetemplate=document.querySelector('#location-message-template').innerHTML;




const sidebartemplate=document.querySelector('#sidebar-template').innerHTML;

   const{ username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})




   const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    console.log(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}
















socket.on('message',(message)=>
{
console.log(message);
const html=Mustache.render(messagetemplate,{
  username:message.username,
message:message.text,
createdat:moment(message.createdat).format('h:mm a')
});
$messages.insertAdjacentHTML('beforeend',html)
autoscroll()
})




socket.on('locationmessage',(message)=>
{
//console.log(url);


const html=Mustache.render(locationmessagetemplate,{
  username:message.username,
  url:message.url,
  createdat:moment(message.createdat).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend',html);

  autoscroll()
});


socket.on('roomdata',({room,users})=>
{






  const html=Mustache.render(sidebartemplate,{

room,
users


  })
  document.querySelector('#sidebar').innerHTML=html;
  //console.log(users);
})





$messageForm.addEventListener('submit',(e)=>
{

    e.preventDefault();
    
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message=e.target.elements.message.value;


    socket.emit('sendmessage',message,(error)=>
    {

      $messageFormButton.removeAttribute('disabled')
      $messageFormInput.value = ''
      $messageFormInput.focus()
      if(error)
      {
        return console.log(error);
      }
console.log("this message is deleiverd!");

    });
})







$sendLocationButton.addEventListener('click',()=>
{
if(!navigator.geolocation)
{
return alert('geoloaction not supported');
}
$sendLocationButton.setAttribute('disabled', 'disabled')
navigator.geolocation.getCurrentPosition((position)=>
{
console.log(position);

socket.emit('sendlocation',{
  latitude:position.coords.latitude,
  longitude:position.coords.longitude
},()=>
{
  $sendLocationButton.removeAttribute('disabled')
console.log('location shared');
}
)
})







  
})
socket.emit('join',{username,room},(error)=>
{

if(error)
{
  alert(error);
  location.href='/';
}

})