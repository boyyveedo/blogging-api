const redis = require('redis')


const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
})

redisClient.on('connect', () => {
    console.log('redis connected sucessfuly')
})



module.exports = redisClient 