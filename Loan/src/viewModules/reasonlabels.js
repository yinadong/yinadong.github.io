import {select} from 'd3';

export default function reasonlabels(){

const W = 1000;
const H = select('.chart').node().clientHeight;
const margin = {t:10, r:10, b:10, l:10};
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;

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
    .attr('transform', `translate(${margin.l}, ${margin.t})`);

const home = ['home_improvement']
const business = ['small_business']
const energy = ['renewable_energy']
const purchase = ['major_purchase']
const debt = ['debt_consolidation']
const reasonlabels = ['debt','credit_card','house','car','other','vacation','home','small','purchase', 'medical','energy','moving', 'wedding','educational']
//console.log(reasonlabels);

 const label = select('.plot')
      .selectAll('.chart-label')
      .data(reasonlabels)
      .enter()
      .append('text')
      .text(d => d)
      .attr('font-size', 10)
      .attr('class','chart-label')
      .attr('x', function(d){
       if(d === 'debt'){
        return 10
       }else if (d === 'credit_card') {
        console.log(d)
        return 90
       }else if (d === 'house') {
        return 170
       }else if (d === 'car') {
        return 230
       }else if (d === 'other') {
        return 310
      } else if (d === 'vacation') { 
        return 390
      } else if (d === 'home') {
        return 470
      } else if (d === 'small') {
        return 540
      } else if (d === 'purchase') {
        return 610
      } else if (d === 'medical') {
        return 670
      } else if (d === 'energy') {
        return 730
      } else if (d === 'moving') {
        return 790
      } else if (d === 'wedding'){
        return 860
      } else if (true) {d === 'educational'}
        return 930
      })
      .attr('fill', '#525252')
      .attr('font-family', 'Gillsans')
      .attr('text-anchor', 'middle'); 

}
