import { MongoClient } from 'mongodb';

class DBClient {
  /*
   * db connection to mongodb database
   */

  client: any;
  isConnectedToDb: boolean;

  constructor() {
    const DB_URL: string | undefined =
      process.env.PRODUCTION_URL || 'mongodb://localhost:27017/Bulb';

    this.isConnectedToDb = false;
    this.client = new MongoClient(DB_URL);

    // Connect to the database asynchronously
    this.connectToDB().catch(console.dir);
  }

  async connectToDB(): Promise<void> {
    try {
      await this.client.connect();
      this.isConnectedToDb = true;
      console.log('Database connected');
    } catch (error) {
      this.isConnectedToDb = false;
      console.error(`Error: ${error}`);
    }
  }

  /**
   * check db connection
   */
  isActive(): boolean {
    return this.isConnectedToDb;
  }

  async nbUsers() {
    return await this.client.db().collection('users').countDocuments(); // check for the users collection in the db
  }

  async nbFiles() {
    return await this.client.db().collection('files').countDocuments(); // check for the files collection in the db
  }

  async fileCollection() {
    return await this.client.db().collection('files'); // check for the files collection in the db
  }

  async userCollection() {
    return await this.client.db().collection('users'); // check for the users collection in the db
  }
}

// instance of DBClient
const dbClient = new DBClient();
export default dbClient;
