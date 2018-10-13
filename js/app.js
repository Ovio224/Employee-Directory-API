const gallery = document.querySelector('#gallery');

/**
 * FETCH FUNCTIONS
 */


fetch('https://randomuser.me/api/1.2/?results=12&nat=us,gb&format=json&exc=login,id,registered')
        .then(checkStatus)
        .then(result => result.json())    
        .then(data => generateEmployees(data))
        .catch(err => console.error('This is the error -> ' + err));



/**
 * HELPER FUNCTIONS
 */

function checkStatus(response){
    if(response.ok === true) {
        return Promise.resolve(response);
    } else{
        return Promise.reject(new Error(response.statusText));
    }
}

function generateEmployees(data){
    const employees = data.results.map(employee => `
    <div class="card">
    <div class="card-img-container">
        <img class="card-img" src="${employee.picture.large}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="card-text">${employee.email}</p>
        <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
    </div>
</div>
    `).join(' ');
    gallery.innerHTML = employees;
}






