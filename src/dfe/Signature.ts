import { SignedXml } from 'xml-crypto';

export abstract class Signature {
  public static signXml(xml: string, tag: string, certificado: any) {
    const sig = new SignedXml();
    sig.addReference(`//*[local-name(.)='${tag}']`, [''], '', '', '', '', true);
    sig.signingKey = certificado.key;
    sig.computeSignature(xml);
    return sig.getSignedXml();
  }

  public static signXmlX509(xml: string, tag: string, certificado: any) {
    const transforms = [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    ];

    const infoProvider = (pem: any) => {
      return {
        getKeyInfo() {
          const cert = this.getCert();
          return `<X509Data><X509Certificate>${cert}</X509Certificate></X509Data>`;
        },
        getCert() {
          const certLines = pem.toString().split('\n');
          return certLines
            .filter((e: any, i: any) => i && e && e.indexOf('-----') !== 0)
            .join('');
        },
      };
    };

    const sig = new SignedXml();

    sig.addReference(
      `//*[local-name(.)='${tag}']`,
      transforms,
      '',
      '',
      '',
      '',
      false,
    );
    sig.signingKey = certificado.key;
    sig.canonicalizationAlgorithm =
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sig.keyInfoProvider = infoProvider(certificado.cert);
    sig.computeSignature(xml);

    return sig.getSignedXml();
  }
}
