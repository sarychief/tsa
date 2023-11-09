document.addEventListener('DOMContentLoaded', function() {
    // Загрузите и проанализируйте данные графа из файла .canvas
    fetch('Time_series_map.canvas')
        .then(response => response.json())
        .then(function(graphData) {
            // Создайте новый экземпляр sigma
            var s = new sigma('myGraph');

            // Добавьте узлы в граф sigma
            graphData.nodes.forEach(function(node, index) {
                s.graph.addNode({
                    id: node.id,
                    label: node.text,
                    x: node.x,
                    y: node.y,
                    size: 0.5,
                    color: 'blue'
                });
            });

            // Добавьте связи в граф sigma
            graphData.edges.forEach(function(edge, index) {
                s.graph.addEdge({
                    id: 'e' + index,
                    source: edge.fromNode,
                    target: edge.toNode,
                    color: 'black'
                });
            });

            // Обновите граф, чтобы отобразить добавленные узлы и связи
            s.refresh();

            // Добавьте обработчик событий на узлы графа
            s.bind('clickNode', function(e) {
                // Загрузите содержимое файла Markdown
                fetch(e.data.node.label)
                    .then(response => response.text())
                    .then(function(md) {
                        // Преобразуйте Markdown в HTML
                        var html = marked(md);
                        // Отобразите HTML на странице
                        document.getElementById('content').innerHTML = html;
                    });
            });

        }).catch(function(error) {
            console.log('Ошибка при загрузке или анализе данных графа: ', error);
        });
});
