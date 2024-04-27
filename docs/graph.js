
class API_class {
    constructor(basePath) {
        this.basePath = basePath ? basePath : location.origin;
    }

    async _request(method, path, isText=false) {
        const res = await fetch(this.basePath + path, {method: method, mode: 'cors', credentials: 'include'});
        if (!res.ok) {
            throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
        }
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
// import graphData from './graph-data-frontend.canvas';
import graphData from './graph-data-frontend.js';
console.log(graphData.nodes);

document.addEventListener('DOMContentLoaded', async () => {
    const Elements = {
        fileTextContainer: document.getElementById('file-text-container'),
        fileText: document.getElementById('file-text'),
    };
    let selectedFileName;

    const graphContainer = document.getElementById('myGraph');
    const s = new sigma({ container: graphContainer });

    sigma.plugins.dragNodes(s, s.renderers[0]);

    anime({
        targets: '#myGraph',
        opacity: [0, 1],
        easing: 'easeInOutQuad',
        duration: 1000,
    });

    s.bind('startdrag', function(event) {
        if (event.data.node) {
            const draggedNodeId = event.data.node.id;
            const draggedNode = s.graph.nodes(draggedNodeId);

            // Получаем все рёбра, связанные с перетаскиваемым узлом
            const edges = s.graph.edges().filter(edge => {
                return edge.source === draggedNodeId || edge.target === draggedNodeId;
            });

            // Перемещаем каждый связанный узел и ребро
            edges.forEach(edge => {
                const connectedNodeId = edge.source === draggedNodeId ? edge.target : edge.source;
                const connectedNode = s.graph.nodes(connectedNodeId);

                // Перемещаем узел
                connectedNode.x = draggedNode.x;
                connectedNode.y = draggedNode.y;

                // Если узел уже был перемещен, то обновляем его позицию на графе
                if (connectedNode.renderData && connectedNode.renderData.node) {
                    connectedNode.renderData.node.refresh();
                }

                // Если узел перемещается впервые, то добавляем его на граф
                if (!connectedNode.renderData) {
                    s.graph.addNode(connectedNode);
                }

                // Обновляем ребро
                const renderedEdge = s.graph.edges(edge.id);
                renderedEdge.refresh();
            });

            // Обновляем граф
            s.refresh();
        }
    });

    

    s.settings({
        labelRenderer(node, context, settings) {
            var fontSize = (settings.labelSize === 'fixed') ? settings.defaultLabelSize : settings.labelSize * node.size;
            var prefix = settings('prefix') || '';
            var size = node[prefix + 'size'];
            if (size < settings('labelThreshold')) return;

            context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') + fontSize + 'px ' + (settings('font') || 'serif');
            context.fillStyle = node.color || settings('defaultNodeColor');

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

    async function animateNodeAppearance(nodeId) {
        await anime({
            targets: `.sigma-node[id="${nodeId}"]`,
            translateY: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 1000,
        }).finished;
    }
    
    async function animateEdgeAppearance(edgeId) {
        await anime({
            targets: `.sigma-edge[id="e${edgeId}"]`,
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 1000,
        }).finished;
    }

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

    s.refresh(() => {
        anime({
            targets: '.sigma-node',
            translateY: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 1000,
            delay: anime.stagger(100),
        });
    
        // Анимация появления ребер
        anime({
            targets: '.sigma-edge',
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 1000,
            delay: anime.stagger(100),
        });
    });

    async function animateNodeAppearance(nodeId) {
        await anime({
            targets: `.sigma-node[id="${nodeId}"]`,
            translateY: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 1000,
        }).finished;
    }
    
    async function animateEdgeAppearance(edgeId) {
        await anime({
            targets: `.sigma-edge[id="e${edgeId}"]`,
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 1000,
        }).finished;
    }

    async function showFile(fileName) {
        selectedFileName = fileName;
        saveSelectedFileName();
    
        try {
            // Попытка загрузки файла
            let md = await API.get(`/topics_frontend/${selectedFileName}`, true);
            console.log('md:', md)
            md = md.replace(/\$\$(.*?)\$\$/g, "\\\\[$1\\\\]"); // замена $$ формул на \[ \]
            md = md.replace(/\$(.*?)\$/g, "\\\\($1\\\\)"); // замена $ формул на \( \)
            md = md.replace(/\!\[.*\]\((.+)\)/g, "![](/photos/$1)"); // замена изображений на правильные пути
            md = md.replace(/\!\[\[(.+)\]\]/g, "![](/photos/$1)");
            Elements.fileText.innerHTML = marked(md); 
            MathJax.typesetPromise([Elements.fileText]);
            Elements.fileTextContainer.classList.add('shown');
        } catch (error) {
            // Если возникла ошибка, выводим сообщение "Пока не написано :("
            console.error('Ошибка загрузки файла:', error);
            Elements.fileText.innerHTML = "Пока не написано :(";
            Elements.fileTextContainer.classList.add('shown');
        }
    }
    
    


    s.bind('clickNode', (e) => {
        const fileName = e.data.node.label;
        showFile(fileName + '.md');
    });

    document.querySelector('#file-text-container .button-close').addEventListener('click', () => {
        Elements.fileTextContainer.classList.remove('shown');
    });

    document.addEventListener('touchmove', (event) => {
        // Обработка события touchmove
    }, { passive: true });

    // document.querySelector('#file-text-container .button-delete-file').addEventListener('click', () => {
    //     API.delete(`/topics/${selectedFileName}`, true);
    //     selectedFileName = null;
    //     saveSelectedFileName();
    //     Elements.fileTextContainer.classList.remove('shown');
    // });

    function saveSelectedFileName() {
        // if (!selectedFileName) {
        //     window.history.pushState(null, 'Home', '/');
        //     return;
        // }
        // window.history.pushState(null, 'File - ' + selectedFileName, location.origin + '/' + selectedFileName);
    }
});
