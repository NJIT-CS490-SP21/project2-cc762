# Flask and create-react-app
 
## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
*Don't do the Heroku step for assignments, you only need to deploy for Project 2*
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku milestone_1`

## New Features:
1. I would like to swap board storage to entierly server side, as it is more secure and less buggy(state cause a bug that took 2 hours and made my project late). This would be done almost exactly as I did the request for users(which are curently stored server side)
2. I would like to have the make it such that the client requests a state change and then the server checks/approves it, rather than the client simply emitting the change and the server passing it on.

## Issues:
1. I had an issue with resetting the board. What was happening was that when the reset signal was recieved the board was not updating its state properly. 
I logged the states at certain points, and believed I had narrowed down the issue to the end of the function attached to the reset socket; however I could not fix the issue.
When I spoke to Professor Naman he showed me where I was improperly acessing state in a DIFFERENT function, which caused the issue. 
While I did not solve this myself at least I have a better understanding of state in the future.
2. I could not get the login socket to emit to only a specific client, despite turning 'broadcast' to 'false' and 'include_self' to true.
After searching the documentation I found that the best way to do this is using rooms. Notably a socket will join a room to its unique id automaticall.
I passed the 'socket.id' along in the data to the server and had the login signal send specifically to that ID.
