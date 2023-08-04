// HTML

const CALENDAR_CONTAINER = document.querySelector('#calendar-content') as HTMLDivElement;
const USER_INPUT = document.getElementById('user-date') as HTMLInputElement;
const CONFIRM_DATE_BTN = document.querySelector('.confirm-btn') as HTMLButtonElement;
const TABLE_CONTAINER = document.getElementById('table-container') as HTMLDivElement;
const TABLE_PERIOD = document.querySelectorAll('td.period') as NodeListOf<Element>;
const PERIOD_MODAL = document.getElementById('period-modal') as HTMLDivElement;
const CALCULATE_PERIODS_BTN = document.getElementById('periods-btn') as HTMLButtonElement;
const OPTIONS_CONTAINER = document.getElementById('options-container') as HTMLDivElement;

// Month strings array

const months = [
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

const calendarHandler = () => {
    const userInput = USER_INPUT.value;
    if (userInput === null ||
        userInput === undefined ||
        userInput === '') {
        alert('Морате изабрати датум');
    } else {
        const parsedDate = new Date(userInput);
        toggleModal()
        toggleVisible(TABLE_CONTAINER, OPTIONS_CONTAINER)
        generateCalendar(parsedDate)
    }
};

const generateCalendar = (start: Date): void => {
    let loopDate = start;
    let endDate = new Date(start.getFullYear(), start.getMonth() + 12, start.getDate());
    let calendarHTML = '';
    const weekdaysHTML = `<p class="week-day px-1">Нед</p>
    <p class="week-day px-1">Пон</p>
    <p class="week-day px-1">Уто</p>
    <p class="week-day px-1">Сри</p>
    <p class="week-day px-1">Чет</p>
    <p class="week-day px-1">Пет</p>
    <p class="week-day px-1">Суб</p>
    `

    while (loopDate <= endDate) {
        const currentMonth = loopDate.getMonth();
        let firstDayOfMonth = new Date(loopDate.getFullYear(), currentMonth, loopDate.getDate()).getDay();
        let lastDayOfMonth = new Date(loopDate.getFullYear(), currentMonth + 1, 0).getDay();

        calendarHTML +=
            `<div class="month col-lg-3 my-2 mx-1 bg-white border rounded shadow" month-index="${currentMonth}">
                <h3 class="mb-3 month-heading">${months[currentMonth]}</h3>
                <h6 class="mb-3 year-heading">${loopDate.getFullYear()}</h6>
                <div class="row">
                ${weekdaysHTML}
                </div>
                <div class="row days">`;

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarHTML += `<p class="inactive month-day p-2 m-0"></p>`
        }

        while (loopDate.getMonth() === currentMonth && loopDate <= endDate) {
            let isOffDay = loopDate.getDay() === 0 || loopDate.getDay() === 6 ? "offday" : "";
            calendarHTML += `<p class="${isOffDay} day-index-${loopDate.getDay()} month-day p-2 text-center m-0">${loopDate.getDate()}</p>`;
            loopDate.setDate(loopDate.getDate() + 1);
        }

        for (let i = lastDayOfMonth + 1; i <= 6; i++) {
            calendarHTML += `<p class="inactive month-day p-2 m-0"></p>`

        }

        calendarHTML +=
            `</div>
        </div>`;
    }

    CALENDAR_CONTAINER.innerHTML += calendarHTML;
    const ALL_CALENDAR_DATES = document.querySelectorAll('p.month-day:not(.inactive)') as NodeListOf<HTMLElement>;
    addOffDays(ALL_CALENDAR_DATES);
    addPeriod(TABLE_PERIOD);
};

// Visibility

const toggleVisible = (...elements: Element[]): void => {
    elements.forEach((element: Element) => {
        element.classList.toggle('visible');
    });
};

    // for handling bootstrap modal

const toggleModal = () => {
    $('#inputModal').modal('hide');
}

// Loops for event listeners

const addOffDays = (daysArr: NodeListOf<HTMLElement>) => {
    daysArr.forEach(date => {  // ne dozvoljava for-of loop na NodeListOf<Element> ???
        date.addEventListener('click', () => {
            date.classList.toggle('offday')
        })
    })
    let mouseDown = false;

    document.addEventListener('mousedown', () => {
        mouseDown = true;
    });
    document.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    daysArr.forEach((date) => {
        date.addEventListener('mouseenter', () => {
            if (mouseDown) {
                date.classList.add('offday');
            }
        });
    });

};

const addPeriod = (periodArr: NodeListOf<Element>) => {
    for (let period of periodArr as any) {
        period.addEventListener('click', () => {
            period.classList.toggle('table-warning')
            period.classList.toggle('active-period')
        })
    }
};

// Functions for calculating periods

const calculatePeriodsHandler = () => {
    const tableDays = document.querySelectorAll('tr.table-day') as NodeListOf<Element>;
    const months = document.querySelectorAll('.month') as NodeListOf<Element>;
    let periodsPerMonth = [];
    let totalPeriods = 0;
    let iter = 1;

    for (let month of months as any) {
        let currentMonthPeriods = 0

        for (let day of tableDays as any) {
            let activePeriods = day.querySelectorAll('td.active-period').length
            currentMonthPeriods += Number(month.querySelectorAll(`.days > .day-index-${iter}:not(.offday)`).length * activePeriods)
            iter += 1
        }

        totalPeriods += currentMonthPeriods;
        periodsPerMonth.push(currentMonthPeriods)
        iter = 1;
    }
    renderPeriodsModal(periodsPerMonth, totalPeriods)
};

const renderPeriodsModal = (periodsArr: number[], periodsTotal: number) => {
    const monthNames = document.querySelectorAll('.month-heading') as NodeListOf<Element>;
    const yearNames = document.querySelectorAll('.year-heading') as NodeListOf<Element>;

    let modalHTML = `
        <table class="table table-responsive">
            <tr>
                <th>Мјесец</th>
                <th>Година</th>
                <th>Број часова</th>
            </tr>
    `;
    let i = 0;
    for (let month of monthNames as any) {
        modalHTML += `
            <tr>
                <td>${month.innerHTML}</td>
                <td>${yearNames[i].innerHTML}</td>
                <td>${periodsArr[i]}</td>
            </tr>
        `;
        i++
    }
    modalHTML += `
        <td class="fw-bold" colspan="2">Укупно часова: </td>
        <td class="fw-bold">${periodsTotal}</td>
    </table>`
    PERIOD_MODAL.innerHTML = modalHTML
};

// Event Listeners

CONFIRM_DATE_BTN.addEventListener('click', calendarHandler);
CALCULATE_PERIODS_BTN.addEventListener('click', calculatePeriodsHandler);