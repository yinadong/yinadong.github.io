import {
	parseLoanDate
} from './utils';

import {csv,nest,mean} from 'd3';

const dataPromise = csv('./data/loandata.csv', parseLoanDate)
  .then(data => {    

  const loanbyYear = nest()
    .key(d => d.year)
    .key(d => d.purpose)
    .key(d => d.state)
    .entries(data)
  
  console.log(loanbyYear);
  return loanbyYear;
});
console.log(dataPromise);

export {
	dataPromise,
}


