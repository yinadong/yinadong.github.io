import {select, format} from 'd3';

export default function table(data){

console.log(data);

select('.table')
  .remove();

//Build table
const table = select('#table')
  .append('table')
  .attr('class','table');

table.append('thead')
  .attr('class','thead-dark')
  .append('tr')
  .selectAll('th')
  .data(['year','state','key', 'value','loan_amnt', 'int_rates', 'dti', 'annual_income'])
  .enter()
  .append('th')
  .html(function(d){return d;});

const rows = table.append('tbody')
  .selectAll('tr')
  .data([data])
  .enter()
  .append('tr');

rows.append('td')
  .html(function(d){return d.year})
rows.append('td')
  .html(function(d){return d.state})
rows.append('td')
  .html(function(d){return d.key})
rows.append('td')
  .html(function(d){return d.value})  
rows.append('td')
  .html(function(d){return format(".2f")(d.loan_amnt)})
rows.append('td')
  .html(function(d){return format('.1%')(d.int_rates)})
rows.append('td')
  .html(function(d){return format(".2f")(d.dti)})
rows.append('td')
  .html(function(d){return format(".2f")(d.annual_income)})
}