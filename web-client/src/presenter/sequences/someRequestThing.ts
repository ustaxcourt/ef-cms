import axios from 'axios';

const client = axios.create();

client.interceptors.request.use(config => {
  config.errorContext = new Error('Thrown at:');
  return config;
});

client.interceptors.response.use(undefined, async error => {
  const originalStackTrace = error.config?.errorContext?.stack;
  if (originalStackTrace) {
    error.stack = `${error.stack}\n${originalStackTrace}`;
  }

  throw error;
});

async function f1() {
  await f2();
}
async function f2() {
  await f3();
}
async function f3() {
  await client.get('http://localhost:4000/feature-flag/');
}

async function main() {
  try {
    await f1();
  } catch (e) {
    console.log('STACKKKKKKKKKK', e.stack);
  }
}

main();
