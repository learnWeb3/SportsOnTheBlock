const { CONFIG } = require("../config");
const MongoClient = require("mongodb").MongoClient;

class Db {
  constructor(collectionName) {
    this.uri = `mongodb+srv://${CONFIG.DB_USERNAME}:${CONFIG.DB_PASSWORD}@${CONFIG.CLUSTER_NAME}.svfah.mongodb.net/${CONFIG.DB_NAME}?retryWrites=true&w=majority`;
    this.dbName = CONFIG.DB_NAME;
    this.collectionName = collectionName;
    this.client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async init() {
    const connection = await this.client.connect();
    this.db = this.client.db(this.dbName);
    this.collection = this.db.collection(this.collectionName);
    return this.collection;
  }

  async create(documents) {
    const collection = await this.init();
    const insertedDocs = await collection.insertMany(documents);
    return insertedDocs;
  }

  async update(currentDocument, updatedDocument) {
    const collection = await this.init();
    const updatedDoc = await collection.updateOne(currentDocument, {
      $set: updatedDocument,
    });
    return updatedDoc;
  }

  async findElement(queryFilter, start, limit) {
    const collection = await this.init();
    const findResult = await collection
      .find(queryFilter)
      .skip(start)
      .limit(limit)
      .toArray();
    return findResult;
  }
}

module.exports.Db = Db;
