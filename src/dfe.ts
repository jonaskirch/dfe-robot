import { format } from 'date-fns';

import {
  createClientAsync,
  ClientSSLSecurity,
  ClientSSLSecurityPFX,
} from 'soap';
import xml2js from 'xml2js';
import axios from 'axios';
import https from 'https';
import cert from './certificate';
import WSSecurityNFe from './WSSecurityNFe';

const url =
  'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl';

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
    const httpsAgent = new https.Agent({
      ca: cert.ca,
      // cert: cert.cert,
      // key: cert.key,
      passphrase: cert.password,
      pfx: cert.pfx,
    });

    const axiosInstance = axios.create({ httpsAgent });

    const client = await createClientAsync(url, {
      request: axiosInstance,
      preserveWhitespace: true,
    });

    // const wsSecurity = new WSSecurityNFe(
    //   cert.key,
    //   cert.cert,
    //   cert.password,
    //   cert.ca,
    // );

    // const wsSecurity = new ClientSSLSecurity(cert.key, cert.cert, cert.ca, {
    //   rejectUnauthorized: false,
    //   strictSSL: true,
    //   forever: false,
    // });
    // const wsSecurity = new ClientSSLSecurityPFX(cert.pfx);

    // client.setSecurity(wsSecurity);

    const message = genSearchMessage(ultNSU);

    const response = await client.nfeDistDFeInteresseAsync(message);

    const respData: any = await xml2js.parseStringPromise(response[1], {
      explicitArray: false,
    });

    const resp =
      respData['soap:Envelope']['soap:Body'].nfeDistDFeInteresseResponse
        .nfeDistDFeInteresseResult;

    const { cStat, xMotivo, ultNSU: ultimoNSU } = resp.retDistDFeInt;
    if (['137', '138'].includes(cStat)) {
      console.log(format(new Date(), 'hh:mm:ss'), cStat, xMotivo, ultimoNSU);
    }
  } catch (err: any) {
    console.log(err);
  }
};

export { search };
