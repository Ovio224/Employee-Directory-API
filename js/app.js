/**
 * Fetches data from the API, parses it, generates the HTML, adds an
 * event listener for each div card
 */
fetch("https://randomuser.me/api/1.2/?results=12&nat=us&format=json&exc=login,id,registered")
    .then(checkStatus)
    .then(result => result.json())
    .then(result => generateEmployees(result))
    .then(function () {
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('click', popUp)
        }); // ends forEach
    })
    .then(function () {
        searchbox.addEventListener('keyup', search);
    })
    .catch(err => console.error('This is the error -> ' + err));

/**
 * HELPER FUNCTIONS
 */
// Capitalize function for the street name
String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};
/**
 * Checks if the Promise returns either resolve or reject
 * @param {Promise} response - the response retrieved from the Promise
 */
function checkStatus(response) {
    if (response.ok === true) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
/**
 *  Generates the HTML for the employees and appends it
 * @param {Object} data - the retrieved JSON data from the API 
 */
function generateEmployees(data) {
    const employees = data.results.map(employee => `
    <div class="card">
    <div class="card-img-container">
        <img class="card-img" src="${employee.picture.large}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="card-text mail">${employee.email}</p>
        <p class="card-text cap loc">${employee.location.city}, ${employee.location.state}</p>
    </div>
</div>
    `).join(' ');
    document.querySelector('#gallery').innerHTML = employees;
    const modals = data.results.map(employee => `
    <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="modal-text">${employee.email}</p>
            <p class="modal-text cap">${employee.location.city}</p>
            <hr>
            <p class="modal-text">${employee.phone}</p>
            <p class="modal-text">${employee.location.street.capitalize()}, ${employee.location.state.substr(0,2).toUpperCase()} ${employee.location.postcode}</p>
            <p class="modal-text">Birthday: ${date = new Date(employee.dob.date).toLocaleDateString('en-US', {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit"
            })}</p>
            <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
        </div>
    </div>
    `);
    $('.container').html(modals);
    $('.modal-container').hide();
}
/**
 *  Pops up the modal window and has the event listener to close the modal window
 * @param {Object} event - the event Object
 */
function popUp(event) {
    const compare = [Array.from($('.card-info-container')).indexOf(event.target),
        Array.from($('.card-img-container')).indexOf(event.target),
        Array.from($('.card-img')).indexOf(event.target),
        Array.from($('.card h3')).indexOf(event.target),
        Array.from($('.card .mail')).indexOf(event.target),
        Array.from($('.card .loc')).indexOf(event.target),
        Array.from($('.card')).indexOf(event.target)
    ]
    $.each($('.modal-container'), function (i, modal) {
        //shows the modal when clicked
        if ($.inArray($(this).index(), compare) != -1) {
            $('.modal-container').eq(i).show();
        }
        //closes the modal
        $.each($('.modal-close-btn'), function (i, btn) {
            btn.addEventListener('click', function () {
                $('.modal-container').eq(i).hide('400');
            }); // end event listener
        });
    });
    //goes to the next modal
    $.each($('.modal-next'), function (i, next) {
        next.addEventListener('click', function () {
            $('.modal-container').eq(i).hide();
            $('.modal-container').eq(i + 1).show();
        }); //end event listener
    });
    // goes to the previous modal
    $.each($('.modal-prev'), function (i, prev) {
        prev.addEventListener('click', function () {
            $('.modal-container').eq(i).hide();
            $('.modal-info-container').eq(i - 1).show();
        }); //end event listener
    });

}
/**
 * Search box & button
 */
const form = document.createElement('form');
form.setAttribute('action', '#');
form.setAttribute('method', 'get');
document.querySelector('.search-container').appendChild(form);

const searchbox = document.createElement('input');
searchbox.setAttribute('type', 'search');
searchbox.setAttribute('id', 'search-input');
searchbox.setAttribute('class', 'search-input');
searchbox.setAttribute('placeholder', 'Search...');
form.appendChild(searchbox);
const searchValue = document.querySelector('.search-input');

const htmlbutton = `<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`;
form.innerHTML += htmlbutton;
const $search = $('#search-input');

/**
 * Search filter function
 */
function search() {
    const names = document.querySelectorAll('h3');
    for (let i = 0; i <= $('.card').length; i++) {
        let list = document.querySelectorAll('.card')[i];
        if (list) {
            if (names[i].innerHTML.indexOf($search.val()) > -1) {
                list.style.display = "";
            } else {
                list.style.display = 'none';
            }
        }
    }
}
/**
 * Event listener for the searchbox
 */
$search.on('keyup', search);
$('.search-submit').on('click', search);