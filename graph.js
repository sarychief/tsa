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

                var newWindow = window.open("", fileName);

                fetch('topics/' + fileName + '.md')
                    .then(response => response.text())
                    .then(function(md) {
                        
                        var updatedMd = md.replace(/\$(.*?)\$/g, "\\\\($1\\\\)");
                        var updatedMd2 = updatedMd.replace(/\$\$(.*?)\$\$/g, "\\\\[$1\\\\]");

                       // Find image references and replace them with the correct URL
                       updatedMd2 = updatedMd2.replace(/!\[\[(.*?)\]\]/g, function(match, p1) {
                           return '![Alt text](https://raw.githubusercontent.com/sarychief/tsa/main/photos/' + p1 + '" width="200" height="auto" />';
                       });

                        var html = marked(updatedMd2);
                        // var html = marked(md);
                        
                        setTimeout(function() {
                            newWindow.document.write(html);
                        
                            MathJax.typesetPromise([newWindow.document.body]).catch((err) => console.log(err.message));
                            
                            // Обрабатываем изображения
                            var images = newWindow.document.querySelectorAll('png');
                            images.forEach(function(img) {
                                // img.src = 'photos/' + fileName + '/' + img.getAttribute('src');
                                var imgSrc = img.getAttribute('src');
                                img.src = 'https://raw.githubusercontent.com/sarychief/tsa/main/photos/' + fileName + '/' + imgSrc;
                            });
                        }, 100);
                    });
            });

        }).catch(function(error) {
            console.log('Ошибка при загрузке или анализе данных графа: ', error);
        });
});
