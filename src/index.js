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
  let eventAttendees = document.createElement('ul')
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
        li.innerHTML = `${user.name} | humanitarian goodwill score: ${user.score}`
        li.dataset.id = user.id
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
        let userEventInfo = document.createElement('li')
        userEventInfo.textContent = `≫ ${userEvent.cause} | ${userEvent.style}`
        userEventInfo.dataset.id = userEvent.id
        userEventInfo.id = `Event${userEvent.id}`
        currentUserEvents.appendChild(userEventInfo)
        showAttendees()
        eventAttendees.id="eventAttendees"
        eventAttendees.innerHTML = ''
      })

      function showAttendees() {
        currentUserEvents.addEventListener('click', (event) => {
          eventAttendees.innerHTML = ''
          let eventShownInfo = document.querySelector(`#Event${event.target.dataset.id}`)
          userEventClicked = parseInt(event.target.dataset.id)
          userEventShown = usersEvents.find((userEvent) => userEvent.id === userEventClicked)
          console.log(userEventShown.style)
          currentUserEventsDetail.innerHTML = `
            <span class="detail" id=data-name="style">${userEventShown.style} for ${userEventShown.cause}</span><br></br>
            <span class="detail" id=data-name="location">${userEventShown.location}</span><br>
            <span class="detail" id=data-name="date">${userEventShown.date}</span><br>
            <span class="detail" id=data-name="time">${userEventShown.time}</span><br></br>
            <button class="detail" type="button" id="button${userEventShown.id}" data-id="${userEventShown.id}">Show Attending Activists</button>
            <button class="detail" type="button" id="remove" data-id="{userEventShown.id}">Remove This Event</button>
            `
          let showEventActivistsBtn = document.getElementById(`button${eventShownInfo.dataset.id}`)
          showEventActivistsBtn.addEventListener('click', (event ) => {
            if (showEventActivistsBtn.textContent === "Show Attending Activists") {
              showEventActivistsBtn.textContent = "Hide Attending Activists"
              const eventActivists = userEventShown.users
              eventShownInfo.appendChild(eventAttendees)
              ul = document.createElement('ul')
              eventActivists.forEach(activist => {
                ul.innerHTML += `
                                <li data-id='${activist.id}' style="padding-left: 15px; font-size: 12px" >· ${activist.name}</li>
                                `
                eventAttendees.appendChild(ul)
              })
            } else {
              showEventActivistsBtn.textContent = "Show Attending Activists"
              ul.innerHTML = ''
            }
          })
          showEventLocation(userEventShown)
          const removeEventBtn = document.querySelector("#remove")
          removeEventBtn.addEventListener('click', (event) => {
            removeEventClicked = signedIn.user_events.find(ue => ue.event_id === userEventShown.id)
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
              eventsList.innerHTML = ''
              fetchEvents()
            })
          })
        })
      }
    })
  }

  function showAllUsers() {
    showActivistBtn.addEventListener('click', (event) => {
      if (showActivistBtn.textContent === 'Show') {
        showActivistBtn.textContent = 'Hide'
        fetch('http://localhost:3000/api/v1/users/')
        .then(response => response.json())
        .then(data => {
          let activists = data
          activists.forEach(activist => {
            activistEvents = activist.events
            let activistInfo = document.createElement('ul')
            activistInfo.textContent = `${activist.name} | humanitarian goodwill score: ${activist.score} || `
            activistInfo.dataset.id = activist.id
            activistInfo.id = `${activist.name}`
            let showBtn = document.createElement('button')
            showBtn.dataset.id = activist.id
            showBtn.textContent = "Show Events"
            showBtn.id="activist-show"
            showBtn.className="teal-text #053b31 teal darken-4 teal lighten-5"
            showBtn.style="font-family:'Oswald', sans-serif; font-size: 11px; width: 11%; height: 18px;"
             // position: relative; top:12px; left:30px;
            activistInfo.appendChild(showBtn)
            let activistShownEvents = document.createElement('ul')
            activistInfo.appendChild(activistShownEvents)
            showBtn.addEventListener('click', (event ) => {
              if (showBtn.textContent === "Show Events") {
                showBtn.textContent = "Hide Events"
                const activistEvents = activist.events
                activistEvents.forEach(event => {
                  activistShownEvents.innerHTML += `
                                <li data-id='${event.id}' style="padding-left: 15px; font-size: 13px" >∙ ${event.style} for ${event.cause}</li>
                                `
                })
              } else {
                showBtn.textContent = "Show Events"
                activistShownEvents.innerHTML = ''
              }
            })
            usersList.appendChild(activistInfo)
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
        let ul = document.createElement('ul')
        ul.textContent = `≫ ${event.cause} | ${event.style} `
        ul.dataset.id = event.id
        ul.style="font-size: 16px"
        attendeeCount = event.users.length
        let span = document.createElement('span')
        span.textContent = `[Attendees: ${attendeeCount}]`
        span.style="font-size: 12px;"
        ul.appendChild(span)
        eventsList.appendChild(ul)
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
            eventsList.innerHTML = ''
            fetchEvents()
          }
        })
      })
    })
  }

  function showEventLocation(event) {
    let eventDisplay = event
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
