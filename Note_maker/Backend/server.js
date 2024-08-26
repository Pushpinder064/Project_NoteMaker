// import mongoose from 'mongoose';
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';

// const { connect, model, connection } = mongoose;

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB Atlas
// const dbURI = "mongodb+srv://spushpinder064:NsHaGDRggcLAZsRM@cluster0.txjovdj.mongodb.net/";
// connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// // Define Note model
// const Note = model('Note', {
//     title: String,
//     content: String,
// });

// // Listen for successful MongoDB connection
// connection.on('connected', () => {
//     console.log('Connected to MongoDB Atlas');
// });

// // Listen for MongoDB connection errors
// connection.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
// });

// // Routes
// app.get('/', (req, res) => {
//     res.send('Hello, this is the root!');
// });

// app.get('/api/notes', async (req, res) => {
//     try {
//         const notes = await Note.find();
//         res.json(notes);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Update Note by ID
// app.put('/api/notes/:id', async (req, res) => {
//     const { title, content } = req.body;
//     const noteId = req.params.id;

//     try {
//         const updatedNote = await Note.findByIdAndUpdate(
//             noteId,
//             { title, content },
//             { new: true }
//         );
//         res.json(updatedNote);
//     } catch (error) {
//         res.status(404).json({ message: 'Note not found' });
//     }
// });

// // Delete Note by ID
// app.delete('/api/notes/:id', async (req, res) => {
//     const noteId = req.params.id;

//     try {
//         await Note.findByIdAndDelete(noteId);
//         res.json({ message: 'Note deleted successfully' });
//     } catch (error) {
//         res.status(404).json({ message: 'Note not found' });
//     }
// });

// app.post('/api/notes', async (req, res) => {
//     const { title, content } = req.body;

//     const note = new Note({ title, content });

//     try {
//         const newNote = await note.save();
//         res.status(201).json(newNote);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { connect, model, connection } = mongoose;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
const dbURI = process.env.MONGO_URI;
connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Note model
const Note = model('Note', {
    title: String,
    content: String,
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello, this is the root!');
});

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Note by ID
app.put('/api/notes/:id', async (req, res) => {
    const { title, content } = req.body;
    const noteId = req.params.id;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Note by ID
app.delete('/api/notes/:id', async (req, res) => {
    const noteId = req.params.id;

    try {
        const result = await Note.findByIdAndDelete(noteId);
        if (!result) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/notes', async (req, res) => {
    const { title, content } = req.body;
    const note = new Note({ title, content });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
