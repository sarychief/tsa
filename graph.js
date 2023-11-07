var chart = c3.generate({
   data: {
       nodes: [
           {id: "node1", label: "Node 1"},
           {id: "node2", label: "Node 2"},
           // Добавьте больше узлов по мере необходимости
       ],
       links: [
           {source: "node1", target: "node2"},
           // Добавьте больше связей по мере необходимости
       ]
   },
   type: 'graph',
   name: 'Graph',
   draggable: true,
   zoomable: true,
});


// d3.json("Time_series_map.canvas").then(function(data) {
//    var svg = d3.select("#myGraph"),
//        width = +svg.attr("width"),
//        height = +svg.attr("height");

//    var simulation = d3.forceSimulation()
//        .force("link", d3.forceLink().id(function(d) { return d.id; }))
//        .force("charge", d3.forceManyBody())
//        .force("center", d3.forceCenter(width / 2, height / 2));
   
//    var link = svg.append("g")
//        .attr("class", "links")
//        .selectAll("line")
//        .data(data.edges)
//        .enter().append("line");

//    var node = svg.append("g")
//        .attr("class", "nodes")
//        .selectAll("rect") // change this to "rect" to match the structure of your nodes
//        .data(data.nodes)
//        .enter().append("rect") // change this to "rect" to match the structure of your nodes
//        .attr("width", function(d) { return d.width; }) // set the width of the rectangles
//        .attr("height", function(d) { return d.height; }) // set the height of the rectangles
//        .call(d3.drag()
//            .on("start", dragstarted)
//            .on("drag", dragged)
//            .on("end", dragended));
   
//    node.append("title")
//        .text(function(d) { return d.id; });

//    simulation
//        .nodes(data.nodes)
//        .on("tick", ticked);

//    simulation.force("link")
//        .links(data.edges);

//    function dragstarted(d) {
//        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//        d.fx = d.x;
//        d.fy = d.y;
//    }

//    function dragged(d) {
//        d.fx = d3.event.x;
//        d.fy = d3.event.y;
//    }

//    function dragended(d) {
//        if (!d3.event.active) simulation.alphaTarget(0);
//        d.fx = null;
//        d.fy = null;
//    }

//    function ticked() {
//       link
//           .attr("x1", function(d) { return d.source ? d.source.x : 0; })
//           .attr("y1", function(d) { return d.source ? d.source.y : 0; })
//           .attr("x2", function(d) { return d.target ? d.target.x : 0; })
//           .attr("y2", function(d) { return d.target ? d.target.y : 0; });
   
//       node
//           .attr("x", function(d) { return d ? d.x : 0; })
//           .attr("y", function(d) { return d ? d.y : 0; });
//    }

// }).catch(function(error) {
//    console.log(error);
// });
