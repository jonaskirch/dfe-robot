import xml2js from 'xml2js';

abstract class XmlHelper {
  public static serialize(obj: any, rootName: string): string {
    const builder = new xml2js.Builder({
      attrkey: 'attributes',
      rootName,
      headless: true,
      renderOpts: {
        pretty: false,
      },
      cdata: true,
    });

    const xml = builder.buildObject(obj);
    return xml;
  }

  public static async deserialize(xml: string, tag = ''): Promise<any> {
    const obj = await xml2js.parseStringPromise(xml, {
      attrkey: 'attributes',
      explicitArray: false,
    });
    if (tag !== '') {
      return obj['soap:Envelope']['soap:Body'][tag];
    }
    return obj;
  }
}

export default XmlHelper;
