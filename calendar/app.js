class MonthData extends Date {
    constructor(data) {
        super(`${data.y.toString().padStart(4, '0')}-${data.m.toString().padStart(2, '0')}-${data.d.toString().padStart(2, '0')}`);
    }
    YYYY = this.getFullYear().toString().padStart(4, "0");
    MM = (this.getMonth() + 1).toString().padStart(2, "0");
    datesOfMonth = (() => {
        const temp1 = (this.getFullYear() * 12) + this.getMonth() + 1; // = monthOfToday + 1
        const temp = new Date(`${Math.floor(temp1 / 12).toString().padStart(4, '0')}-${((temp1 % 12) + 1).toString().padStart(2, '0')}-01`);
        temp.setDate(0);
        return temp.getDate();
    })();
    shortNameOfDay = (() => {
        const week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return week[this.getDay()];
    })();
    // idx start from 1.
    dayIdxOf1st = new Date(`${this.YYYY}-${this.MM}-01`).getDay();
    weekIdx = Math.ceil((this.dayIdxOf1st + this.getDate()) / 7);
    weeksOfMonth = Math.ceil((this.dayIdxOf1st + this.datesOfMonth) / 7);
    inputValue = `${this.YYYY}-${this.MM}`;
}
class DateData extends MonthData {
    constructor(data) {
        super(data);
    }
    // Indexes are start from 1.
    dateIdx = this.getDate();
    dayIdx = this.getDay() + 1;
    shortNameOfMonth = new Intl.DateTimeFormat("en-US", { month: 'short' }).format(this);
    nameOfDay = new Intl.DateTimeFormat("en-US", { weekday: 'long' }).format(this);
    ordinalDate = (() => {
        const n = parseInt(this.getDate().toString(), 10);
        const suffix = ['th', 'st', 'nd', 'rd'];
        const mod100 = n % 100;
        return n + (suffix[(mod100 - 20) % 10] || suffix[mod100] || suffix[0]);
    })();
}
const dataOfSelected = {
    y: new Date().getFullYear(),
    m: new Date().getMonth() + 1,
    d: new Date().getDate(),
};
const head = document.querySelector('head');
const linkCss = document.createElement('link');
linkCss.rel = 'stylesheet';
linkCss.href = 'style.css';
const notranslate = document.createElement('meta');
notranslate.name = 'google';
notranslate.content = 'notranslate';
initialize();
function initialize() {
    setEventListener();
    setCalendar();
    function setEventListener() {
        const HTML = {
            gotoPrevYear: document.querySelector('#goto-previous-year'),
            gotoNextYear: document.querySelector('#goto-next-year'),
            gotoPrevMonth: document.querySelector('#goto-previous-month'),
            gotoNextMonth: document.querySelector('#goto-next-month'),
            gotoAnywhen: document.querySelector('#goto-anywhen'),
            gotoToday: document.querySelector('#goto-today'),
        };
        HTML.gotoPrevYear.addEventListener('click', () => {
            changeDataOfSelected(-12);
            setCalendar();
        });
        HTML.gotoPrevMonth.addEventListener('click', () => {
            changeDataOfSelected(-1);
            setCalendar();
        });
        HTML.gotoNextYear.addEventListener('click', () => {
            changeDataOfSelected(12);
            setCalendar();
        });
        HTML.gotoNextMonth.addEventListener('click', () => {
            changeDataOfSelected(1);
            setCalendar();
        });
        HTML.gotoAnywhen.addEventListener('input', () => {
            const temp = HTML.gotoAnywhen.value;
            if (temp === '') {
                return;
            }
            dataOfSelected.y = Math.max(Math.min(parseInt(temp.substring(0, 4)), 9999), 1);
            dataOfSelected.m = Math.max(Math.min(parseInt(temp.substring(5, 7)), 12), 1);
            setCalendar();
        });
        HTML.gotoToday.addEventListener('click', () => {
            dataOfSelected.y = new Date().getFullYear();
            dataOfSelected.m = new Date().getMonth() + 1; // monthIndex + 1
            dataOfSelected.d = new Date().getDate();
            setCalendar();
        });
        const week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        for (let i = 0; i < 6; i++) {
            for (let j in week) {
                const tableCell = document.querySelector(`#w${i + 1} .${week[j]}`);
                tableCell.addEventListener('click', () => {
                    const data = document.querySelector(`#w${i + 1} .${week[j]}` + ' div').innerHTML;
                    if (!(data === '')) {
                        erasePrevColor();
                        handleDateSelected(tableCell, week[j], data);
                    }
                });
            }
        }
    }
    function changeDataOfSelected(amount) {
        const tempMonth = (dataOfSelected.y * 12) + dataOfSelected.m + amount - 1;
        dataOfSelected.y = Math.max(Math.min(Math.floor(tempMonth / 12), 9999), 1);
        dataOfSelected.m = (tempMonth % 12) + 1;
        const changedDatesOfMonth = new MonthData({ y: dataOfSelected.y, m: dataOfSelected.m, d: 1 }).datesOfMonth;
        if (dataOfSelected.d > changedDatesOfMonth) {
            dataOfSelected.d = changedDatesOfMonth;
        }
    }
}
function erasePrevColor() {
    const selected = new DateData(dataOfSelected);
    document.querySelector(`#w${selected.weekIdx} .${selected.shortNameOfDay}`).style.backgroundColor = '#FFF';
    document.querySelector(`#weekdays .${selected.shortNameOfDay}`).style.backgroundColor = '#FFF';
}
function setCalendar() {
    const selected = new MonthData(dataOfSelected);
    hideUselessWeek(selected.weeksOfMonth);
    clearCalendar(selected.weeksOfMonth);
    setInputValue(selected.inputValue);
    fillDateField(selected.dayIdxOf1st, selected.datesOfMonth);
    handleDateSelected(document.querySelector(`#w${selected.weekIdx} .${selected.shortNameOfDay}`), selected.shortNameOfDay, dataOfSelected.d.toString());
    function hideUselessWeek(w) {
        document.querySelector("#w5").style.display = '';
        document.querySelector("#w6").style.display = '';
        if (w <= 5) {
            document.querySelector("#w6").style.display = 'none';
            if (w == 4) {
                document.querySelector("#w5").style.display = 'none';
            }
        }
    }
    function clearCalendar(w) {
        const week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < 7; j++) {
                const CSSSelector = `#w${i + 1} .${week[j]}`;
                document.querySelector(CSSSelector).style.backgroundColor = '#FFF';
                document.querySelector(CSSSelector + ' div').innerHTML = '';
            }
        }
        for (let i of week) {
            document.querySelector(`#weekdays .${i}`).style.backgroundColor = '#FFF';
        }
    }
    function setInputValue(value) {
        document.querySelector('#goto-anywhen').value = value;
    }
    function fillDateField(idxOf1st, date) {
        const week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        for (let i = 0; i < date; i++) {
            const css = `#w${Math.ceil((idxOf1st + i + 1) / 7)} .${week[(idxOf1st + i) % 7]}`;
            document.querySelector(css + ' div').innerHTML = (i + 1).toString();
        }
    }
}
function handleDateSelected(tableCell, day, data) {
    if (tableCell.style.backgroundColor === 'rgb(255, 255, 255)') {
        tableCell.style.backgroundColor = '#DDF';
        document.querySelector(`#weekdays .${day}`).style.backgroundColor = '#DDF';
    }
    dataOfSelected.d = parseInt(data);
    const selected = new DateData(dataOfSelected);
    const infoOfSelected = `${selected.nameOfDay} | ${selected.shortNameOfMonth}. ${selected.ordinalDate}, ${selected.getFullYear()}`;
    document.querySelector('#info-selected').innerHTML = infoOfSelected;
}
