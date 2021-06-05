const metadata = (message,username)=>{
    return {
        message,
        timestamp : new Date().getTime(),
        username
    }
}

module.exports = metadata