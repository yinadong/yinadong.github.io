
//Import data
const momaDataPromise = d3.csv('data/momadata.csv', parseMomaData)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));
//console.log(momaDataPromise);
const W = d3.select('.chart').node().clientWidth;
const H = d3.select('.chart').node().clientHeight;
const margin = {t:15, r:0, b:15, l:0};
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;

const svg = d3.select('.chart')
  .append('svg')
  .attr('width',w)
  .attr('height',h)
const plot = svg
  .append('g')
  .attr('transform', `translate(${margin.l}, ${margin.t})`);

let YEAR = 1940;

momaDataPromise.then(data => {
 
  const momaData = d3.nest()
              .key( d => d.year)
              .key( d => d.nationality)
              .key( d => d.medium)
              .key( d => d.gender)
              .key( d => d.artist)
              .entries(data);
    console.log(momaData);
 const indicators = momaData;
 console.log(indicators);
 console.log(YEAR);
 const indicatorsByYear = indicators
         .filter(d => d.key == YEAR)[0]
         .values;  //.filter(d => d.key === YEAR.toString())
 console.log(indicatorsByYear);
 
 DrawChart(indicatorsByYear, plot); 

d3.select("#selectButton")
      .selectAll('myOptions')
      .data(indicators)
      .enter()
      .append('option')
      .text(function (d) { return d.key; }) // text showed in the menu
      .attr("value", function (d) { return d.key; }) // corresponding value returned by the button

d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        const YEAR = d3.select(this).property("value")
        const indicatorsByYear = filterByYear(indicators, YEAR);
        // run the updateChart function with this selected option
        drawChart(indicatorsByYear, plot);
   })
d3.select('.chart2')
      .selectAll('.chart') //0 
      .data(indicatorsByYear)
      .enter()
      .append('div')
      .attr('class','chart')
      .classed('inline',true)
      .each(function(d){
        console.group()
        console.log(this);
        console.log(d);
        console.groupEnd();

        drawCharts(
          d, //array of 7
          this
        );
      })

});

function filterByYear(indicators, value){

  //filter indicators data by year...
  let indicatorsByYear = indicators.filter(function(d){
    return d.key == value
  });
  console.log(indicatorsByYear);
  
  return indicatorsByYear[0]
}

const tooltip = d3.select('.container')
  .append('div')
  .attr('class','tooltip')
  .style('position', 'absolute')
  .style('width', '180px')
  .style('min-height', '20px')
  .style('background', 'white')
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style('color', 'black')
  .style('padding', '5px')
  //.style('opacity', 0.5);
tooltip.append('div').attr('class', 'key')
tooltip.append('div').attr('class', 'value');


function enableTooltip(selection){
  selection
    .on('mouseenter', function(d){
      const xy = d3.mouse(d3.select('.container').node());
      tooltip
        .style('left', xy[0]+'px')
        .style('top', xy[1] + 20 +'px')
        .transition()
        .style('opacity', 0.9)
        
      tooltip
        .select('.key')
        .html(function() { if (d.depth == 5) {
        return "<strong>" + "<span style='color:black'>" + "MOMA Collections"+ "</strong>" + "<br>" 
        + "<span style='color:black'>" + "Year:" + d.data.year + "<br>"
        } else { return "<strong>" + "<span style='color:black'>" + "MOMA Collections"+ "</strong>" + "<br>"
          +"<span style='color:black'>" + "Key:" + d.data.key + "<br>"
        }
      })
        
      tooltip
        .select('.value')
        .html(function() { 
      if (d.depth == 5) {
        return "<span style='color:black'>" + "Title:" + d.data.title + "<br>";
    } else { 
        return "<span style='color:black'>" + "Value:" + d.data.values.length + "<br>";
    }
    })

    })
    .on ('mouseover', function(d) {
      tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "#404344")
      .style("stroke-width", "2px")
      .style("opacity", 1)
    })
    .on('mouseleave', function(d){
      tooltip
        .style('opacity',0)
        d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.5)
    });
}

function DrawChart(data, plot) {

  const rootNode = d3.hierarchy({
    key:'root',
    values:data}, 
  function(d){ return d.values });
  console.log(rootNode);
  const links = rootNode.links();
  const nodes = rootNode.descendants();

  console.log(links);
  console.log(nodes);

  const link = plot.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
        .attr("class","link")
        .attr("stroke","#c19a2e")
        .attr("stroke-width",0.15);

  const node = plot.selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
        .attr("class","node")
        .attr("r",2.5)
        .attr("fill", function(d) { 
          switch(d.depth){
                  //case 6: return '#a4d8e8';//#a4d8e8
                  case 5: return '#a4d8e8'; //#B49ED8
                  case 4: return '#B49ED8'; //#f7b8b4
                  case 3: return '#f7b8b4'; //#e2ae53
                  case 2: return '#e2ae53'; //#ef983b
                  case 1: return '#d3e29c'; //#7BC97B
                  case 0: return 'black'
               }
        })
       .call(enableTooltip);
      
  const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().links(links).distance(15).strength(1))
      .force("charge", d3.forceManyBody().strength(-45))
      .force("center", d3.forceCenter(W/2,H/2))
      .force("x", d3.forceX().x(500).strength(0.6))
      .force("y", d3.forceY().y(500).strength(0.6))
      .force("collide", d3.forceCollide(function(d) { 
        return d.type === 'character' ? 5 : 1; } 
    ).iterations(2)) 
      .alpha(1.5)
      .force('collision', d3.forceCollide().radius(function(d) {
    //return d.values.length
  }))
  
  simulation.nodes(nodes)
      .on("tick",ticked);
      //.aplha(1)

  function ticked() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
}

