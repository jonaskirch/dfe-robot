import { format } from 'date-fns';
import { Signature } from './dfe/Signature';
import XmlHelper from './dfe/XmlHelper';
import ClientSoap from './dfe/ClientSoap';
import cert from './dfe/certificate';

interface IDadosManifestacao {
  chave: string;
  idLote: number;
}

class Manifestacao {
  private async eventoManifestacao(
    dados: IDadosManifestacao,
    tpEvento: number,
  ) {
    const event = {
      envEvento: {
        attributes: {
          versao: '1.00',
          xmlns: 'http://www.portalfiscal.inf.br/nfe',
        },
        idLote: 1,
        evento: {
          attributes: {
            versao: '1.00',
            xmlns: 'http://www.portalfiscal.inf.br/nfe',
          },
          infEvento: {
            attributes: {
              Id: `ID${tpEvento}${dados.chave}01`,
            },
            cOrgao: 91,
            tpAmb: 2,
            CNPJ: '73766255000133',
            chNFe: dados.chave,
            dhEvento: format(new Date(), `yyyy-MM-dd'T'HH:mm:ssxxx`),
            tpEvento,
            nSeqEvento: 1,
            verEvento: '1.00',
            detEvento: {
              attributes: {
                versao: '1.00',
              },
              descEvento: 'Ciencia da Operacao',
              // xJust: '',
            },
          },
        },
      },
    };

    const xml = XmlHelper.serialize(event.envEvento.evento, 'evento');

    const sign = Signature.signXmlX509(xml, 'infEvento', cert);

    const signObj = await XmlHelper.deserialize(sign);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    event.envEvento.evento.Signature = signObj.evento.Signature;

    try {
      const url =
        'https://hom1.nfe.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx?wsdl';
      const client = await ClientSoap.create(url);

      const response = await client.nfeRecepcaoEventoNFAsync(event);

      const resp: any = await XmlHelper.deserialize(
        response[1],
        'nfeRecepcaoEventoNFResult',
      );

      console.log(resp.retEnvEvento);

      console.log(resp.retEnvEvento.retEvento.infEvento.xMotivo);
    } catch (err: any) {
      console.log(err);
    }
  }

  public CienciaDaOperacao(dados: IDadosManifestacao) {
    this.eventoManifestacao(dados, 210210);
  }
}

export default new Manifestacao();
