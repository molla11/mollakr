class MonthData extends Date {
    constructor(data: { y: number, m: number, d: number }) {
        super(`${data.y.toString().padStart(4, '0')}-${data.m.toString().padStart(2, '0')}-${data.d.toString().padStart(2, '0')}`);
    }
    
    readonly YYYY = this.getFullYear().toString().padStart(4, "0");
    readonly MM = (this.getMonth() + 1).toString().padStart(2, "0");

    readonly datesOfMonth = (() => {
        const temp1 = (this.getFullYear() * 12) + this.getMonth() + 1; // = monthOfToday + 1
        const temp = new Date(`${Math.floor(temp1 / 12).toString().padStart(4, '0')}-${((temp1 % 12) + 1).toString().padStart(2, '0')}-01`);
        temp.setDate(0);
        return temp.getDate();
    })();

    readonly shortNameOfDay = (() => {
        const week: Readonly<string[]> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return week[this.getDay()];
    })();

    // idx start from 1.
    readonly dayIdxOf1st = new Date(`${this.YYYY}-${this.MM}-01`).getDay();
    readonly weekIdx = Math.ceil((this.dayIdxOf1st + this.getDate()) / 7);

    readonly weeksOfMonth = Math.ceil((this.dayIdxOf1st + this.datesOfMonth) / 7);
    readonly inputValue = `${this.YYYY}-${this.MM}`;
}

class DateData extends MonthData {
    constructor(data: { y: number, m: number, d: number }) {
        super(data);
    }

    // idx start from 1.
    readonly weekIdx = this.weekIdx;
    readonly dateIdx = this.getDate();
    readonly dayIdx = this.getDay() + 1;

    readonly shortNameOfMonth = new Intl.DateTimeFormat("en-US", { month: 'short' }).format(this);
    readonly nameOfDay = new Intl.DateTimeFormat("en-US", { weekday: 'long' }).format(this);
    readonly ordinalDate = (() => {
        const n = parseInt(this.getDate().toString(), 10);
        const suffix = ['th', 'st', 'nd', 'rd'];
        const mod100 = n % 100;
    
        return n + (suffix[(mod100 - 20) % 10] || suffix[mod100] || suffix[0]);
    })();
}

const dataOfSelected = {
    y: new Date().getFullYear(),
    m: new Date().getMonth() + 1, // monthIndex + 1
    d: new Date().getDate(),
}

initialize();

function initialize() {
    setEventListener();
    setCalendar();

    function setEventListener() {
        const HTML = {
            gotoPrevYear: document.querySelector<HTMLSpanElement>('#goto-previous-year'),
            gotoNextYear: document.querySelector<HTMLSpanElement>('#goto-next-year'),
            gotoPrevMonth: document.querySelector<HTMLSpanElement>('#goto-previous-month'),
            gotoNextMonth: document.querySelector<HTMLSpanElement>('#goto-next-month'),
            gotoAnywhen: document.querySelector<HTMLInputElement>('#goto-anywhen'),
            gotoToday: document.querySelector<HTMLSpanElement>('#goto-today'),
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
            if (!(temp === '')) {
                dataOfSelected.y = Math.max(Math.min(parseInt(temp.substring(0, 4)), 9999), 1);
                dataOfSelected.m = Math.max(Math.min(parseInt(temp.substring(5, 7)), 12), 1);
                setCalendar();
            }
        });
        HTML.gotoToday.addEventListener('click', () => {
            dataOfSelected.y = new Date().getFullYear();
            dataOfSelected.m = new Date().getMonth() + 1; // monthIndex + 1
            dataOfSelected.d = new Date().getDate();
            setCalendar();
        })
    
        const week: Readonly<string[]> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    
        for (let i = 0; i < 6; i++) {
            for (let j in week) {
                const tableCell = document.querySelector<HTMLTableCellElement>(`#w${i + 1} .${week[j]}`);
                tableCell.addEventListener('click', () => {
                    const data = document.querySelector<HTMLDivElement>(`#w${i + 1} .${week[j]}` + ' div').innerHTML;
                    if (!(data === '')) {
                        erasePrevColor();
                        handleDateSelected(tableCell, week[j], data);
                    }
                })
            }
        }

        function changeDataOfSelected(amount: number) {
            const tempMonth = (dataOfSelected.y * 12) + dataOfSelected.m + amount - 1;
            if (tempMonth < 120000 && tempMonth > 11) {
                dataOfSelected.y = Math.max(Math.min(Math.floor(tempMonth / 12), 9999), 1);
                dataOfSelected.m = (tempMonth % 12) + 1;
            }
        }

        function erasePrevColor() {
            const selected = new DateData(dataOfSelected);
            document.querySelector<HTMLTableCellElement>(`#w${selected.weekIdx} .${selected.shortNameOfDay}`).style.backgroundColor = '#FFF';
            document.querySelector<HTMLTableCellElement>(`#weekdays .${selected.shortNameOfDay}`).style.backgroundColor = '#FFF';
        }

    } 
}

