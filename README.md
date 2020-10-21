It shows the avaiability of each location of City Bikes in Miami FL stations. For this project we will be using NodeJS / Socket IO / React and LeafLet Maps. For the data we are extracting availability from https://citybik.es/ to build the app.
![alt text](https://github.com/CamiMeneses/citybikes/blob/master/readme_files/general_video.gif?raw=true)

## Objective

- Complete the code to show in map via socket.io the availability / amount of bikes at each station.
- The view should update in realtime and also can go back in time to "re-play" the changes in the view (You can choose the limit of going back, the idea is to show how availability changes during the day)

## Process

Most of the changes were in the client part in App js:
- The most important is the ShowSpots component because all the markers are added there.
The markers show the name of the station, how many free bikes are in the station and the empty slots.
![alt text](https://github.com/CamiMeneses/citybikes/blob/master/readme_files/popup.png?raw=true)

The markers has different colors and size depending of the free_bikes.
if there are more than 10 bikes you will see a green and big marker, orange if it has between 5 to 9 bikes, pink/red and small for less than 5 and dark purple for 0
![alt text](https://github.com/CamiMeneses/citybikes/blob/master/readme_files/popup2.png?raw=true)

- Also I used frequently the response and dataTime attributes. response is the answer that we are getting now and in dataTime we save the changes. I had implemented firebase because we should see the database during the day and pushing the response to dataTime took a lot of time. So now the dataTime is being filled with firebase in the begining and also new values are pushed in real time. Because I haven't seen any change in the data from citybikeApi for many days I introduced random changes to dataTime.
![alt text](https://github.com/CamiMeneses/citybikes/blob/master/readme_files/firebase.png?raw=true)

- The slider shows the register in dataTime. It shows from 0 to the number of registers and its date.
![alt text](https://github.com/CamiMeneses/citybikes/blob/master/readme_files/slider.png?raw=true)

- Last updates shows the changes in free_bikes
![alt text](https://github.com/CamiMeneses/citybikes/blob/master/readme_files/updates.png?raw=true)

On the other hand, in the server part the server.js file was modified:
- Adding the library Axios (requirement) to make HTTP request syntax: axios.get('url')
- Using de interval variable already declared and timeout to specify how long the app has to wait to
  make another request to the Api and update its state. In this case is 5000 or 5 seconds.
- to make the requests without stop anything(asynchrone) async and await was used.
- using socket.io and adding emit for communication between the server and the client

## Requirements (Node Modules)

- Nodejs & NPM
- Express.js / Socket IO / Axios
- React / React-Leaflet

## Folder Structure

- The server

`cd /citibike-server`

This is the node socket.io Server app to start :

`node server.js`

- the client app

`cd /citibike-client`

That is the client React Application to start :

`npm start`




