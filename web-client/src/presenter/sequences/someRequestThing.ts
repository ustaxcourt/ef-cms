import axios from 'axios';

function getAxios() {
  const client = axios.create();

  const stackError = new Error();
  // client.interceptors.request.use(config => {
  //   return config;
  // });

  client.interceptors.response.use(undefined, async error => {
    error.stack = stackError.stack;
    error.message = stackError.message;
    throw error;
  });
  return client;
}

async function f1() {
  await f2();
}
async function f2() {
  await f3();
}
async function f3() {
  await getAxios().get('http://localhost:4000/feature-flag/');
  // throw new Error('yooooooo');
}

async function main() {
  try {
    await f1();
  } catch (e) {
    console.log('STACKKKKKKKKKK', e.stack);
  }
}

main();
