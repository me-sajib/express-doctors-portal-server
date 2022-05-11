const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r7db4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const doctorCollection = client
      .db(process.env.DB_NAME)
      .collection(process.env.DB_COLLECTION);
    const userAppointmentCollection = client
      .db(process.env.DB_NAME)
      .collection(process.env.DB_BOOKING_COLLECTION);

    app.get("/treatment", async (req, res) => {
      const cursor = doctorCollection.find({});
      const treatments = await cursor.toArray();
      res.send(treatments);
    });

    app.post("/addAppointment", async (req, res) => {
      const userData = req.body;
      const user = await userAppointmentCollection.insertOne(userData);
      res.send(user);
    });
  } catch {}
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
