document.addEventListener('DOMContentLoaded', function() {
    fetch('Time_series_map.canvas')
        .then(response => response.json())
        .then(function(graphData) {
            var s = new sigma('myGraph');

            graphData.nodes.forEach(function(node, index) {
                var fileName = node.file ? node.file.replace(/^.*[\\\/]/, '').replace('.md', '') : node.text;
            
                s.graph.addNode({
                    id: node.id,
                    label: fileName,
                    x: node.x,
                    y: node.y,
                    size: 0.3,
                    color: 'lightblue'
                });
            });

            graphData.edges.forEach(function(edge, index) {
                s.graph.addEdge({
                    id: 'e' + index,
                    source: edge.fromNode,
                    target: edge.toNode,
                    size: 0.5, 
                    color: 'gray' 
                });
            });

            s.refresh();

            s.bind('clickNode', function(e) {
                fetch(e.data.node.label)
                    .then(response => response.text())
                    .then(function(md) {
                        var html = marked(md);
                        document.getElementById('content').innerHTML = html;
                    });
            });

        }).catch(function(error) {
            console.log('Ошибка при загрузке или анализе данных графа: ', error);
        });
});
