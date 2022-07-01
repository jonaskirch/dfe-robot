import fs from 'fs';

// remove informations before -----BEGIN PRIVATE KEY-----

// openssl pkcs12 -in certname.pfx -nocerts --clcerts -out key.pem -nodes
const privateKey = fs.readFileSync('/home/kirch/cert/office/key.pem');

// openssl pkcs12 -in certname.pfx -nokeys --clcerts -out cert.pem
const publicKey = fs.readFileSync('/home/kirch/cert/office/cert.pem');

const password = '1';

// openssl pkcs7 -print_certs -inform DER -outform PEM -in sefazrs.p7b -out sefazrs.pem
const ca = fs.readFileSync('/home/kirch/cert/office/catestao.pem');

const pfx = fs.readFileSync('/home/kirch/cert/office/certoffice.pfx');

export default {
  key: privateKey,
  cert: publicKey,
  password,
  ca,
  pfx,
};
