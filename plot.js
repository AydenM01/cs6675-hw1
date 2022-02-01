const { plot } = require("nodeplotlib");
const fs = require("fs");

const plot1_raw = fs.readFileSync("plot1.json");
const plot2_raw =  fs.readFileSync("plot2.json");
const plot3_raw =  fs.readFileSync("plot3.json");

const plot1 = JSON.parse(plot1_raw);
const plot2 = JSON.parse(plot2_raw);
const plot3 = JSON.parse(plot3_raw);

console.log(plot1.x.length)