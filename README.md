# PolitiGo Frontend README

## Project Overview

PolitiGo is a NYC Political event lister SPA, in an effort to activate users and connect them to one another based on shared political causes. Users can add to their attending list from all events listed, and can view relevant details including the mapped location pinpoint. As a fun incentive, a user has a “humanitarian goodwill score” that starts out at 0, and is increased by 10 every time they add an event and decreased by 10 every time they remove an event. To help foster a sense of community and keep attendance high, users can also view other users’ scores (and event list). ✊🏻

## Technologies Used

JavaScript, Ruby on Rails, Google Places API, HTML, CSS, JSON, Materialize CDN & GoogleFonts, ActiveModel Serializers, Ruby gems

## Getting Started

### Prerequisites
To use, clone down this repo and open with your preferred text editor. Before anything else, if you haven’t already, make sure to set up the project backend as well (link below), which will ensure you have rails 2.5.3 or higher installed on your machine. This is a vanilla JavaScript project using node package manager, so once you have it open in your local environment, run the following: 

`npm install`

terminal command from the root of the project to install dependencies. 

### Installing
Once npm is finished installing and you’re back to a working terminal, jump over to the backend project root and run:

`rails s`

to start the server. (From the previous backend set up, should indicate successful connection to server, but to double check, navigate to http://localhost:3000 and make sure you have a “Yay! You’re on Rails!” welcome page). Back in the terminal, run:

`open index.html`

which will launch PolitiGo in your browser. You can sign up as a new user with first and last name (and sign back in later with same info), view events at the bottom of the page, and from there, add events to your attending event list. 👍🏼

## Backend Link

[politigo_backend](https://github.com/ehamiltonhudson/politigo_backend)

## Demo Video

[politigo.mov](https://drive.google.com/open?id=1zC7ayZOjkz4l55mITPli6FLy7Jpsf2_V)

## Authors

**Hamilton Hudson**

≫ ehamiltonhudson@gmail.com<br/>
↳ *LinkedIn*: https://www.linkedin.com/in/hamiltonhudson<br/>
↳ *Website*: https://hamiltonhudson.myportfolio.com<br/>
↳ *Blog*: https://ehhudson.wordpress.com<br/>
↳ *Twitter*: https://twitter.com/HamiltonHudson

## License

This project is licensed under the MIT License - see the [LICENSE.md](/LICENSE) file for details.
