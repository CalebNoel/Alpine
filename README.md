# 3308Summer21_300_4

# Access Now

https://alpine-ltd.herokuapp.com/

# Description
  Ride-sharing website that connects users with identical destinations in the Colorado area. The website allows users to browse information on various hiking landmarks and ski areas.  Information for hiking spots may include the length of the hike, terrain, level of difficulty, and altitude. Information for ski areas may include snow depth, snow type (packed powder, powder, etc.), and ticket costs.  
  Users can put in their chosen destination with a planned date of travel and the website will match with other travelers.  Drivers and passengers can create groups. Users can chat with their group to plan the trip.  To facilitate cost-sharing, the website calculates gas cost and share-per-passenger given vehicle information.


# Architecture: 
- The technologies to be used on the back-end include Express.js, and PostGreSQL.
- The technologies to be used on the front-end include react, materialize-CSS, HTML, and Bootstrap.
- The front-end and back-end will communicate with each other using the handlebars API of Express.js.
- React will be responsible for the behavioral and state storage part of the website, materialize-CSS for styling, PostGreSQL as the database, and Express.js as an API for communication between back-end and front-end.


# TODO:
Tag repo with "Final Submission"
# How to build/run code
Pull code fromr repository. 
After navigating to the Project Code folder in you terminal, you will need to run these 4 commands:
```
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
Then you should be able to get the server running with the command `npm run dev` after which the website should be accesible in your browser at local host on port 3000.

# Orginization

# API'S

- Google JavaScript Maps API, Locations API, and Places API all used under Google Cloud Platform Credentials. Site is able to host ~1000 request per day for free
- Open Weather API used for temperature, cloud cover, and icon data using JSON data from Maps Geometry(Latitude, Longitude)

# Use Cases:
- Registration is intuitive, and user is able to log-in immediately after registering. Dynamic NavBar populates based on if user is logged in authenticated by passport.js.

