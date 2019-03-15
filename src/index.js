document.addEventListener('DOMContentLoaded', function() {
  // alert('LOADED');

  const userFormContainer = document.querySelector('#enter-user')
  const newUserForm = document.querySelector('#new-user-form')
  const newUserInput = newUserForm.querySelector('#new-user-input')
  const returnUserForm = document.querySelector('#return-user-form')
  const returnUserInput = returnUserForm.querySelector('#return-user-input')
  let userDisplay = document.querySelector('#user-display')
  let currentUser = document.querySelector('#activist')
  let currentUserScore = document.querySelector('#current-user-score')
  const usersList = document.querySelector('#users-list')
  const showActivistBtn = document.querySelector('#show-users')
  const currentUserEvents = document.querySelector("#current-users-events")
  const currentUserEventsDetail = document.querySelector('#users-events-show-panel')
  const eventsList = document.querySelector('#events-list')
  let eventShowPanel = document.querySelector('#event-show-panel')

  function setUser() {
    newUserForm.addEventListener('submit', (event) => {
      event.preventDefault()
      let name = newUserInput.value
      let li = document.createElement('li')
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
        console.log(response)
        let user = response
        li.innerHTML = `${user.name} | humanitarian goodwill score: 0`
        li.dataset.id = user.id
        console.log("user in setUser", user)
        console.log("li in setUser", li, li.dataset.id)
        usersList.appendChild(li)
        fetchEvents()
        showCurrentUserEvents(user)
        showEventDetails(user)
        showAllUsers()
        userFormContainer.innerHTML = ''
      })
    })
  }

  function getUser() {
    returnUserForm.addEventListener('submit', (event) => {
      event.preventDefault()
      let name = returnUserInput.value
      let li = document.createElement('li')
      fetch('http://localhost:3000/api/v1/users/')
      .then(r => r.json())
      .then(response => {
        // if (response.errors){
        //   alert('Please enter full name')
        // } else {
        let users = response
        let user = users.find(user => user.name.toLowerCase() === name.toLowerCase())
        li.innerHTML = `${user.name} | humanitarian goodwill score: 0`
        li.dataset.id = user.id
        usersList.appendChild(li)
        fetchEvents()
        showCurrentUserEvents(user)
        showEventDetails(user)
        showAllUsers()
        userFormContainer.innerHTML = ''
      })
    })
  }

  function showCurrentUserEvents(userInfo) {
    fetch(`http://localhost:3000/api/v1/users/`)
    .then(response => response.json())
    .then(data => {
      let users = data
      let signedIn = users.find(user => user.id === userInfo.id)
      currentUser.textContent = `Activist: ${signedIn.name}`
      currentUserScore.textContent = `humanitarian goodwill score: ${signedIn.score}`
      let usersEvents = signedIn.events
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
          showEventLocation(userEventShown)
        const removeEventBtn = document.querySelector("#remove")
        removeEventBtn.addEventListener('click', (event) => {
          removeEventClicked = signedIn.user_events.find(ue => ue.event_id === eventShown.id)
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
        showEventLocation(eventShown)
        // var myLatLng = {lat: parseFloat(eventShown.lat), lng: parseFloat(eventShown.long)};
        // let title = `${eventShown.style} for ${eventShown.cause}`
        // var map = new google.maps.Map(document.getElementById('map'), {
        //   zoom: 10,
        //   center: myLatLng
        // });
        // let marker = new google.maps.Marker({
        //   position: myLatLng,
        //   map: map,
        //   title: title
        // });
        // marker = ''
        let newAttendee = userInfo
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
          if (data.errors){
            alert('You are already signed up for this event')
            eventShowPanel.innerHTML = '← Click Event for Details'
          } else {
            let addedEvent = userEvent.event
            let updatedUser = userEvent.user
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

  function showEventLocation(event) {
    console.log("event in showEventLocation", event)
    let eventDisplay = event
    console.log("eventDisplay in showEventLocation", eventDisplay)
    var myLatLng = {lat: parseFloat(eventDisplay.lat), lng: parseFloat(eventDisplay.long)};
    let title = `${eventDisplay.style} for ${eventDisplay.cause}`
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
  }

  setUser()
  getUser()

})
