const socket = io()

const shareLocation = document.getElementById('location')
const messages = document.getElementById('messages')
const messagetemplate = document.getElementById('message-template').innerHTML
const locationtemplate = document.getElementById('location-template').innerHTML
const eventtemplate = document.getElementById('event-template').innerHTML

const {username,room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

document.getElementById('form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const text = e.target.elements.message

    socket.emit('sendMessage', text.value, ({error,message})=>{
        if(error){
            alert(error)
            location.href = '/'
        }
        text.value=''
    })

})

socket.on('event', (message)=>{
    const html = Mustache.render(eventtemplate, {
        message
    })
    messages.insertAdjacentHTML('beforeend', html) 
})

socket.on('message',({message,timestamp,username})=>{

    const html = Mustache.render(messagetemplate, {
        message,
        timestamp : moment(timestamp).format('h:mm a'),
        username
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (location,username)=>{
    const html = Mustache.render(locationtemplate, {
        location,
        username
    })
    messages.insertAdjacentHTML('beforeend', html)
})

shareLocation.addEventListener('click',()=>{
    if(!navigator.geolocation)
        return alert('Enable Location')
    
    shareLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        const pos = position
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (message)=>{
            console.log(message)
            shareLocation.removeAttribute('disabled')
        })
    })
})

socket.emit('join',{username,room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})

socket.emit('', {})