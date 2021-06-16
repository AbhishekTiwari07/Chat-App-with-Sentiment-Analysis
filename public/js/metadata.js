const Sentiment = require('sentiment');

const metadata = (message,username)=>{
    var sentiment = new Sentiment();
    var result = sentiment.analyze(message);
    return {
        message,
        timestamp : new Date().getTime(),
        score : result.score,
        username
    }
}

module.exports = metadata