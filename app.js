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
        // удаление файла узла из топикс
        const fileName = req.params.fileName;

        const deleteResult = await DBCollections.topics.deleteOne({ filename: fileName });

        if (deleteResult.deletedCount === 1) {
            // удаление ребра и узла(ов) из графа
            // Найти узел по значению file в nodes
            const graphData = await DBCollections.graph.findOne();
            const deletedNode = graphData.data.nodes.find(node => node.file === `topics/${fileName}`);

            if (!deletedNode) {
                res.status(404).json({ error: 'Node not found' });
                return;
            }
            // Удаление узла из nodes
            const nodes = graphData.data.nodes.filter(node => node.id !== deletedNode.id);

            // Удаление связанных ребер из edges
            const edges = graphData.data.edges.filter(edge => edge.fromNode !== deletedNode.id && edge.toNode !== deletedNode.id);

            // Обновление графа в базе данных
            await DBCollections.graph.updateOne({}, { $set: { "data.nodes": nodes, "data.edges": edges } });
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
