import fs from 'fs';
import { execSync } from 'child_process';

class Certificate {
  public key: Buffer | undefined;

  public cert: Buffer | undefined;

  public pfx: Buffer;

  public ca: Buffer | undefined;

  private pfxFile: string;

  public password: string;

  public expirationDate: Date;

  constructor(pfxFile: string, password: string) {
    this.pfxFile = pfxFile;
    this.password = password;
    this.pfx = fs.readFileSync(pfxFile);
    this.key = execSync(
      `openssl pkcs12 -in ${this.pfxFile} -nocerts --clcerts -nodes -password pass:${password} | sed -ne '/-BEGIN PRIVATE KEY-/,/-END PRIVATE KEY-/p'`,
    );
    this.cert = execSync(
      `openssl pkcs12 -in ${this.pfxFile} -nokeys --clcerts -password pass:${password} | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p'`,
    );

    const pemFile = this.pfxFile.replace('.pfx', '.pem');
    console.log(pemFile);
    execSync(
      `openssl pkcs12 -in ${this.pfxFile} -out ${pemFile} -nodes -password pass:${password}`,
    );

    this.expirationDate = new Date(
      execSync(`openssl x509 -in ${pemFile} -noout -enddate`)
        .toString()
        .replace('notAfter=', ''),
    );

    // openssl x509 -in certoffice.pem -noout -startdate -enddate -subject -issuer -ext subjectAltName -ext keyUsage -nameopt sep_multiline -serial

    console.log(this.expirationDate);
  }
}

export default Certificate;

// // remove informations before -----BEGIN PRIVATE KEY-----

// // openssl pkcs12 -in certname.pfx -nocerts --clcerts -out key.pem -nodes
// const privateKey = fs.readFileSync(
//   '/home/kirch/cert/office/gen/certoffice-key.key',
// );

// // openssl pkcs12 -in certname.pfx -nokeys --clcerts -out cert.pem
// const publicKey = fs.readFileSync(
//   '/home/kirch/cert/office/gen/certoffice-pub.cer',
// );

// const pfx = fs.readFileSync('/home/kirch/cert/office/gen/certoffice.pfx');

// const password = '1';

// // openssl pkcs7 -print_certs -inform DER -outform PEM -in sefazrs.p7b -out sefazrs.pem
// // const ca = fs.readFileSync('/home/kirch/cert/office/catestao.pem');
// const ca = fs.readFileSync('/home/kirch/cert/office/gen/certoffice-ca.pem');

// export default {
//   key: privateKey,
//   cert: publicKey,
//   pfx,
//   password,
//   ca,
// };
