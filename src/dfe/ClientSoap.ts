import https from 'https';
import axios from 'axios';
import { createClientAsync, Client } from 'soap';
import Certificate from './certificate';

class ClientSoap {
  public static async create(url: string): Promise<Client> {
    const cert = new Certificate(
      '/home/kirch/cert/office/gen/certoffice.pfx',
      '1',
    );
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      pfx: cert.pfx,
      passphrase: cert.password,
      // ca: cert.ca,
    });

    const axiosInstance = axios.create({ httpsAgent });

    const client = await createClientAsync(url, {
      request: axiosInstance,
      preserveWhitespace: true,
    });
    return client;
  }
}

export default ClientSoap;
