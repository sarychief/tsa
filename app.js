const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Изменим импорт
const { connectToDatabase, DBCollections } = require('./db');
const { log } = require('console');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/graph-data', async (req, res) => {
    try {
        const graphData = await DBCollections.graph.findOne();
        res.json(graphData.data);
    } catch (error) {
        console.error('Error fetching graph data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/topics/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        // const fileText = await !REQUEST_TO_MONGO!;
        const file = await DBCollections.topics.findOne({ filename: fileName });
        if (!file) {
            res.send('File ' + fileName + ' not found');
            return;
        }
        res.send(file.content);
    } catch (error) {
        console.error('Error fetching file data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/topics/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const deleteResult = await DBCollections.topics.deleteOne({ filename: fileName });
        if (deleteResult.deletedCount === 1) {
            // TODO: ТУТ НАДО УДАЛИТЬ ЭТОТ УЗЕЛ ИЗ ГРАФА)1 ЕБИСЬ))
            res.status(200).end();
            return;
        }
        res.status(418).json({ error: 'File cannot be deleted' });
    } catch (error) {
        console.error('Error fetching file data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/photos/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const file = await DBCollections.photos.findOne({ filename: fileName });
        res.type('png');
        const binaryData = new Uint8Array(file.data.buffer);
        res.end(binaryData, 'binary');
    } catch (error) {
        console.error('Error fetching file data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('*', async(req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    if (!await connectToDatabase())
        throw Error();
    console.log(`Server is running on http://localhost:${PORT}`);
});
