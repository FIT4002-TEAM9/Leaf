const { MongoClient, ServerApiVersion } = require("mongodb");
// URI for our MongoDB Altas host
const uri = "mongodb+srv://Leaf:LeafAdmin123@leafdata.etuw05p.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connect() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connection Success");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
connect().catch(console.dir);

// insert a single schemaless document (note specifying a schema is optional)
async function insert() {
    try {
        // name of the database in the cluster
        const database = client.db("Test");
        // name of the collection in the database
        const collection = database.collection("test");
        // insert data
        const result = await collection.insertOne({ test: "test_data" });
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}
insert().catch(console.dir);

// insert multiple documents into the same collection
async function insertMultiple() {
    try {
        // name of the database in the cluster
        const database = client.db("Test");
        // name of the collection in the database
        const collection = database.collection("test");
        // insert data
        const result = await collection.insertMany([
            { test: "data 1", test1: 1 },
            { test: "data 2", test1: 3 },
            { test: "data 3", test1: 3 },
        ]);
        console.log(`${result.insertedCount} documents were inserted`);
    } finally {
        await client.close();
    }
}
insertMultiple().catch(console.dir);

// find a single document
async function find() {
    try {
        const database = client.db("Test");
        const collection = database.collection("test");
        const entry = await collection.findOne({ test1: 1 });
        console.log(entry);
    } finally {
        await client.close();
    }
}
find().catch(console.dir);

// find multiple documents
async function findMultiple() {
    try {
        const database = client.db("Test");
        const collection = database.collection("test");
        const query = { test1: 3 };
        // cursors are objects that fetches a number of documents
        const cursor = collection.find(query).sort({ test: 1 }); // to sort ascending use 1, to sort descending use -1

        if ((await collection.countDocuments(query)) === 0) {
            console.warn("No documents found!");
        }
        // essentially a for each loop to print all documents stored in the cursor
        for await (const document of cursor) {
            console.dir(document);
        }
    } finally {
        await client.close();
    }
}
findMultiple().catch(console.dir);

// delete a single document
async function deleteDoc() {
    try {
        const database = client.db("Test");
        const collection = database.collection("test");
        // Query for a document
        const query = { test1: 1 };
        const result = await collection.deleteOne(query);
        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
        } else {
            console.log("No documents matched the query.");
        }
    } finally {
        await client.close();
    }
}
deleteDoc().catch(console.dir);

async function deleteMultiple() {
    try {
        const database = client.db("Test");
        const collection = database.collection("test");
        // delete
        const result = await collection.deleteMany({ test1: 3 });
        console.log("Deleted " + result.deletedCount + " documents");
    } finally {
        await client.close();
    }
}
deleteMultiple().catch(console.dir);

// counts the number of documents given a query
async function count() {
    try {
        const database = client.db("Test");
        const collection = database.collection("test");
        // define query
        const query = { test1: 3 };

        const count = await collection.countDocuments(query);
        console.log(`Document Count matching query: ${count}`);
    } finally {
        await client.close();
    }
}
count().catch(console.dir);

// update one document
async function updateOne() {
    try {
        const database = client.db("Test");
        const collection = database.collection("test");

        // define document to update. method will throw exception if the immutable field '_id' is part of the update attempt
        // similarily, method will throw a 'duplicate key error' if unique index rules are violated by the update
        const update = await collection.updateOne(
            { test: "data 2" },
            {
                // set update operator to specify values to update for the document fields.
                // more update operators here: https://www.mongodb.com/docs/manual/reference/operator/update/#update-operators
                $set: { test1: 15 },
            },
            { upsert: false }, // enable this option to insert a new document if no documents match the requested update document
        );
        console.log(`${update.modifiedCount} document(s) updated.`);
    } finally {
        await client.close();
    }
}
updateOne().catch(console.dir);

// update multiple documents
async function updateMultiple() {
    try {
        const database = client.db("Test");
        const collection = database.collection("test");

        const update = await collection.updateMany(
            { test: "data 1" },
            {
                $set: { random_number: 100 * Math.random() },
            },
            { upsert: true },
        );
        console.log(`${update.modifiedCount} document(s) updated.`);
    } finally {
        await client.close();
    }
}
updateMultiple().catch(console.dir);
