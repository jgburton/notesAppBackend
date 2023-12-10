import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient(); //modern data access layer 

app.use(express.json());
app.use(cors());

// get notes
app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

// create a new note
app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }
  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("Oops, something went wrong!");
  }
});

// update note
app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if(!title || !content){
    return res.status(400).send("title and content fields are required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong!");
  }
});

app.listen(5001, () => {
  console.log("server running on localhost:5001");
});
