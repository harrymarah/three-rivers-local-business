const checkbox = document.getElementById('flexCheckDefault')
const address = document.getElementById('address')
const county = document.getElementById('county')
const postcode = document.getElementById('postcode')

function toggleDisabled(){
    if(address.disabled === false){
        address.disabled = true;
        county.disabled = true;
        postcode.disabled = true;
        address.value = '';
        county.value = '';
        postcode.value = '';
    } else {
        address.disabled = false;
        county.disabled = false;
        postcode.disabled = false;
    }
}

function disableInputs(e) {
    if(checkbox.checked){
        address.disabled = true;
        county.disabled = true;
        postcode.disabled = true;
        address.value = '';
        county.value = '';
        postcode.value = '';
    } else null
}

checkbox.addEventListener('change', toggleDisabled, {once: false})

//Fixes bug that stops checkbox being check and inputs all enabled if user clicks back button after submitting business
window.addEventListener('load', disableInputs)
