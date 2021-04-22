# 10 - Full stack app with React and REST API

## Contributors:
#### Adam Pereira, Kyle Goguen, Craig Maples

## Overview:
The application allows an end user to view courses from the SQLite database in the API folder. If the user signs up or if an existing user
signs in they can create a new course as well as modify or delete an existing course if they are the course owner.

## Instructions
Open the api folder in the terminal and run npm install, once that has finised npm start, the final step is npm run seed. This should get your api back end server running on localhost:5000 and seeded with the base courses. 

Next, open the client folder in the terminal and run npm install, npm start. This will get the react front end running on localhost:3000.


## Additional Changes:
#### User credentials persisted to an HTTP cookie.
#### User redirected to /notfound when accessing or updating an invalid course number and when there's no matching route.
#### User redirected to /forbidden when update or delete attempted and requested course isn't owned by the authenticated user.
#### User redirected to /error when the app encounters a 500 or other unexpected error.
#### After successful sign in the user is returned to the page they came from.
#### Added FavIcon to the browswer tab.