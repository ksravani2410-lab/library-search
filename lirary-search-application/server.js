
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const Book = mongoose.model("Book", new mongoose.Schema({
  title: String,
  author: String,
  category: String
}));

mongoose.connect("mongodb://127.0.0.1:27017/libraryDB")
  .then(async () => {
    console.log("MongoDB Connected");

    if (await Book.countDocuments() === 0) {
      await Book.insertMany([
        { title: "Wings of Fire", author: "A.P.J. Abdul Kalam", category: "Biography" },
        { title: "The Alchemist", author: "Paulo Coelho", category: "Fiction" },
        { title: "Introduction to Biology", author: "Campbell", category: "Science" },
        { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Finance" }
      ]);
      console.log("Sample books added");
    }
  })
  .catch(err => console.log(err));

app.get("/api/books", async (req, res) => {
  try {
    const q = req.query.q || "";
    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ]
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch books" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
