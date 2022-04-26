Date.prototype.toDateInputValue = (function() {
    let local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

let date = document.querySelector('#date')
date.value = new Date().toDateInputValue();

let currFirstValue = document.querySelector('#currFirstValue')
let currSecondValue = document.querySelector('#currSecondValue')
let currency_1 = document.querySelector('#currFirstName')
let currency_2 = document.querySelector('#currSecondName')
let button = document.querySelector('button')
let valueUsd;
let valueEur;

button.addEventListener('click', function (e) {
    let currentDate = date.value

    fetch(`https://www.nbrb.by/api/exrates/rates/USD?parammode=2&ondate=${currentDate}`)
        .then(response => response.json())
        .then(response => response.Cur_OfficialRate)
        .then(res => {
            valueUsd = +res.toFixed(2)
            exchange()
        })

    fetch(`https://www.nbrb.by/api/exrates/rates/EUR?parammode=2&ondate=${currentDate}`)
        .then(response => response.json())
        .then(response => response.Cur_OfficialRate)
        .then(res => {
            valueEur = +res.toFixed(2)
            exchange()
        })
 })

function exchange() {
    if (parseFloat(currFirstValue.value) < 0 || isNaN(parseFloat(currFirstValue.value))) {
        currSecondValue.value = 0
    } else if (currency_1.value === currency_2.value) {
        currSecondValue.value = currFirstValue.value
    } else if (currency_1.value === 'usd' && currency_2.value === 'byn') {
        currSecondValue.value = currFirstValue.value * valueUsd
    } else if (currency_1.value === 'eur' && currency_2.value === 'byn') {
        currSecondValue.value = currFirstValue.value * valueEur
    } else if (currency_1.value === 'byn' && currency_2.value === 'usd') {
        currSecondValue.value = (currFirstValue.value / valueUsd).toFixed(2)
    } else if (currency_1.value === 'byn' && currency_2.value === 'eur') {
        currSecondValue.value = (currFirstValue.value / valueEur).toFixed(2)
    } else if (currency_1.value === 'usd' && currency_2.value === 'eur') {
        currSecondValue.value = (currFirstValue.value * valueUsd / valueEur).toFixed(2)
    } else if (currency_1.value === 'eur' && currency_2.value === 'usd') {
        currSecondValue.value = (currFirstValue.value * valueEur / valueUsd).toFixed(2)
    }
}

