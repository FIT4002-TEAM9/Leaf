import Worker from "../model/employee/Worker";
import DataObject from "./DataObject";

// Let's say we want to post a worker
// We create a new class, WorkerDataObject
// It inherits from DataObject
// It has a constructor, constructor(worker: Worker)
// In its constructor, it converts all the workers into json (itself)
// Then we can post it using the .data or .str methods
// We can also add a `restoreWorker` method to it which converts its internal json into a worker

// Even if we pull an array of workers at once from the database
// We just `DataObject.fromJSON(json)` it
// Then assuming we get an array of workers, we just call .getDataObjectArray("workers")
// Then call .map((worker) => worker.restoreWorker())

// TODO: It is worth considering making this with composition instead of inheritance
// So WorkerDataObject would have a DataObject property that it would add to and retrieve from
// That probably makes more sense...

/*
import { MongoClient } from "mongodb";

async function fetchSomeData() {
    const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; // replace with your connection string
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const collection = client.db("test").collection("devices"); // replace with your db and collection name
        const result = await collection.find({}).toArray(); // fetches all documents

        console.log(result);
    } finally {
        await client.close();
    }
}

fetchSomeData();
*/

class WorkerDataObject {
    private data = new DataObject();

    constructor() {}

    public serialiseWorker(worker: Worker) {
        // TODO: Serialise worker using this.data.addString() etc.
    }

    public restoreWorker(json: any): Worker {
        // TODO: Rebuild worker using this.data.getString() etc.
    }
}

export default WorkerDataObject;
