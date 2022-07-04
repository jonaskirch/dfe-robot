import { format } from 'date-fns';
import XmlHelper from './dfe/XmlHelper';
import ClientSoap from './dfe/ClientSoap';

function genSearchMessage(ultNSU: number) {
  const message = {
    nfeDadosMsg: {
      distDFeInt: {
        attributes: {
          versao: '1.01',
          xmlns: 'http://www.portalfiscal.inf.br/nfe',
        },
        tpAmb: 1,
        cUFAutor: 43,
        CNPJ: '73766255000133',
        distNSU: {
          ultNSU: ultNSU.toString().padStart(15, '0'),
        },
      },
    },
  };
  return message;
}

const search = async (ultNSU = 0) => {
  try {
    const message = genSearchMessage(ultNSU);

    const url =
      'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl';
    const client = await ClientSoap.create(url);

    const response = await client.nfeDistDFeInteresseAsync(message);

    const resp: any = (
      await XmlHelper.deserialize(response[1], 'nfeDistDFeInteresseResponse')
    ).nfeDistDFeInteresseResult;

    const { cStat, xMotivo, ultNSU: ultimoNSU } = resp.retDistDFeInt;
    if (['137', '138'].includes(cStat)) {
      console.log(format(new Date(), 'hh:mm:ss'), cStat, xMotivo, ultimoNSU);
    } else {
      console.log(format(new Date(), 'hh:mm:ss'), cStat);
    }
  } catch (err: any) {
    console.log(err);
  }
};

export { search };
