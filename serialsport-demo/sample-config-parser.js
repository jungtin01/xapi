var config = require('./config.js');

// Sample REQCODES
const REQCODES = {
  "three_buttons": {
    "0010": "C",  // Call employee
    "0100": "B",  // Pay the bill
    "1000": "X",  // Cancel previous request
  },
  "four_buttons": {
    "0001": "M",  // Order (menu)
    "0010": "C",  // Call employee
    "0100": "B",  // Pay the bill
    "1000": "X",  // Cancel previous request
  },
  "five_buttons": {
    "0100": "M",  // Order (menu)
    "1001": "W",  // Water
    "0010": "C",  // Call employee
    "1000": "B",  // Pay the bill
    "0001": "X",  // Cancel previous request
  },
};

console.log("full config:\n", config);
console.log("config.deviceType:", config.deviceType);
console.log("three_buttons:", REQCODES["three_buttons"]);
console.log("three_buttons 0010:", REQCODES["three_buttons"]["0010"]);
console.log("three_buttons 0100:", REQCODES["three_buttons"]["0100"]);
console.log("three_buttons 1000:", REQCODES["three_buttons"]["1000"]);
console.log("four_buttons:", REQCODES["four_buttons"]);
console.log("four_buttons 0001:", REQCODES["four_buttons"]["0001"]);
console.log("four_buttons 0010:", REQCODES["four_buttons"]["0010"]);
console.log("four_buttons 0100:", REQCODES["four_buttons"]["0100"]);
console.log("four_buttons 1000:", REQCODES["four_buttons"]["1000"]);
console.log("five_buttons:", REQCODES["five_buttons"]);
console.log("five_buttons 0100:", REQCODES["five_buttons"]["0100"]);
console.log("five_buttons 1001:", REQCODES["five_buttons"]["1001"]);
console.log("five_buttons 0010:", REQCODES["five_buttons"]["0010"]);
console.log("five_buttons 1000:", REQCODES["five_buttons"]["1000"]);
console.log("five_buttons 0001:", REQCODES["five_buttons"]["0001"]);

let reqType = "0010";
console.log("REQCODES[config.deviceType][reqType]:", REQCODES[config.deviceType][reqType]);
