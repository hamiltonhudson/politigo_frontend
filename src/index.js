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
  // let userInfo

function getUser() {
  userForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let name = userInput.value
    let li = document.createElement('li')
    // li.innerHTML = `${name} | humanitarian goodwill score: 0`
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
    .then(r => r.json())
    .then(response => {
      // console.log(response)
      let user = response
      li.innerHTML = `${user.name} | humanitarian goodwill score: 0`
      li.dataset.id = user.id
      // console.log("user in getUser", user)
      // console.log("li in GetUser", li, li.dataset.id)
      usersList.appendChild(li)
      fetchEvents()
      showCurrentUserEvents(user)
      showEventDetails(user)
      showAllUsers()
    })
  })
}

function showCurrentUserEvents(userInfo) {
  fetch(`http://localhost:3000/api/v1/users/`)
  .then(response => response.json())
  .then(data => {
    // console.log("data in showCurrentUserEvents", data)
    let users = data
    // console.log("userInfo in showCurrentUserEvents", userInfo)
    let signedIn = users.find(user => user.id === userInfo.id)
    // console.log("signedIn.user_events", signedIn.user_events)
    // console.log("signedIn in showCurrentUserEvents", signedIn)
    currentUser.textContent = `Activist: ${signedIn.name}`
    currentUserScore.textContent = `humanitarian goodwill score: ${signedIn.score}`
    let usersEvents = signedIn.events
    // console.log("usersEvents in showCurrentUserEvents", usersEvents)
    currentUserEvents.innerHTML = ''
    usersEvents.forEach(userEvent => {
      let li = document.createElement('li')
      li.textContent = `${userEvent.cause} | ${userEvent.style}`
      li.dataset.id = userEvent.id
      currentUserEvents.appendChild(li)
    })
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
        removeEventClicked = signedIn.user_events.find(ue => ue.event_id === eventShown.id)
        // console.log("signedIn.user_events in showCurrentUserEvents", signedIn.user_events)
        // console.log("removeEventClicked in showCurrentUserEvents", removeEventClicked)
        fetch(`http://localhost:3000/api/v1/user_events/${removeEventClicked.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: `${removeEventClicked.id}`
          })
        })
        .then(response => response.json())
        .then(data => {
          // console.log("data response from user_events/delete", data.score)
          updatedUser = data
          currentUserScore.textContent = `humanitarian goodwill score: ${updatedUser.score}`
          currentUserEvents.innerHTML = ''
          showCurrentUserEvents(updatedUser)
          window.alert('You are no longer signed up')
          currentUserEventsDetail.innerHTML = '← Click Event for Details'
          usersList.innerHTML = ''
          showActivistBtn.textContent = 'Show'
          // showAllUsers()
        })
      })
    })
  })
}

function showAllUsers() {
  showActivistBtn.addEventListener('click', (event) => {
    // usersList.innerHTML = ''
    if (showActivistBtn.textContent === 'Show') {
      showActivistBtn.textContent = 'Hide'
      fetch('http://localhost:3000/api/v1/users/')
      .then(response => response.json())
      .then(data => {
        // console.log("data in showallUsers", data)
        let users = data
        users.forEach(user => {
          usersList.innerHTML += `
                                <li data-id='${user.id}'>${user.name} | humanitarian goodwill score: ${user.score}</li>
                                `
        })
      })
    } else {
      showActivistBtn.textContent = 'Show'
      usersList.innerHTML = ''
    }
  })
}
// --------

function fetchEvents() {
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
  }

function showEventDetails(userInfo) {
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
    // console.log("userInfo in showEventDetails", userInfo)
    let newAttendee = userInfo
    // console.log("newAttendee in showEventDetails", newAttendee)
    const addEventBtn = document.querySelector("#add")
    addEventBtn.addEventListener('click', (event) => {
      fetch(`http://localhost:3000/api/v1/user_events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: newAttendee.id,
          event_id: eventShown.id
        })
      })
      .then(response => response.json())
      .then(data => {
        userEvent = data
        // console.log("data in showEventDetails", data)
        // console.log("userEvent in showEventDetails", userEvent)
        // console.log("data.event in showEventDetails", data.event)
        if (data.errors){
          alert('You are already signed up for this event')
          eventShowPanel.innerHTML = '← Click Event for Details'
        } else {
          // console.log("userEvent in showEventDetails", userEvent)
          let addedEvent = userEvent.event
          // console.log("addedEvent in showEventDetails", addedEvent)
          let updatedUser = userEvent.user
          // console.log("updatedUser in showEventDetails", updatedUser)
          showCurrentUserEvents(updatedUser)
          window.alert('You are signed up!')
          eventShowPanel.innerHTML = '← Click Event for Details'
          usersList.innerHTML = ''
          showActivistBtn.textContent = 'Show'
        }
      })
    })
  })
}

getUser()
// showAllUsers()
})
