const users = []

const addUser = ({id,username,room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room)
        return {
            error: "All fields are required*"
        }
    
        const existingUser = users.find((user)=>{
            return user.room == room && user.username == username
        })

        if(existingUser)
            return {
                error : "user already exist"
            }
        
        const user = {id, username, room}

        users.push(user)

        return {
                user
            }
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)
    if(index != -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
    const user = users.find((user)=>user.id === id)
    if(user)
        return {
            user
        }
    return {
        error : 'No user found'
    }
}

const getUserInRoom = (room) =>{
    roor = room.trim().toLowerCase()    
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}