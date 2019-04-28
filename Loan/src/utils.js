import {nest, sum, mean} from 'd3';


function parseLoanDate(d){
  return {
    applicant_id:d.id,
    loan_amnt:+d.loan_amnt,
    int_rate:+d.int_rate,
    state:d.addr_state,
    annual_income:+d.annual_inc,
    grade:d.grade,
    year:+d.year,
    purpose:d.purpose,
    dti:+d.dti, 
    verification:d.verification_status // === "Verified"?Verified:Not Verified, //convert string to boolean
  }
}

export {
	parseLoanDate,
}