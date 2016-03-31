// Setup the data
var table;
var prices;
var count = 400;
var currentPrice = DURATION;
var objects;

/**
 * Return a state with a particular name
 * @param value
 * @returns {boolean}
 */
function getState(stateName) {
    for (var i = 0; i < DATA_US.places.length; i++) {
        if (DATA_US.places[i].name == stateName) return DATA_US.places[i];
    }
}

/**
 * Draw the shape of a state using state data
 * @param state
 */
function drawObject(object) {
    noStroke();
    R = ((object.income - minIncome) / (maxIncome - minIncome)) * 183;
    G = ((object.income - minIncome) / (maxIncome - minIncome)) * 69;
    B = ((object.income - minIncome) / (maxIncome - minIncome)) * 255;
    radius = Math.sqrt(object.income) * C_SIZE;
    fill(R,G,B);
    ellipse(object.x,object.y,radius,radius);
}

function preload() {
    mainData = loadTable("./est14ALL1.csv", "csv", "header");
    counties = loadTable("./county_coordinate.csv", "csv", "header");
}

function setup() {

    //--- PROCESS INPUT ---//
    console.log(counties);
    numCounties = counties.getRowCount();
    allX = Array();
    allY = Array();
    objects = Array();

    // Get data from county
    FIPS = counties.getColumn("FIPS");
    latitude = counties.getColumn("Latitude");
    longitude = counties.getColumn("Longitude");

    // Get ata from the mainData
    incomes = mainData.getColumn("Median Household Income");
    State_FIPS = mainData.getColumn("State FIPS Code");
    County_FIPS = mainData.getColumn("County FIPS Code");
    minIncome = 1000000000;
    maxIncome = 0;


    //A new table of counties coordinate
    for (var i = 0; i < numCounties; i++) {
        console.log(parseInt(FIPS[i]));
        allX[parseInt(FIPS[i])] = (parseFloat(longitude[i]) - MIN_X) / DIS_X * WIDTH;
        allY[parseInt(FIPS[i])] = HEIGHT - (parseFloat(latitude[i]) - MIN_Y) / DIS_Y * HEIGHT;
    }

    console.log(allX);

    //Set up all medium income object by FIPS
    for (i = 0; i < incomes.length; i++) {
        var temp_FIPS = parseInt(State_FIPS[i]) * 1000 + parseInt(County_FIPS[i]);
        if (allX[temp_FIPS] == 0) {}
        else {
            var county_income = parseInt(incomes[i]);
            objects.push({
                x: allX[temp_FIPS],
                y: allY[temp_FIPS],
                income: county_income
            });
            if (county_income > maxIncome) maxIncome = county_income;
            if (county_income < minIncome) minIncome = county_income;
        }
    }

    //--- SETUP CANVAS ---//
    createCanvas(window.innerWidth, window.innerHeight);
    console.log(objects);
}

/**
 * Drawing function for P5.js
 */
function draw() {
    // Update data

    // Beautiful dark background
    background(0);

    // Draw objects
    for (var i = 0; i < numCounties; i++) {
        var obj = objects[i];

        // Get necessary variables
        drawObject(obj);
    }

    // Set gradient
    setGradient(100, HEIGHT-60, WIDTH/2-100, 30, color(0,0,0),color(183,69,255), 1);

    // Draw text
    textSize(24);
    fill(249, 249, 249);
    text((minIncome * 1000).toString(), 60, HEIGHT-80);
    fill(249, 249, 249);
    text((maxIncome * 1000).toString(), WIDTH/2-60, HEIGHT-80);
    text("Medium Household Income", WIDTH/4 - 150, HEIGHT - 80);

}

function setGradient(x, y, w, h, c1, c2, axis) {

    noFill();

    if (axis == 0) {  // Top to bottom gradient
        for (var i = y; i <= y+h; i++) {
            var inter = map(i, y, y+h, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x+w, i);
        }
    }
    else if (axis == 1) {  // Left to right gradient
        for (var i = x; i <= x+w; i++) {
            var inter = map(i, x, x+w, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y+h);
        }
    }
}