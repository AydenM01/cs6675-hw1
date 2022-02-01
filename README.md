# cs6675-hw1
View the analysis of this project at https://www.aydenmarshall.com/school/2022/01/25/search-engine.html

# Try it yourself!

Tested on node verion 14.17.5

## Running the crawler
In the root directory of the project, run the following commands:
    
npm install    
node crawl.js    


## Viewing plots
In the root directory of the project, run the following commands:

node plot.js

If it doesnt pull up your browser automatically, they should be visible at http://localhost:61867/plots

## Connecting to MongoDB Atlas
If you wish to connect to a MongoDB Atlas cluster and save crawled pages in a collection, first create a config.env file in the server directory with your ATLAS_URI

Next, update server/db/conn.js and server/routes/record.js to reflect your database and collection

Uncomment line 73 in crawl.js

cd to the server directory, and run the following commands:

npm install
node server.js

The server should be started on port 5000 and say Connected to MongoDB
