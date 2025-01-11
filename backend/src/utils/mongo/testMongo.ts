import dbClient from './db';

const waitConnection = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let i = 0;

    const repeatFn = async () => {
      setTimeout(() => {
        i += 1;
        if (i > 10) {
          reject();
        } else if (!dbClient.isActive()) {
          repeatFn();
        } else {
          resolve('Database connected');
        }
      }, 1000);
    };
    repeatFn();
  });
};

(async () => {
  try {
    console.log(dbClient.isActive());
    await waitConnection();
    console.log(dbClient.isActive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
  } catch (error) {
    console.error(error);
  }
})();
