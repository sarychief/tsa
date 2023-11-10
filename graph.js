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
                    size: 1,
                    color: 'lightblue'
                });
            });

            graphData.edges.forEach(function(edge, index) {
                s.graph.addEdge({
                    id: 'e' + index,
                    source: edge.fromNode,
                    target: edge.toNode,
                    size: 1, 
                    color: 'gray' 
                });
            });

            s.refresh();

            s.bind('clickNode', function(e) {
                var fileName = e.data.node.label;

                // Открываем новое окно браузера с именем файла в заголовке
                var newWindow = window.open("", fileName);

                // Загружаем содержимое .md файла в новое окно
                fetch('topics/' + fileName + '.md')
                    .then(response => response.text())
                    .then(function(md) {
                        var html = marked(md);
                        
                        // Добавляем небольшую задержку перед записью HTML
                        setTimeout(function() {
                            // Записываем HTML содержимое в новое окно
                            newWindow.document.write(html);
                        
                            // Обновляем MathJax для обработки математических формул
                            MathJax.typeset([newWindow.document.body]);
                        
                            // Обрабатываем изображения
                            var images = newWindow.document.querySelectorAll('img');
                            images.forEach(function(img) {
                                img.src = 'topics/' + fileName + '/' + img.getAttribute('src');
                            });
                        }, 100);
                    });
            });

        }).catch(function(error) {
            console.log('Ошибка при загрузке или анализе данных графа: ', error);
        });
});
