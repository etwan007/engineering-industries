import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6a0a2da600133e3ae2b2');

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
