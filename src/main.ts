import { search } from './dfe';
import manifestacao from './manifestacao';

async function start() {
  console.log('start');
  setInterval(async () => search(0), 300000);
}

// search(0);
// start();

manifestacao.CienciaDaOperacao({
  chave: '43220773766255000133550090000025331626312006',
  idLote: 1,
});