function setCalendar() { // every event (changing month)
    const selected = new MonthData(dataOfSelected);

    hideUselessWeek(selected.weeksOfMonth);
    clearCalendar(selected.weeksOfMonth);
    setInputValue(selected.inputValue);
    fillDateField(selected.dayIdxOf1st, selected.datesOfMonth);
    handleDateSelected(document.querySelector<HTMLTableCellElement>(`#w${selected.weekIdx} .${selected.shortNameOfDay}`), selected.shortNameOfDay, dataOfSelected.d.toString());

    function hideUselessWeek(w: number) {
        document.querySelector<HTMLTableColElement>("#w5").style.display = '';
        document.querySelector<HTMLTableColElement>("#w6").style.display = '';
        if (w <= 5) {
            document.querySelector<HTMLTableColElement>("#w6").style.display = 'none';
            if (w == 4) {
                document.querySelector<HTMLTableColElement>("#w5").style.display = 'none';
            }
        }
    }

    function clearCalendar(w: number) {
        const week: Readonly<string[]> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < 7; j++) {
                const CSSSelector = `#w${i + 1} .${week[j]}`;
                document.querySelector<HTMLTableCellElement>(CSSSelector).style.backgroundColor = '#FFF';
                document.querySelector<HTMLDivElement>(CSSSelector + ' div').innerHTML = '';
            }
        }
    
        for (let i = 0; i < 7; i++) {
            document.querySelector<HTMLTableCellElement>(`#weekdays .${week[i]}`).style.backgroundColor = '#FFF';
        }
    }

    function setInputValue(value: string) { 
        document.querySelector<HTMLInputElement>('#goto-anywhen').value = value;
    }

    function fillDateField(start: number, date: number) {
        const week: Readonly<string[]> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        
        for (let i = 0; i < date; i++) {
            const css = `#w${Math.ceil((start + i + 1) / 7)} .${week[(start + i) % 7]}`;
            document.querySelector<HTMLDivElement>(css + ' div').innerHTML = (i + 1).toString();
        }
    }
}

function handleDateSelected(tableCell: HTMLTableCellElement, day:string, data: string) {
    if (tableCell.style.backgroundColor === 'rgb(255, 255, 255)') {
        tableCell.style.backgroundColor = '#DDF';
        document.querySelector<HTMLTableCellElement>(`#weekdays .${day}`).style.backgroundColor = '#DDF';
    }
    dataOfSelected.d = parseInt(data);
    const selected = new DateData(dataOfSelected);
    const infoOfSelected = `${selected.nameOfDay} | ${selected.shortNameOfMonth}. ${selected.ordinalDate}, ${selected.getFullYear()}`
    document.querySelector<HTMLSpanElement>('#info-selected').innerHTML = infoOfSelected;
}