// HTML
var USER_INPUT = document.getElementById('user-date');
var CONFIRM_DATE_BTN = document.querySelector('.confirm-btn');
var CALENDAR_CONTAINER = document.querySelector('#calendar-content');
var CALENDAR_OPTIONS_CONTAINER = document.getElementById('year-options-container');
var RESET_DATE_BTN = document.getElementById('reset-date-btn');
var YEAR_BTNS = document.querySelectorAll('.year-btn');
var TABLE_CONTAINER = document.getElementById('table-container');
var TABLE_PERIOD = document.querySelectorAll('td.period');
var PERIOD_MODAL = document.getElementById('period-modal');
var TABLE_BTN_CONTAINER = document.getElementById('table-btn-container');
var CALCULATE_PERIODS_BTN = document.getElementById('periods-btn');
// Month strings array
var months = [
    "Јануар",
    "Фебруар",
    "Март",
    "Април",
    "Мај",
    "Јун",
    "Јул",
    "Август",
    "Септембар",
    "Октобар",
    "Новембар",
    "Децембар"
];
// Calendar functions
var renderCalendar = function () {
    var userInput = USER_INPUT.value;
    if (userInput === null ||
        userInput === undefined ||
        userInput === '') {
        alert('Морате изабрати датум');
    }
    else {
        var parsedDate = new Date(userInput);
        toggleModal();
        toggleVisible(TABLE_CONTAINER, TABLE_BTN_CONTAINER, CALENDAR_OPTIONS_CONTAINER);
        generateCalendar(parsedDate);
        yearBtnHandler(YEAR_BTNS, parsedDate);
        toggleActivePeriod(TABLE_PERIOD);
    }
};
var generateCalendar = function (start) {
    var loopDate = start;
    var endDate = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
    var calendarHTML = '';
    var weekdaysHTML = "<p class=\"week-day px-1\">\u041D\u0435\u0434</p>\n    <p class=\"week-day px-1\">\u041F\u043E\u043D</p>\n    <p class=\"week-day px-1\">\u0423\u0442\u043E</p>\n    <p class=\"week-day px-1\">\u0421\u0440\u0438</p>\n    <p class=\"week-day px-1\">\u0427\u0435\u0442</p>\n    <p class=\"week-day px-1\">\u041F\u0435\u0442</p>\n    <p class=\"week-day px-1\">\u0421\u0443\u0431</p>\n    ";
    while (loopDate <= endDate) {
        var currentMonth = loopDate.getMonth();
        var firstDayOfMonth = new Date(loopDate.getFullYear(), currentMonth, loopDate.getDate()).getDay();
        var lastDayOfMonth = new Date(loopDate.getFullYear(), currentMonth + 1, 0).getDay();
        calendarHTML +=
            "<div class=\"month col-lg-3 my-2 mx-1 bg-white border rounded shadow\" month-index=\"".concat(currentMonth, "\">\n                <h3 class=\"mb-3 month-heading\">").concat(months[currentMonth], "</h3>\n                <h6 class=\"mb-3 year-heading\">").concat(loopDate.getFullYear(), "</h6>\n                <div class=\"row\">\n                ").concat(weekdaysHTML, "\n                </div>\n                <div class=\"row days\">");
        for (var i = 0; i < firstDayOfMonth; i++) {
            calendarHTML += "<p class=\"inactive month-day p-2 m-0\"></p>";
        }
        while (loopDate.getMonth() === currentMonth && loopDate <= endDate) {
            var isOffDay = loopDate.getDay() === 0 || loopDate.getDay() === 6 ? "offday" : "";
            calendarHTML += "<p class=\"".concat(isOffDay, " day-index-").concat(loopDate.getDay(), " month-day p-2 text-center m-0\">").concat(loopDate.getDate(), "</p>");
            loopDate.setDate(loopDate.getDate() + 1);
        }
        for (var i = lastDayOfMonth + 1; i <= 6; i++) {
            calendarHTML += "<p class=\"inactive month-day p-2 m-0\"></p>";
        }
        calendarHTML +=
            "</div>\n        </div>";
    }
    CALENDAR_CONTAINER.innerHTML += calendarHTML;
    var ALL_CALENDAR_DATES = document.querySelectorAll('p.month-day:not(.inactive)');
    toggleOffDay(ALL_CALENDAR_DATES);
};
// Visibility
var toggleVisible = function () {
    var elements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elements[_i] = arguments[_i];
    }
    elements.forEach(function (element) {
        element.classList.toggle('visible');
    });
};
// for handling bootstrap modal
var toggleModal = function () {
    $('#inputModal').modal('hide');
};
// Loops for event listeners
var toggleOffDay = function (daysArr) {
    var mouseDown = false;
    daysArr.forEach(function (date) {
        date.addEventListener('pointerdown', function () {
            date.classList.toggle('offday');
        });
    });
    document.addEventListener('pointerdown', function () {
        mouseDown = true;
    });
    document.addEventListener('pointerup', function () {
        mouseDown = false;
    });
    daysArr.forEach(function (date) {
        date.addEventListener('pointerenter', function () {
            if (mouseDown) {
                date.classList.add('offday');
            }
        });
    });
};
var toggleActivePeriod = function (periodArr) {
    periodArr.forEach(function (period) {
        period.addEventListener('click', function () {
            period.classList.toggle('table-warning');
            period.classList.toggle('active-period');
        });
    });
};
var yearBtnHandler = function (btnsArr, start) {
    var startDate = new Date(start.getFullYear(), start.getMonth() - 12, start.getDate());
    btnsArr.forEach(function (btn) {
        if (btn.id === 'previous-year') {
            btn.addEventListener('click', function () {
                CALENDAR_CONTAINER.innerHTML = '';
                generateCalendar(new Date(startDate.getFullYear() - 1, startDate.getMonth(), startDate.getDate()));
                startDate = new Date(startDate.getFullYear() - 1, startDate.getMonth(), startDate.getDate());
            });
        }
        else if (btn.id === 'next-year') {
            btn.addEventListener('click', function () {
                CALENDAR_CONTAINER.innerHTML = '';
                generateCalendar(new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()));
                startDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
            });
        }
    });
};
// Functions for calculating periods
var calculatePeriodsHandler = function () {
    var tableDays = document.querySelectorAll('tr.table-day');
    var months = document.querySelectorAll('.month');
    var periodsPerMonth = [];
    var totalPeriods = 0;
    var iter = 1;
    for (var _i = 0, _a = months; _i < _a.length; _i++) {
        var month = _a[_i];
        var currentMonthPeriods = 0;
        for (var _b = 0, _c = tableDays; _b < _c.length; _b++) {
            var day = _c[_b];
            var activePeriods = day.querySelectorAll('td.active-period').length;
            currentMonthPeriods += Number(month.querySelectorAll(".days > .day-index-".concat(iter, ":not(.offday)")).length * activePeriods);
            iter += 1;
        }
        totalPeriods += currentMonthPeriods;
        periodsPerMonth.push(currentMonthPeriods);
        iter = 1;
    }
    renderPeriodsModal(periodsPerMonth, totalPeriods);
};
var renderPeriodsModal = function (periodsArr, periodsTotal) {
    var monthNames = document.querySelectorAll('.month-heading');
    var yearNames = document.querySelectorAll('.year-heading');
    var modalHTML = "\n        <table class=\"table table-responsive\">\n            <tr>\n                <th>\u041C\u0458\u0435\u0441\u0435\u0446</th>\n                <th>\u0413\u043E\u0434\u0438\u043D\u0430</th>\n                <th>\u0411\u0440\u043E\u0458 \u0447\u0430\u0441\u043E\u0432\u0430</th>\n            </tr>\n    ";
    var i = 0;
    for (var _i = 0, _a = monthNames; _i < _a.length; _i++) {
        var month = _a[_i];
        modalHTML += "\n            <tr>\n                <td>".concat(month.innerHTML, "</td>\n                <td>").concat(yearNames[i].innerHTML, "</td>\n                <td>").concat(periodsArr[i], "</td>\n            </tr>\n        ");
        i++;
    }
    modalHTML += "\n        <td class=\"fw-bold\" colspan=\"2\">\u0423\u043A\u0443\u043F\u043D\u043E \u0447\u0430\u0441\u043E\u0432\u0430: </td>\n        <td class=\"fw-bold\">".concat(periodsTotal, "</td>\n    </table>");
    PERIOD_MODAL.innerHTML = modalHTML;
};
// Event Listeners
CONFIRM_DATE_BTN.addEventListener('click', renderCalendar);
CALCULATE_PERIODS_BTN.addEventListener('click', calculatePeriodsHandler);
RESET_DATE_BTN.addEventListener('click', function () {
    location.reload();
});
