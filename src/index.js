document.addEventListener('DOMContentLoaded', function() {
  // alert('LOADED');

  const userForm = document.querySelector('#user-form')
  const userInput = userForm.querySelector('#user-input')
  let userDisplay = document.querySelector('#user-display')
  let currentUser = document.querySelector('#activist')
  let currentUserScore = document.querySelector('#current-user-score')
  const usersList = document.querySelector('#users-list')
  const showActivistBtn = document.querySelector('#show-users')
  const currentUserEvents = document.querySelector("#current-users-events")
  const currentUserEventsDetail = document.querySelector('#users-events-show-panel')
  const eventsList = document.querySelector('#events-list')
  // let events;
  let eventShowPanel = document.querySelector('#event-show-panel')
  // let eventShown;
  // const causeFilter = document.querySelector('#filter-by-cause')
  // const styleFilter = document.querySelector('#filter-by-style')

userForm.addEventListener('submit', (event) => {
  event.preventDefault()
  let name = userInput.value
  let li = document.createElement('li')
  li.innerHTML = `${name} | humanitarian goodwill score: 0`
  li.dataset.id = name.id

  fetch('http://localhost:3000/api/v1/users/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `${name}`
    })
  })
  .then(response => response.json())
  .then(data => {
    // console.log(data)
    // li.dataset.id = data.id
    // usersList.appendChild(li)
    usersList.appendChild(li)
  // userDisplay.innerHTML = `
  //                         <h3>${data.name}</h3>
  //                         `
  // userDisplay.dataset.id = data.id
  // userDisplay.dataset.name = data.name
  // userDisplay.dataset.score = data.score
  // console.log(data.id)
  })
})

function showCurrentUserEvents() {
  fetch('http://localhost:3000/api/v1/users/')
  .then(response => response.json())
  .then(data => {
    let users = data
    let signedIn = users[0]
    currentUser.textContent = `Activist: ${signedIn.name}`
    currentUserScore.textContent = `humanitarian goodwill score: ${signedIn.score}`
    let usersEvents = signedIn.events
    usersEvents.forEach(userEvent => {
      let li = document.createElement('li')
      li.textContent = `${userEvent.cause} | ${userEvent.style}`
      li.dataset.id = userEvent.id
      currentUserEvents.appendChild(li)
      })
    // })
    currentUserEvents.addEventListener('click', (event) => {
      userEventClicked = parseInt(event.target.dataset.id)
      userEventShown = usersEvents.find((userEvent) => userEvent.id === userEventClicked)
        currentUserEventsDetail.innerHTML = `
        <span class="detail" id=data-name="style">*${userEventShown.style} for ${userEventShown.cause}</span><br></br>
        <span class="detail" id=data-name="location">${userEventShown.location}</span><br>
        <span class="detail" id=data-name="date">${userEventShown.date}</span><br>
        <span class="detail" id=data-name="time">${userEventShown.time}</span><br></br>
        <button class="detail" type="button" id="remove" data-id="{userEventShown.id}">Remove This Event</button>
        `

      const removeEventBtn = document.querySelector("#remove")
      removeEventBtn.addEventListener('click', (event) => {
        fetch(`http://localhost:3000/api/v1/events/${userEventShown.id}/remove`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
          })
        })
        .then(response => response.json())
        .then(data => {
          updatedUser = data.user
          removedEvent = data.event
          currentUserScore.textContent = `humanitarian goodwill score: ${updatedUser.score}`
          currentUserEvents.innerHTML = ''
          showCurrentUserEvents()
          window.alert('You are no longer signed up')
          currentUserEventsDetail.innerHTML = '← Click Event for Details'
          usersList.innerHTML = ''
          fetch('http://localhost:3000/api/v1/users/')
          .then(response => response.json())
          .then(data => {
            let users = data
            users.forEach(user => {
              usersList.innerHTML += `
                                    <li data-id='${user.id}'>${user.name} | humanitarian goodwill score: ${user.score}</li>
                                    `
            })
          })
        })
      })
    })
  })
}

// -----------
function showAllUsers() {
  showActivistBtn.addEventListener('click', (event) => {
    if (showActivistBtn.textContent === 'Show All') {
      showActivistBtn.textContent = 'Hide All'
      fetch('http://localhost:3000/api/v1/users/')
      .then(response => response.json())
      .then(data => {
        let users = data
        users.forEach(user => {
          usersList.innerHTML += `
                                <li data-id='${user.id}'>${user.name} | humanitarian goodwill score: ${user.score}</li>
                                `
        })
      })
    } else {
      showActivistBtn.textContent = 'Show All'
      usersList.innerHTML = ''
    }
  })
}
// --------

// function fetchEvents() {
  fetch('http://localhost:3000/api/v1/events/')
    .then(response => response.json())
    .then(data => {
      events = data
      events.forEach(event => {
        let li = document.createElement('li')
        li.textContent = `${event.cause} | ${event.style}`
        li.dataset.id = event.id
        eventsList.appendChild(li)
      })
      // showEventDetails()
    })
// } <--function fetchEvents() closing tag
// -----------

// function showEventDetails() {
  eventsList.addEventListener('click', (event) => {
    eventClicked = parseInt(event.target.dataset.id)
    eventShown = events.find((event) => event.id === eventClicked)
    let latitude = parseInt(eventShown.lat)
    let longitude = parseInt(eventShown.long)
    var myLatLng = {lat: parseFloat(eventShown.lat), lng: parseFloat(eventShown.long)};
    const attendees = eventShown.users
    eventShowPanel.innerHTML = `
      <span class="detail" id=data-name="style">*${eventShown.style} for ${eventShown.cause}</span><br></br>
      <span class="detail" id=data-name="location">${eventShown.location}</span><br>
      <span class="detail" id=data-name="date">${eventShown.date}</span><br>
      <span class="detail" id=data-name="time">${eventShown.time}</span><br></br>
      <button class="detail" type="button" id="add" data-id="${eventShown.id}">Attend This Event</button>
    `
    var myLatLng = {lat: parseFloat(eventShown.lat), lng: parseFloat(eventShown.long)};
    let title = `${eventShown.style} for ${eventShown.cause}`
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: myLatLng
    });
    let marker = new google.maps.Marker({
       position: myLatLng,
       map: map,
       title: title
     });
     marker = ''
    let newAttendee = {id: parseInt(userDisplay.dataset.id), name: userDisplay.dataset.name, score: parseInt(userDisplay.dataset.score)}
    const addEventBtn = document.querySelector("#add")
    addEventBtn.addEventListener('click', (event) => {
      fetch(`http://localhost:3000/api/v1/events/${eventShown.id}/add`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.errors){
          alert('You are already signed up for this event')
          eventShowPanel.innerHTML = '← Click Event for Details'
        } else {
          addedEvent = data.event
          updatedUser = data.user
          currentUserScore.textContent = `humanitarian goodwill score: ${updatedUser.score}`
          currentUserEvents.innerHTML = ''
          showCurrentUserEvents()
          window.alert('You are signed up!')
          eventShowPanel.innerHTML = '← Click Event for Details'
          usersList.innerHTML = ''
          fetch('http://localhost:3000/api/v1/users/')
          .then(response => response.json())
          .then(data => {
            let users = data
            users.forEach(user => {
              usersList.innerHTML += `
                                    <li data-id='${user.id}'>${user.name} | humanitarian goodwill score: ${user.score}</li>
                                    `
            })
          })
        }
      })
    })
  })

// }<---showEventDetails() closing tag
// -----------

showCurrentUserEvents()
showAllUsers()
})
