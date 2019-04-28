import {select, max, scaleOrdinal, scaleSqrt, mean,
	forceSimulation,
	forceX,
	forceY,
	forceCollide,
	scalePoint,
  rgb
} from 'd3';
import { enableTooltip } from './tooltip'
import table from './table'
import reasonlabels from './reasonlabels';

export default function Chart(rootDom, data){
  //console.log(data);
  const W = 1000;
  const H = select('.chart').node().clientHeight;
  const margin = {t:0, r:60, b:0, l:80};
  const w = W - margin.l - margin.r;
  const h = H - margin.t - margin.b;
  const scaleSize = scaleSqrt().range([1,50]);

  data.forEach(function(entery){
    var reason = entery.key;
    var value = 0;
    var year = 0;
    entery.values.forEach(function(val) {
      var state = val.key;
      value = val.values.length;
      val.value = value
      var int_rates = [];
      var dti = [];
      var annual_income = [];
      var loan_amnt = [];
      val.annual_income = annual_income
      val.dti = dti
      val.int_rate = int_rates
      val.loan_amnt = loan_amnt
      val.year = year
    val.values.forEach(function(dd) {
      int_rates.push(dd.int_rate);
      dti.push(dd.dti)
      annual_income.push(dd.annual_income)
      loan_amnt.push(dd.loan_amnt)
      year = dd.year
      });
    });
  })

  //console.log(data);
  const indicatorsByYear = [];
  data.forEach(function(d){
    
    let purpose = d.key;
    d.values.forEach(function(s){
      const datum = {};
      datum.key = purpose;
      datum.state = s.key;
      datum.year = s.year;
      datum.value = s.value;
      datum.int_rates = mean(s.int_rate);
      datum.dti = mean(s.dti);
      datum.annual_income = mean(s.annual_income);
      datum.loan_amnt = mean(s.loan_amnt);
      indicatorsByYear.push(datum);
    });
  console.log(indicatorsByYear);
  return indicatorsByYear; 
  });

  const indicator = indicatorsByYear

  const maxValue = max(indicator, d => d.value);
  //console.log(maxValue);
  scaleSize.domain([0, maxValue]);

  const fillColor = scaleOrdinal()
    .domain(['debt_consolidation','credit_card','house','car','other','vacation','home_improvement','small_business','major_purchase', 'medical','renewable_energy','moving', 'wedding','educational'])
    .range(['#e6beff','#42d4f4','#3cb44b','#bfef45','#ffe119','#f58231','#e6194B', '#808000','#ffd8b1','#4363d8','#a9a9a9','#9eb6ed','#e2b412', '#6ed8cb' ]);
 
  const svg = select('.chart')
    .selectAll('svg')
    .data([1]);
  const svgEnter = svg.enter()
    .append('svg');
  svgEnter.append('g')
    .attr('class','plot');
  
  const plot = svg.merge(svgEnter)
    .attr('width', W)
    .attr('height', H)
    .select('.plot')
    .attr('transform', `translate(${margin.l}, ${margin.t})`)
    .call(reasonlabels);
  
  const nodes = plot.selectAll('.node')
    .data(indicator, d => d.state);
  console.log(indicator);
  //console.log(nodes);
  nodes.exit().remove();

  const nodesEnter = nodes.enter()
    .append('g').attr('class','node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);
  nodesEnter.append('circle')
    .attr('stroke-width','2px')
    .attr('fill-opacity',.35)
    .attr('fill', d => fillColor(d.key))
    .attr('stroke', function (d) { return rgb(fillColor(d.key)).darker();})
    .call(enableTooltip);
   
  nodesEnter.append('text')
    .attr('text-anchor','middle');
  const nodesCombined = nodes.merge(nodesEnter);
  nodesCombined
    //.transition()
    .attr('transform', d => `translate(${d.x}, ${d.y})`);
  nodesCombined
    .select('circle')
    .transition()
    .attr('r', d => scaleSize(d.value));
  nodesCombined
    .select('text')
    .filter(d => scaleSize(d.value)>25)
    .text(d => d.state);
  nodesCombined.on("click", d => {
    table(d);
  })

  const xPosition = scalePoint()
        .domain(['debt_consolidation','credit_card','house','car','other','vacation','home_improvement','small_business','major_purchase', 'medical','renewable_energy','moving', 'wedding','educational'])
        .range([margin.l,W - margin.r])

  const force_x = forceX().x(function(d){ 
    return xPosition(d.key)
  }).strength(1); 

  const force_y = forceY().y(d => h/2);
  const force_collide = forceCollide(d => scaleSize(d.value));

  //combine the forces into a simulation
  const simulation = forceSimulation()
    .force('x', force_x)
    .force('y', force_y)
    .force('collide', force_collide);
  simulation.nodes(indicator)
    .on('tick', () => {
      nodesCombined
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    })
    .restart()
  
  function isolate(force, filter) {
        var initialize = force.initialize;
        force.initialize = function() { initialize.call(force, indicator.filter(filter)); };
        return force;
    }
};