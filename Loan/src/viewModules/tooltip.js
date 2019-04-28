import{select, mouse} from 'd3';

const tooltip = select('.container')
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
  .style('padding', '10px')
  //.style('opacity', 0.5);
tooltip.append('div').attr('class', 'key')
tooltip.append('div').attr('class', 'value');


function enableTooltip(selection){
  selection
    .on('mouseenter', function(d){
      const xy = mouse(select('.container').node());
      tooltip
        .style('left', xy[0]+'px')
        .style('top', xy[1] + 20 +'px')
        .transition()
        .style('opacity', 0.9)
        
       tooltip
        .select('.key')
        .html("<strong>" + "<span style='color:black'>" + "Loan Reason" + "</strong>" + "<br>"
          + "<span style='color:black'>" + "Year:" + d.year + "<br>"
          + "<span style='color:black'>" + "Reason:" + d.key + "<br>");
        
      tooltip
        .select('.value')
        .html("<span style='color:black'>" + "Values:"+ d.value + "<br>"
          + "<span style='color:black'>" + "State:" + d.state + "<br>")
    })
    .on ('mouseover', function(d) {
      tooltip
        .style("opacity", 1)
        select(this)
        .style("stroke", "#404344")
        .style("stroke-width", "2.5px")
        .style("opacity", 1)
      })
     .on('mouseleave', function(d){
      tooltip
        .style('opacity',0)
        select(this)
        //.style("stroke", "none")
        .style("opacity", 0.5)
      });
  return enableTooltip;
}

export {
  enableTooltip
}