const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

const fib = (n) => {
    const phi = (1 + Math.sqrt(5))/2;
    return Math.round((Math.pow(phi, n) - Math.pow(-phi, -n))/(2 * phi -1));
};

sub.on('message', (ch, msg) => {
    redisClient.hset('values', msg, fib(parseInt(msg)));
});

sub.subscribe('insert');