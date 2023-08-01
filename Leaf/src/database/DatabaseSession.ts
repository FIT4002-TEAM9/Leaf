// const { MongoClient, ServerApiVersion } = require("mongodb");

// class DatabaseSession {
//     private static readonly MONGODB_URI = "mongodb+srv://Leaf:LeafAdmin123@leafdata.etuw05p.mongodb.net/?retryWrites=true&w=majority";

//     public static readonly inst = new DatabaseSession();

//     private readonly client = new MongoClient(DatabaseSession.MONGODB_URI, {
//         serverApi: {
//             version: ServerApiVersion.v1,
//             strict: true,
//             deprecationErrors: true,
//         },
//     });

//     private constructor() {}

//     private log(message: string) {
//         console.log(`[DATABASE SESSION] ${message}`)
//     }

//     private logError(message: string) {
//         console.error(`[DATABASE SESSION] ${message}`)
//     }

//     public async testConnection() {
//         try {
//             // Connect the this.client to the server	(optional starting in v4.7)
//             await this.client.connect();
//             // Send a ping to confirm a successful connection
//             await this.client.db("admin").command({ ping: 1 });
//             this.log("Connection Established");
//         } finally {
//             await this.client.close();
//         }
//     }

//     // const handlePress = async () => {
//     //     const result = await DatabaseSession.inst.insertOne('databaseName', 'collectionName');
//     //     // React to the outcome
//     // }
//     public async insertOne(databaseName: string, collectionName: string): Promise<boolean> {
//         try {
//             // name of the database in the cluster
//             const database = this.client.db(databaseName);
//             // name of the collection in the database
//             const collection = database.collection(collectionName);
//             // insert data
//             const result = await collection.insertOne({ test: "test_data" });
//             this.log(`${databaseName}/${collectionName} Inserted ${result.insertedCount} document`);
//             return result.insertedCount > 0;
//         } catch (error) {
//             this.logError(error);
//             return false;
//         } finally {
//             await this.client.close();
//         }
//     }

//     public async insertMany(databaseName: string, collectionName: string) {
//         try {
//             // name of the database in the cluster
//             const database = this.client.db(databaseName);
//             // name of the collection in the database
//             const collection = database.collection(collectionName);
//             // insert data
//             const result = await collection.insertMany([
//                 { test: "data 1", test1: 1 },
//                 { test: "data 2", test1: 3 },
//                 { test: "data 3", test1: 3 },
//             ]);
//             this.log(`${databaseName}/${collectionName} Inserted ${result.insertedCount} documents`);
//         } finally {
//             await this.client.close();
//         }
//     }

//     public async findOne(databaseName: string, collectionName: string) {
//         try {
//             const database = this.client.db(databaseName);
//             const collection = database.collection(collectionName);
//             const entry = await collection.findOne({ test1: 1 });
//             console.log(entry);
//         } finally {
//             await this.client.close();
//         }
//     }

//     public async findMany(databaseName: string, collectionName: string) {
//         try {
//             const database = this.client.db(databaseName);
//             const collection = database.collection(collectionName);
//             const query = { test1: 3 };
//             // cursors are objects that fetches a number of documents
//             const cursor = collection.find(query)
    
//             if ((await collection.countDocuments(query)) === 0) {
//                 console.warn("No documents found!");
//             }
//             // essentially a for each loop to print all documents stored in the cursor
//             for await (const document of cursor) {
//                 console.dir(document);
//             }
//         } finally {
//             await this.client.close();
//         }
//     }

//     public async deleteOne(databaseName: string, collectionName: string) {
//         try {
//             const database = this.client.db(databaseName);
//             const collection = database.collection(collectionName);
//             // Query for a document
//             const query = { test1: 1 };
//             const result = await collection.deleteOne(query);
//             if (result.deletedCount === 1) {
//                 this.log(`${databaseName}/${collectionName} Deleted 1 document`);
//             } else {
//                 this.log(`${databaseName}/${collectionName} Deleted 0 documents`);
//             }
//         } finally {
//             await this.client.close();
//         }
//     }

//     public async deleteMany(databaseName: string, collectionName: string) {
//         try {
//             const database = this.client.db(databaseName);
//             const collection = database.collection(collectionName);
//             // delete
//             const result = await collection.deleteMany({ test1: 3 });
//             this.log(`${databaseName}/${collectionName} Deleted ${result.deletedCount} documents`);
//         } finally {
//             await this.client.close();
//         }
//     }

//     public async count(databaseName: string, collectionName: string) {
//         try {
//             const database = this.client.db(databaseName);
//             const collection = database.collection(collectionName);
//             // define query
//             const query = { test1: 3 };
    
//             const count = await collection.countDocuments(query);
//             this.log(`${databaseName}/${collectionName} Counted ${count} documents`);
//         } finally {
//             await this.client.close();
//         }
//     }

//     public async updateOne(databaseName: string, collectionName: string) {
//         try {
//             const database = this.client.db(databaseName);
//             const collection = database.collection(collectionName);
    
//             // define document to update. method will throw exception if the immutable field '_id' is part of the update attempt
//             // similarily, method will throw a 'duplicate key error' if unique index rules are violated by the update
//             const update = await collection.updateOne(
//                 { test: "data 2" },
//                 {
//                     // set update operator to specify values to update for the document fields.
//                     // more update operators here: https://www.mongodb.com/docs/manual/reference/operator/update/#update-operators
//                     $set: { test1: 15 },
//                 },
//                 { upsert: false }, // enable this option to insert a new document if no documents match the requested update document
//             );
//             if (update.modifiedCount == 0) {
//                 this.log(`${databaseName}/${collectionName} Updated 0 documents`);
//             } else {
//                 this.log(`${databaseName}/${collectionName} Updated 1 document`);
//             }
//         } finally {
//             await this.client.close();
//         }
//     }

//     public async countMany(databaseName: string, collectionName: string) {
//         try {
//             const database = this.client.db(databaseName);
//             const collection = database.collection(collectionName);
    
//             const update = await collection.updateMany(
//                 { test: "data 1" },
//                 {
//                     $set: { random_number: 100 * Math.random() },
//                 },
//                 { upsert: true },
//             );
//             this.log(`${databaseName}/${collectionName} Updated ${update.modifiedCount} documents`);
//         } finally {
//             await this.client.close();
//         }
//     }

// }

// export default DatabaseSession;