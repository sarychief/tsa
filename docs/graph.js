class API_class {
    constructor(basePath) {
        this.basePath = basePath ? basePath : location.origin;
    }
    
    async _request(method, path, isText=false) {
        const res = await (fetch(this.basePath + path, {method: method, mode: 'cors', credentials: 'include'}));
        if (isText) {
            return res.text();
        }
        return res.json();
    }
    get(path, isText=false) {
        return this._request('GET', path, isText);
    }
    post(path, isText=false) {
        return this._request('POST', path, isText);
    }
    put(path, isText=false) {
        return this._request('PUT', path, isText);
    }
    delete(path, isText=false) {
        return this._request('DELETE', path, isText);
    }
}
const API = new API_class('.');
// const graphData = await API.get('/graph-data-frontend.json');
import graphData from './graph-data-frontend.js';
console.log(graphData.nodes);

document.addEventListener('DOMContentLoaded', async () => {
    const Elements = {
        fileTextContainer: document.getElementById('file-text-container'),
        fileText: document.getElementById('file-text'),
    }
    let selectedFileName;//= location.pathname.replace(/^\//g, '');
    // console.log(selectedFileName);
    // if (selectedFileName === '' || selectedFileName === '/') {
    //     selectedFileName = null;
    // } else {
    //     showFile(selectedFileName);
    // }
    // console.log(selectedFileName);

    // const graphData = await API.get('/graph-data');
    var s = new sigma('myGraph');

    s.settings({
        labelRenderer(node, context, settings) {
            var fontSize = (settings.labelSize === 'fixed') ? settings.defaultLabelSize : settings.labelSize * node.size;
            var prefix = settings('prefix') || '';
            var size = node[prefix + 'size'];
            if (size < settings('labelThreshold')) return;

            context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') + fontSize + 'px ' + (settings('font') || 'serif');
            context.fillStyle = node.color || settings('defaultNodeColor');

            // Set background color
            context.fillRect(
                Math.round(node[prefix + 'x'] - fontSize / 2 - 2), 
                Math.round(node[prefix + 'y'] - fontSize / 2 - 2),
                context.measureText(node.label).width + 4,
                fontSize + 4
            );

            // Now draw the text
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = 'black';
            context.fillText(
                node.label,
                Math.round(node[prefix + 'x']),
                Math.round(node[prefix + 'y'])
            );
        }
    });

    graphData.nodes.forEach((node, index) => {
        var fileName = node.file ? node.file.replace(/^.*[\\\/]/, '').replace('.md', '') : node.text;

        s.graph.addNode({
            id: node.id,
            label: fileName,
            x: node.x,
            y: node.y,
            size: 1,
            color: 'red',
        });
    });

    graphData.edges.forEach((edge, index) => {
        s.graph.addEdge({
            id: 'e' + index,
            source: edge.fromNode,
            target: edge.toNode,
            size: 1, 
            color: 'gray',
        });
    });

    s.refresh();

    async function showFile(fileName) {
        selectedFileName = fileName;
        saveSelectedFileName();

        // Проверка существования файла перед загрузкой
        let md = await API.get(`/topics_frontend/${selectedFileName}`, true);
        console.log('md:', md)
        md = md.replace(/\$(.*)\$/g, "\\\\($1\\\\)");
        md = md.replace(/\!\[.*\]\((.+)\)/g, "![](/photos/$1)");
        md = md.replace(/\!\[\[(.+)\]\]/g, "![](/photos/$1)");
        Elements.fileText.innerHTML = marked(md); 
        MathJax.typesetPromise([Elements.fileText]);
        Elements.fileTextContainer.classList.add('shown');
    }

    s.bind('clickNode', (e) => {
        const fileName = e.data.node.label;
        showFile(fileName + '.md');
    });

    document.querySelector('#file-text-container .button-close').addEventListener('click', () => {
        Elements.fileTextContainer.classList.remove('shown');
    });

    document.querySelector('#file-text-container .button-delete-file').addEventListener('click', () => {
        API.delete(`/topics/${selectedFileName}`, true);
        selectedFileName = null;
        saveSelectedFileName();
        Elements.fileTextContainer.classList.remove('shown');
    });

    function saveSelectedFileName() {
        // if (!selectedFileName) {
        //     window.history.pushState(null, 'Home', '/');
        //     return;
        // }
        // window.history.pushState(null, 'File - ' + selectedFileName, location.origin + '/' + selectedFileName);
    }
});
