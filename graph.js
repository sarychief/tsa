// Загрузите и проанализируйте данные графа из файла .canvas
d3.json('Time_series_map.canvas').then(function(graphData) {

    // Отображение узлов графа
    let nodes = d3.select('#myGraph').selectAll('circle')
        .data(graphData.nodes)
        .enter()
        .append('circle');

    nodes.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('r', 20)
        .style('fill', 'blue');

    // Отображение связей между узлами
    let edges = d3.select('#myGraph').selectAll('line')
        .data(graphData.edges)
        .enter()
        .append('line');

    edges.attr('x1', function(d) { return getNodeById(d.fromNode).x; })
        .attr('y1', function(d) { return getNodeById(d.fromNode).y; })
        .attr('x2', function(d) { return getNodeById(d.toNode).x; })
        .attr('y2', function(d) { return getNodeById(d.toNode).y; })
        .style('stroke', 'black')
        .style('stroke-width', 2);

    function getNodeById(id) {
        return graphData.nodes.find(node => node.id === id);
    }
}).catch(function(error) {
    console.log('Ошибка при загрузке или анализе данных графа: ', error);
});