function drawChart(data, plot) {

  const rootNode = d3.hierarchy(data, function(d){ return d.values});
  console.log(rootNode);
  const links = rootNode.links();
  const nodes = rootNode.descendants();

  console.log(links);
  console.log(nodes);

  const link = plot.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
        .attr("class","link")
        .attr("stroke","#c19a2e")
        .attr("stroke-width",0.15);

  const node = plot.selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
        .attr("class","node")
        .attr("r",2.5)
        .attr("fill", function(d) { 
          switch(d.depth){
                  //case 6: return '#a4d8e8';//#a4d8e8
                  case 5: return '#a4d8e8'; //#B49ED8
                  case 4: return '#B49ED8'; //#f7b8b4
                  case 3: return '#f7b8b4'; //#e2ae53
                  case 2: return '#e2ae53'; //#ef983b
                  case 1: return '#d3e29c'; //#7BC97B
                  case 0: return 'black'
               }
        })
       .call(enableTooltip);
      
  const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().links(links).distance(15).strength(1))
      .force("charge", d3.forceManyBody().strength(-45))
      .force("center", d3.forceCenter(W/2,H/2))
      .force("x", d3.forceX().x(500).strength(0.6))
      .force("y", d3.forceY().y(500).strength(0.6))
      .force("collide", d3.forceCollide(function(d) { 
        return d.type === 'character' ? 5 : 1; } 
    ).iterations(2)) 
      .alpha(1.5)
      .force('collision', d3.forceCollide().radius(function(d) {
    //return d.values.length
  }))
  
  simulation.nodes(nodes)
      .on("tick",ticked);
      //.aplha(1)

  function ticked() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
}

function drawCharts(rawdata, rootDOM) {
  console.log(rawdata);
  let data = rawdata.values;
  const W = 600;
  //console.log(W);
  const H = 600;
  //console.log(H);

  const title = d3.select(rootDOM)
      .append('h3')
      .attr('class', 'text')
      console.log("title",data.key);
  const titleEnter = title
      .html(rawdata.key);
  //console.log(titleEnter);
  
  const svg = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H);

  const plot = svg.append('g')
    .attr('class','plot')
    .attr('transform', `translate(${margin.l}, ${margin.t})`);
  
  const rootNode = d3.hierarchy({
    key:'root',
    values:data}, 
  function(d){ return d.values });
  console.log(rootNode);
  const links = rootNode.links();
  const nodes = rootNode.descendants();

  console.log(links);
  console.log(nodes);

  const link = plot.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
        .attr("class","link")
        .attr("stroke","#c19a2e")
        .attr("stroke-width",0.15);

  const node = plot.selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
        .attr("class","node")
        .attr("r",2.5)
        .attr("fill", function(d) { 
          switch(d.depth){
                  //case 6: return '#a4d8e8';//#a4d8e8
                  case 4: return '#a4d8e8'; //#B49ED8
                  case 3: return '#B49ED8'; //#f7b8b4
                  case 2: return '#f7b8b4'; //#e2ae53
                  case 1: return '#e2ae53'; //#ef983b
                  //case 1: return '#d3e29c'; //#7BC97B
                  case 0: return 'black'
               }
        })
       .call(enableTooltip);
      
  const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().links(links).distance(15).strength(1))
      .force("charge", d3.forceManyBody().strength(-45))
      .force("center", d3.forceCenter(W/2, H/2))
      .force("x", d3.forceX().x(300).strength(0.6))
      .force("y", d3.forceY().y(300).strength(0.6))
      .force("collide", d3.forceCollide(function(d) { 
        return d.type === 'character' ? 5 : 1; } 
    ).iterations(2)) 
      .alpha(1.5)
      .force('collision', d3.forceCollide().radius(function(d) {
    //return d.values.length
  }))
  
  simulation.nodes(nodes)
      .on("tick",ticked);
      //.aplha(1)

  function ticked() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
}

function parseMomaData(d){
	//if(+d.Code >= 900) return; FOR each 

	//const migrationFlows = [];
	const moma = {};
	moma.title = d['Title'];
	moma.nationality = d['Nationality'].replace('(','').replace(')','');
	moma.gender = d['Gender'].replace('(','').replace(')',''); // replace: 2 ('') (','')
  moma.artist = d['Artist'];
  moma.medium = d ['Classification'];
  moma.year = d['Year'];

	return moma;
}