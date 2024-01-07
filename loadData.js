const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function loadData() {
  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db('graph_db');

    // Коллекция для фотографий
    const photosCollection = database.collection('photos');
    // Коллекция для файлов Markdown
    const topicsCollection = database.collection('topics');
    // Коллекция для JSON-файла "graph-data"
    const graphDataCollection = database.collection('graph');

    // Обработка фотографий
    const photosFiles = fs.readdirSync(path.join(__dirname, 'photos'));
    await processFiles(photosFiles, 'photos', photosCollection);

    // Обработка файлов Markdown
    // const topicsFiles = fs.readdirSync(path.join(__dirname, 'topics'));
    const topicsFiles = fs.readdirSync(path.join(__dirname, 'public', 'topics_frontend'));
    await processFiles(topicsFiles, 'topics_frontend', topicsCollection);

    // Обработка JSON-файла "graph-data"
    const graphDataFilePath = path.join(__dirname, 'public', 'graph-data-frontend.json');
    if (fs.existsSync(graphDataFilePath)) {
      const jsonData = JSON.parse(fs.readFileSync(graphDataFilePath, 'utf-8'));
      await graphDataCollection.updateOne(
        { filename: 'graph-data.json' },
        { $set: { data: jsonData } },
        { upsert: true }
      );
      console.log('Data for "graph-data.json" updated/inserted into the database.');
    } else {
      console.error('File "graph-data.json" not found.');
    }

    console.log('Data loading completed.');
  } finally {
    await client.close();
    console.log('Connection to the database closed.');
  }
}
async function processFiles(files, folderName, collection) {
  if (files.length === 0) {
    console.error(`No files found in the "${folderName}" folder.`);
    return;
  }

  console.log(`Files to load for ${folderName}:`, files);

  for (const file of files) {

    if (file === '.DS_Store') {
      console.log(`Skipping ${file} in ${folderName}.`);
      continue;
    }

    const filePath = path.join(__dirname, 'public', folderName, file);
    const fileExtension = path.extname(filePath).toLowerCase();

    if (fileExtension === '.md') {
      const content = fs.readFileSync(filePath, 'utf-8');
      await collection.updateOne(
        { filename: file },
        { $set: { content: content } },
        { upsert: true }
      );
      console.log(`Data for "${file}" in ${folderName} updated/inserted into the database.`);
    } else if (fileExtension === '.json' && file === 'graph-data.json') {
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      await collection.updateOne(
        { filename: file },
        { $set: { data: jsonData } },
        { upsert: true }
      );
      console.log(`Data for "${file}" in ${folderName} updated/inserted into the database.`);
    } else if (fileExtension === '.jpg' || fileExtension === '.png') {
      const bytesBuffer = fs.readFileSync(path.join(__dirname, folderName, file));
      await collection.updateOne(
        { filename: file },
        { $set: { data: bytesBuffer } },
        { upsert: true }
      );
      console.log(`Processing photo: ${file}`);
    } else {
      console.warn(`Unsupported file type for "${file}". Skipping.`);
    }
  }
}

loadData();
