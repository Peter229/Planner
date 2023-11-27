const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const suffix = ["st", "nd", "rd", "th"];

//Why is Sunday day 0?
var g_currentlyViewMonthOffset = 0;
var g_clickedElements = new Set();

function generateCalender() {

    let date = new Date;
    document.getElementById("CurrentDate").innerHTML = date.toLocaleString("default", {month: "long"}) + " ";
    document.getElementById("CurrentDate").innerHTML += date.toLocaleString("default", {day: "numeric"});
    {
        let furthestRightDigit = Math.min(getDigit(date.getDate(), 1), 4) - 1;
        document.getElementById("CurrentDate").innerHTML += suffix[furthestRightDigit] + " ";
    }
    document.getElementById("CurrentDate").innerHTML += date.toLocaleString("default", {weekday: "long"}) + " ";
    document.getElementById("CurrentDate").innerHTML += date.toLocaleString("default", {year: "numeric"}) + " ";

    generateCalenderFromMonth();
}

function nextMonth() {

    g_currentlyViewMonthOffset += 1;
    generateCalenderFromMonth();
}

function previousMonth() {
    
    g_currentlyViewMonthOffset -= 1;
    generateCalenderFromMonth();
}

function generateCalenderFromMonth(month) {

    destroyChildren(document.getElementById("Calender"));

    let date = new Date;
    date.setMonth(date.getMonth() + g_currentlyViewMonthOffset);

    document.getElementById("Calender").appendChild(document.createTextNode(date.toLocaleString("default", {month: "long"}) + " " + date.toLocaleString("default", {year: "numeric"})));

    let table = document.createElement("table");

    //Adding days to the table
    {
        const tableRow = table.insertRow();
        for (let i = 0; i < days.length; i++) {
            const tableEntry = tableRow.insertCell();
            tableEntry.style = "pointer-events: none; user-select: none;"
            tableEntry.appendChild(document.createTextNode(days[i]));
        }
    }

    //Get the first date that should appear on the calender
    let dateOnCalender = date;
    let firstOfThisMonth = date;
    let currentMonth = date.getMonth();
    {
        firstOfThisMonth.setDate(1);
        if (firstOfThisMonth.getDay() != 1) {
            let daysAgoTillMonday = 1 - firstOfThisMonth.getDay();
            dateOnCalender.setDate(firstOfThisMonth.getDate() + daysAgoTillMonday);
        }
    }

    //Create the table
    for (let i = 0; i < 5; i++) {
        const tableRow = table.insertRow();
        for (let j = 0; j < 7; j++) {
            const tableEntry = tableRow.insertCell();
            tableEntry.appendChild(document.createTextNode(dateOnCalender.getDate()));
            if (dateOnCalender.getMonth() != currentMonth) {
                tableEntry.style = "background-color: grey; pointer-events: none; user-select: none;";
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

function destroyChildren(node) {

    for (let i = node.childElementCount; i >= 0; i--) {
        node.childNodes[i].remove();
    }
}

function getDigit(number, n) {

    return Math.floor((number / Math.pow(10, n - 1)) % 10);
}

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