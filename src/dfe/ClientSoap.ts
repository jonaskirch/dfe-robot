import https from 'https';
import axios from 'axios';
import { createClientAsync, Client } from 'soap';
import cert from './certificate';

abstract class ClientSoap {
  public static async create(url: string): Promise<Client> {
    const httpsAgent = new https.Agent({
      pfx: cert.pfx,
      passphrase: cert.password,
      ca: cert.ca,
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
