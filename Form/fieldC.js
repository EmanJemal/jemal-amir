const firstDiv = document.querySelector('.customer-info');
const nameCustomer = document.querySelector('.name-customer');
const nationality = document.querySelector('.nationality-lable input')
const age = document.querySelector('.age-lable input')
const dobLable = document.querySelector('.dob-lable input')
const daysLable = document.querySelector('.days-lable input')
const finallDay = document.querySelector('.final-days-lable input');
const sexLable = document.getElementById('sex-options');



nameCustomer.addEventListener('input', () => {

    // Check if the input value has more than 0 characters
    if (sexLable.value === 'female' || sexLable.value === 'male' && finallDay.value.length > 0 && daysLable.value.length > 0 && dobLable.value.length>0 && nameCustomer.value.length > 0 && nationality.value.length >0 && age.value.length > 0) {
        firstDiv.style.borderColor = "#fc6b13";
        firstDiv.style.borderWidth = "5px";
    } else {
        firstDiv.style.borderColor = ""; // This clears the border color
    }

});


nationality.addEventListener('input', () => {

    // Check if the input value has more than 0 characters
    if (sexLable.value === 'female' || sexLable.value === 'male' && finallDay.value.length > 0 && daysLable.value.length > 0 && dobLable.value.length>0 && nameCustomer.value.length > 0 && nationality.value.length >0 && age.value.length > 0) {
        firstDiv.style.borderColor = "#fc6b13";
        firstDiv.style.borderWidth = "5px";
    } else {
        firstDiv.style.borderColor = ""; // This clears the border color
    }
    
});


age.addEventListener('input', () => {

    // Check if the input value has more than 0 characters
    if (sexLable.value === 'female' || sexLable.value === 'male' && finallDay.value.length > 0 && daysLable.value.length > 0 && dobLable.value.length>0 && nameCustomer.value.length > 0 && nationality.value.length >0 && age.value.length > 0) {
        firstDiv.style.borderColor = "#fc6b13";
        firstDiv.style.borderWidth = "5px";
    } else {
        firstDiv.style.borderColor = ""; // This clears the border color
    }
    
});


dobLable.addEventListener('change', () => {

    // Check if the input value has more than 0 characters
    if (sexLable.value === 'female' || sexLable.value === 'male' && finallDay.value.length > 0 && daysLable.value.length > 0 && dobLable.value.length>0 && nameCustomer.value.length > 0 && nationality.value.length >0 && age.value.length > 0) {
        firstDiv.style.borderColor = "#fc6b13";
        firstDiv.style.borderWidth = "5px";
    } else {
        firstDiv.style.borderColor = ""; // This clears the border color
    }
    
});


daysLable.addEventListener('input', () => {

    // Check if the input value has more than 0 characters
    if (sexLable.value === 'female' || sexLable.value === 'male' && finallDay.value.length > 0 && daysLable.value.length > 0 && dobLable.value.length>0 && nameCustomer.value.length > 0 && nationality.value.length >0 && age.value.length > 0) {
        firstDiv.style.borderColor = "#fc6b13";
        firstDiv.style.borderWidth = "5px";
    } else {
        firstDiv.style.borderColor = ""; // This clears the border color
    }
    
});


finallDay.addEventListener('change', () => {

    // Check if the input value has more than 0 characters
    if (sexLable.value === 'female' || sexLable.value === 'male' && finallDay.value.length > 0 && daysLable.value.length > 0 && dobLable.value.length>0 && nameCustomer.value.length > 0 && nationality.value.length >0 && age.value.length > 0) {
        firstDiv.style.borderColor = "#fc6b13";
        firstDiv.style.borderWidth = "5px";
    } else {
        firstDiv.style.borderColor = ""; // This clears the border color
    }
    
});



