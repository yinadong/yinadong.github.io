import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import {select, max, dispatch} from 'd3';

import {
	dataPromise
} from './data';

import Chart from './viewModules/Chart';
import bubblechart from './viewModules/bubblechart';
import selectButton from './viewModules/selectButton';
import table from './viewModules/table';
import reasonlabels from './viewModules/reasonlabels';

let YEAR = 2009

dataPromise.then(data => {
  const dataByYear = data
      .filter(d => d.key == YEAR)[0]
      .values; 
    //console.log(dataByYear);
  renderbubblechart(dataByYear);
	});

function renderbubblechart(data){
	select('.chart')
		.each(function(){
			bubblechart(this, data);
		});
}

function renderchart(data){
	select('.chart')
		.each(function(){
			 Chart(this, data);
		});
}

selectButton();

select("#selectButton").on("change", function(d) {
        YEAR = this.value //select(this).property("value")
   dataPromise.then(data => {
		const dataByYear = data
         .filter(d => d.key == YEAR)[0]
         .values; 
   select(reasonlabels)
     .remove()
        //console.log(dataByYear);
	    renderbubblechart(dataByYear);
	    
	});     
});

//Buttons
select("#all").on('click', function(d){
       dataPromise.then(data => {
		const dataByYear = data
         .filter(d => d.key == YEAR)[0]
         .values; 
        //console.log(dataByYear);
	    renderbubblechart(dataByYear);
	    select(reasonlabels)
        .remove()
	});  

});

select("#reasons").on('click', function(d){
     dataPromise.then(data => {
		const dataByYear = data
         .filter(d => d.key == YEAR)[0]
         .values; 
        //console.log(dataByYear);
	    renderchart(dataByYear);
	});  
});
