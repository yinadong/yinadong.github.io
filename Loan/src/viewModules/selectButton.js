import {select} from 'd3';
import {
	dataPromise
} from '../data';

export default function selectButton(){ 

dataPromise.then(data => {
	select("#selectButton")
	      .selectAll('myOptions')
	      .data(data)
	      .enter()
	      .append('option')
	      .html(function (d) { return d.key; }) // text showed in the menu
	      .attr("value", function (d) { return d.key; }) // corresponding value returned by the button
    });
}