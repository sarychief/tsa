document.addEventListener('DOMContentLoaded', function() {
    fetch('Time_series_map.canvas')
        .then(response => response.json())
        .then(function(graphData) {
            var s = new sigma('myGraph');

            s.settings({
                labelRenderer: function(node, context, settings) {
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
                            // MathJax.typeset([newWindow.document.body]);
                            MathJax.typesetPromise([newWindow.document.body]).catch((err) => console.log(err.message));
                            
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
