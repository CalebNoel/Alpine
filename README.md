# 3308Summer21_300_4

# Synopsis
Ride sharing website that connects users with identical destinations in the Colorado area. Users can put in their destination with a planned date of travel and the website will match with other travelers. The website calculates gas cost and share-per-passenger given car information. The site will also function as a social media platform in that users have the ability to chat with their matches.

# Architecture: 
- Website cloud-hosted by Heroku (available to the public)
- Consists of registration page, ride search page, and carpool-group pages with info about destination, travel, and chatroom between members.
- Frontend in HTML/CSS, backend developed with Javascript and NodeJS, with SQL user and travel instance databases
- Queries API http://www.fueleconomy.gov/ws/rest/ for travel costs, and Open Street Map for map interface
