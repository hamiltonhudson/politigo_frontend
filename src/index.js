document.addEventListener('DOMContentLoaded', function() {

  const userFormContainer = document.querySelector('#enter-user')
  const signUp = document.querySelector('#signup')
  const newUserForm = document.querySelector('#new-user-form')
  const newUserInput = newUserForm.querySelector('#new-user-input')
  const newUserEmail = newUserForm.querySelector('#new-user-email')
  const newUserPassword = newUserForm.querySelector('#new-user-password')
  const signIn = document.querySelector('#signin')
  const returnUserForm = document.querySelector('#return-user-form')
  const returnUserInput = returnUserForm.querySelector('#return-user-input')
  const returnUserEmail = returnUserForm.querySelector('#return-user-email')
  const returnUserPassword = returnUserForm.querySelector('#return-user-password')
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

  function showSignUpForm() {
    signUp.addEventListener('click', (event) => {
      event.preventDefault()
      returnUserForm.style.display = "none"
      if (newUserForm.style.display === "none") {
        newUserForm.style.display = "block"
        setUser()
      }
    })
  }

  function showSignInForm() {
    signIn.addEventListener('click', (event) => {
      event.preventDefault()
      newUserForm.style.display = "none"
      if (returnUserForm.style.display === "none") {
        returnUserForm.style.display = "block"
        getUser()
      }
    })
  }

  function setUser() {
    newUserForm.addEventListener('submit', (event) => {
      event.preventDefault()
      let name = newUserInput.value
      let email = newUserEmail.value
      let password = newUserPassword.value
      let li = document.createElement('li')
      fetch('http://localhost:3000/api/v1/users/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${name}`,
          email: `${email}`,
          password: `${password}`
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
        usersList.innerHTML = ''
        showActivistBtn.textContent = 'Show'
        showAllUsers()
        userFormContainer.innerHTML = ''
      })
    })
  }

  function getUser() {
    returnUserForm.addEventListener('submit', (event) => {
      event.preventDefault()
      // let name = returnUserInput.value
      let email = returnUserEmail.value
      let password = returnUserPassword.value
      let li = document.createElement('li')
      fetch('http://localhost:3000/api/v1/users/')
      .then(r => r.json())
      .then(response => {
        let users = response
        // let user = users.find(user => user.name.toLowerCase() === name.toLowerCase())
        let user = users.find(user => user.email === email && user.password === password )
        li.innerHTML = `${user.name} | humanitarian goodwill score: ${user.score}`
        li.dataset.id = user.id
        fetchEvents()
        showCurrentUserEvents(user)
        showEventDetails(user)
        usersList.innerHTML = ''
        showActivistBtn.textContent = 'Show'
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
        userEventInfo.innerHTML = `<span style="font-size: 20px"> ≫ </span> ${userEvent.cause} <span style="font-size: 24px; font-weight: bolder">  | </span>  ${userEvent.style}`
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
            <span class="detail" id=data-name="style">*${userEventShown.style} for ${userEventShown.cause}</span><br></br>
            <span class="detail" id=data-name="location">${userEventShown.location}</span><br>
            <span class="detail" id=data-name="date">${userEventShown.date} ┈ </span>
            <span class="detail" id=data-name="time"> ${userEventShown.time}</span><br></br>
            <button class="detail" type="button" id="button${userEventShown.id}" data-id="${userEventShown.id}" style="font-family: Codystar; font-weight: bolder; font-style: oblique; font-size: 18px; padding-top: 5px;">Show Attending Activists</button>
            <button class="detail" type="button" id="remove" data-id="${userEventShown.id}" style="font-family: Codystar; font-weight: bolder; font-size: 18px; font-style: oblique; padding-top: 5px;">Remove This Event</button>
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
                                <li data-id='${activist.id}' style="padding-left: 15px; font-family: Major Mono Display; font-size: 12px; color: #000000" >· ${activist.name}</li>
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
            activistInfo.innerHTML = `${activist.name} <span style="font-size: 13px"> ⎮⎮ </span> humanitarian goodwill score: ${activist.score}  `
            activistInfo.dataset.id = activist.id
            activistInfo.id = `${activist.name}`
            let showBtn = document.createElement('button')
            showBtn.dataset.id = activist.id
            showBtn.textContent = "Show Events"
            showBtn.id="activist-show"
            showBtn.className="teal-text #053b31 teal darken-4 teal lighten-5"
            showBtn.style="font-family:'Oswald', sans-serif; font-size: 11px; border-radius: 5px; width: auto; height: 18px; margin: 5px; position: relative"
            activistInfo.appendChild(showBtn)
            let activistShownEvents = document.createElement('ul')
            activistInfo.appendChild(activistShownEvents)
            showBtn.addEventListener('click', (event ) => {
              if (showBtn.textContent === "Show Events") {
                showBtn.textContent = "Hide Events"
                const activistEvents = activist.events
                activistEvents.forEach(event => {
                  activistShownEvents.innerHTML += `
                                <li data-id='${event.id}' style="padding-left: 15px; font-size: 13px; font-family: Cinzel Decorative, monospace; color: #283593" >∙ ${event.style} for ${event.cause}</li>
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
        ul.innerHTML = `<span style="font-size: 22px"> ≫ </span> ${event.cause}  <span style="font-size: 26px; font-weight: bolder">  | </span> ${event.style} `
        ul.dataset.id = event.id
        ul.style="font-size: 16px"
        attendeeCount = event.users.length
        let span = document.createElement('span')
        span.textContent = ` [Attendees: ${attendeeCount}]`
        span.style="font-size: 12px; display: inline-flex;"
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
        <span class="detail" id=data-name="date">${eventShown.date} ┈ </span>
        <span class="detail" id=data-name="time">${eventShown.time}</span><br></br>
        <button class="detail" type="button" id="add" data-id="${eventShown.id}" style="font-family: Codystar; font-weight: bolder; font-style: oblique; font-size: 18px; padding-top: 5px;">Attend This Event</button>
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

  showSignUpForm()
  showSignInForm()

})
