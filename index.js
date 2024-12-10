import express from "express";
import mongoose from "mongoose";

const app = express();

const MONGO_URI =
  "mongodb+srv://xjarifx:nca2aesv3fkEt8MA@cluster0.uh9xe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());

mongoose.connect(MONGO_URI);

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
});

const Item = mongoose.model("Item", itemSchema);

app.get("/items", async (req, res) => {
  res.json(await Item.find());
});

app.post("/items", async (req, res) => {
  const newItem = new Item({ ...req.body });
  await newItem.save();
  res.json({ msg: "posted" });
});

app.put("/items/:id", async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, req.body);
  res.json({ msg: "putted" });
});

app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ msg: "deleted" });
});

app.listen(3000);
