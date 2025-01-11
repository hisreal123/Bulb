import redisClient from './redis';

(async () => {
  console.log(redisClient.isActive());
  console.log(await redisClient.get('myKey'));
  await redisClient.set('myKey', 12, 5);
  console.log(await redisClient.get('myKey'));
  await redisClient.del('myKey');

  setTimeout(async () => {
    console.log(await redisClient.get('myKey'));
  }, 1000 * 10);
})();
