
(function() {
    // initial data
    let data = [
        {
          "name": "Tyrion Lannister",
          "birthday": "12/02/1978"
        },
        {
          "name": "cersai Lannister",
          "birthday": "11/30/1975"
        },
        {
          "name": "Tyrion Lannister",
          "birthday": "12/02/1992"
        },{
          "name": "Tyrion Lannister",
          "birthday": "11/23/1996"
        },{
          "name": "Tyrion Lannister",
          "birthday": "12/03/1989"
        },{
          "name": "Tyrion Lannister",
          "birthday": "15/08/1992"
        },{
          "name": "Tyrion Lannister",
          "birthday": "12/01/1978"
        }
    ]
    // day mapping 
    const mapping = {
        0 : 'Sun',
        1 : 'Mon',
        2 : 'Tues',
        3 : 'Wed',
        4 : 'Thrus',
        5 : 'Fri',
        6 : 'Sat'
    }

    let year = 2020
    const textJsonContainer = document.getElementById('text-json')
    const yearInputContainer = document.getElementById('year-input')
    const updateContainer = document.getElementById('update')
    const cardContainer = document.getElementById('card-container')
    
    // on textbox change
    function onJsonChange(e) {
        try {
            data = JSON.parse(e.target.value)
            hideError(textJsonContainer)
            activeUpdate()
        } catch(err) {
            showError(textJsonContainer)
            disableUpdate()
        }
    }

    // removing error class for the element
    function hideError(el) {
        el.classList.remove("class", 'error-input')
    }

    // adding error class for the element
    function showError(el) {
        el.classList.add("class", 'error-input')
    }

    // disable update button if error in user input
    function disableUpdate() {
        updateContainer.disabled = true
        updateContainer.classList.remove('class', "btn-primary")
    }

    // enable update button 
    function activeUpdate() {
        updateContainer.disabled = false
        updateContainer.classList.add("class", "btn-primary");
    }

    // on year input box change
    function onYearInputChange(e) {
        const {value} = e.target
        if(value.match(/\d{4}/)) {
            year = value;
            activeUpdate()
            hideError(yearInputContainer)
        } else {
            showError(yearInputContainer)
            disableUpdate()
        } 
    }

    // calculate day for specific date
    function calculateDay(date) {
        return new Date(date).getDay()
    }

    // get initials for given name
    function getInitials(name) {
        return name.split(" ").map((x) => { return x.substring(0,1).toUpperCase();}).join('');
    }

    //sort an array by date
    function sortByDate(arr) {
         return arr.sort(function(o1,o2){
            return new Date(o2.birthday) - new Date(o1.birthday);
        });
    }

    // group by date
    function groupByDate(arr, year) {
        let newArr = []
        arr.forEach((obj, i) => {
            const {name, birthday} = obj;
            if(birthday && name) {
                let day = calculateDay(birthday.replace(/\d{4}/, year))
                let initials = getInitials(name)
                if(!isNaN(day)) {
                    if(newArr[day]) {
                        newArr[day].push(initials)
                    } else {
                        newArr[day] = [initials]
                    }
                }
            }   
        })
        for(let i=0; i< 7; i++) {
            if(!newArr[i]) {
                newArr[i] = []
            } 
        }
        return newArr
    }

    //template 
    function cardTemplate(dayArr, i) {
        return `<div class="card-section">
                    <div class="card">
                        <div class="card-header">
                            <p>${mapping[i]}</p> 
                        </div>
                        <div class="cal__day" style="grid-template-columns: repeat(${Math.ceil(Math.sqrt(dayArr.length))}, 1fr);grid-template-rows: repeat(${Math.ceil(Math.sqrt(dayArr.length))}, 1fr);">
                            ${dayArr.length > 0 ? dayArr.map((name, i) => 
                                `<div class="day__person label-color-${i%10}">
                                    <p>${name}</p>
                                </div>`).join('') : 
                                `<div class="day__empty label-no-data">
                                    <p>No Data</p>
                                </div>`
                            }
                        </div>
                    </div>
                    ${dayArr.length > 0 ? 
                        `<div class="card-footer">${dayArr.length} ${dayArr.length >1 ? 'birthdays' : 'birthday'}</div>` : 
                        `<div class="card-footer">No birthdays</div>`
                    }
                </div>`

    }

    // render card based ion user input
    function render() {
        cardContainer.innerHTML = ''
        const groupData = groupByDate(sortByDate(data), year)
        const html = groupData.map((dayArr, i) => cardTemplate(dayArr, i)).join('')
        cardContainer.insertAdjacentHTML('beforeend', html)
    }

    // on update button clicked
    function onUpdateHandler() {
        render()
    }


    function init() {
        textJsonContainer.value = JSON.stringify(data, undefined, 4);
        yearInputContainer.value = year;
        render()
        yearInputContainer.addEventListener('input', onYearInputChange)
        textJsonContainer.addEventListener('input', onJsonChange)
        updateContainer.addEventListener('click', onUpdateHandler)
    }

    init()
})()
