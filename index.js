const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtkkw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());

// mongo db

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("connection err", err);
  const eventCollection = client.db("volunteer").collection("events");

  // get events from DB
  app.get("/events", (req, res) => {
    eventCollection.find().toArray((err, items) => {
      res.send(items);
      //   console.log("from database", items);
    });
  });

  // add event
  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event: ", newEvent);
    eventCollection.insertOne(newEvent).then((result) => {
      console.log("inserted count ", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  // delete event from db
  app.delete("/deleteEvent/:id", (req, res) => {
    const id = ObjectID(req.param.id);
    console.log("delete this", id);
    eventCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(!!documents.value));
  });

  console.log("DB connected");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
