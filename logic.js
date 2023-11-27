const c_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const c_suffix = ["st", "nd", "rd", "th"];

//Why is Sunday day 0?
//Store which month we are currently looking at
var g_currentlyViewMonthOffset = 0;
//Store which days we have selected
var g_clickedElements = new Set();

//Run when we first get on the website
function generateCalender() {

    let date = new Date;
    document.getElementById("CurrentDate").innerHTML = date.toLocaleString("default", {month: "long"}) + " ";
    document.getElementById("CurrentDate").innerHTML += date.toLocaleString("default", {day: "numeric"});
    {
        let furthestRightDigit = Math.min(getDigit(date.getDate(), 1), 4) - 1;
        document.getElementById("CurrentDate").innerHTML += c_suffix[furthestRightDigit] + " ";
    }
    document.getElementById("CurrentDate").innerHTML += date.toLocaleString("default", {weekday: "long"}) + " ";
    document.getElementById("CurrentDate").innerHTML += date.toLocaleString("default", {year: "numeric"}) + " ";

    generateCalenderFromMonth();
}

//Increment and decrement month based on which button we press
function nextMonth() {

    g_currentlyViewMonthOffset += 1;
    generateCalenderFromMonth();
}

function previousMonth() {
    
    g_currentlyViewMonthOffset -= 1;
    generateCalenderFromMonth();
}

//Generates a calender for a month
function generateCalenderFromMonth() {

    destroyChildren(document.getElementById("Calender"));

    let currentDate = new Date;

    let date = new Date;
    date.setMonth(date.getMonth() + g_currentlyViewMonthOffset);

    document.getElementById("Calender").appendChild(document.createTextNode(date.toLocaleString("default", {month: "long"}) + " " + date.toLocaleString("default", {year: "numeric"})));

    let table = document.createElement("table");

    //Adding days to the table
    {
        const tableRow = table.insertRow();
        for (let i = 0; i < c_days.length; i++) {
            const tableEntry = tableRow.insertCell();
            tableEntry.style = "pointer-events: none; user-select: none;"
            tableEntry.appendChild(document.createTextNode(c_days[i]));
        }
    }

    //Get the first date that should appear on the calender
    let dateOnCalender = date;
    let firstOfThisMonth = date;
    let currentMonth = date.getMonth();
    {
        firstOfThisMonth.setDate(1);
        let firstDay = firstOfThisMonth.getDay();
        if (firstDay != 1) {
            if (firstDay == 0) {
                firstDay = 7;
            }
            let daysAgoTillMonday = 1 - firstDay;
            dateOnCalender.setDate(firstOfThisMonth.getDate() + daysAgoTillMonday);
        }
    }

    //Create the table
    for (let i = 0; i < 6; i++) {
        const tableRow = table.insertRow();
        for (let j = 0; j < 7; j++) {
            const tableEntry = tableRow.insertCell();
            tableEntry.appendChild(document.createTextNode(dateOnCalender.getDate()));
            if (dateOnCalender.getMonth() != currentMonth) {
                tableEntry.style = "background-color: grey; pointer-events: none; user-select: none;";
            }
            else if (currentDate > dateOnCalender) {
                tableEntry.style = "background-color: lightgrey; pointer-events: none; user-select: none;";
            }
            else {
                dateOnCalender.setHours(12);
                dateOnCalender.setMinutes(0);
                dateOnCalender.setSeconds(0);
                dateOnCalender.setMilliseconds(0);
                tableEntry.dataset.date = dateOnCalender;
                if (g_clickedElements.has(tableEntry.dataset.date)) {
                    tableEntry.style = "user-select: none; background-color: red;";
                }
                else {
                    tableEntry.style = "user-select: none";
                }
            }
            dateOnCalender.setDate(dateOnCalender.getDate() + 1);
        }
    }

    document.getElementById("Calender").appendChild(table);
    setUpClickableElements();
}

//Used to remove the old calender when switching months
function destroyChildren(node) {

    for (let i = node.childElementCount; i >= 0; i--) {
        node.childNodes[i].remove();
    }
}

//Used to determin the suffix to the date
function getDigit(number, n) {

    return Math.floor((number / Math.pow(10, n - 1)) % 10);
}

//Rerun this everytime we update the calender
function setUpClickableElements() {

    $("td").click(function() {
        if (g_clickedElements.has($(this).data("date"))) {
            $(this).css("background-color", "wheat");
            g_clickedElements.delete($(this).data("date"));
        }
        else {
            $(this).css("background-color", "red");
            g_clickedElements.add($(this).data("date"));
        }
    });
}