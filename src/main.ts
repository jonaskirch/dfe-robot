import { search } from './dfe';

async function start() {
  console.log('start');
  setInterval(async () => search(0), 1000);
  console.log('finish');
}

start();
