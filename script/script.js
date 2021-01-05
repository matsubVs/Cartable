const tbody = document.querySelector('tbody');
const headForm = document.querySelector('.head-form__wrapper');
const tableHeader = document.querySelector('.table__head');
const bottomForm = document.querySelector('.bottom-form__wrapper');
const formSubmit = document.querySelector('.head-form__btn');

const getTopFormInfo = (clear = false) => {

    const headElements = [...headForm.elements].filter(item => item.type === "text");
    if (clear) {
        headElements.forEach(item => item.value = '');
        return;
    }

    return headElements.map(item => item.value);
};

const getBottomFormInfo = () => [...bottomForm.elements].map(item => item.value);

const render = tableData => {
    tbody.textContent = '';
    tableData.forEach(item => tbody.appendChild(item));
};

const createRow = function(...args) {
    const row = document.createElement('tr');
    for (let i = 0; i < 5; i++) {
        const col = document.createElement('td');
        col.textContent = args[i];
        row.appendChild(col);
    }

    return row;
};

const addNewRow = carInfo => {
    const items = tbody.querySelectorAll('tr');
    const numbers = [];
    [...items].forEach(item => {
        numbers.push(+[...item.children][0].textContent);
    });

    const lastIndex = numbers.reduce((a, b) => Math.max(a, b));
    
    const createdRow = createRow(+lastIndex + 1, ...carInfo);
    const newTable = [...items];
    newTable.push(createdRow);

    getTopFormInfo(true);

    render(newTable);
};

const filterRows = carInfo => {
    if (carInfo.filter(item => item).length === 0) {
        const dnone = [...document.querySelectorAll('.d-none')];
        dnone.forEach(item => item.classList.remove('d-none'));
    }
    
    const filterCarInfo = carInfo.map((item, index) => [item, index]);

    const tbodyChildrens = [...tbody.children];

    tbodyChildrens.forEach(item => {

        const itemChildrens = [...item.children];
        itemChildrens.splice(0, 1);
        let flag = true;

        itemChildrens.forEach((value, index) => {
            if (filterCarInfo[index][1] === index) {
                if (value.textContent.includes(filterCarInfo[index][0]) && flag) {
                    item.classList.remove('d-none');
                } else {
                    flag = false;
                    item.classList.add('d-none');
                }
            }
        });
    });
};

const sortRows = target => {
    const childrens = [...tableHeader.querySelectorAll('th')];
    const clickedRow = childrens.map((item, index) => item === target ? index : false).filter(item => item !== false);

    const rows = [...tbody.querySelectorAll('tr')].map(item => [...item.children]);

    rows.sort((a, b) => a[clickedRow].textContent.localeCompare(b[clickedRow].textContent));
    
    const formattedRows = rows => {
        const outputRows = [];
        rows.map(item => {
            const row = document.createElement('tr');
            item.forEach(value => {
                row.appendChild(value);
            });

            outputRows.push(row);
        });

        return outputRows;
    };

    render(formattedRows(rows));
};

formSubmit.addEventListener('click', event => {    
    event.preventDefault();
    const head = getTopFormInfo();

    addNewRow(head);
});

bottomForm.addEventListener('input', () => {
    const bottom = getBottomFormInfo();
    filterRows(bottom);
});

tableHeader.addEventListener('click', event => {
    const target = event.target;
    sortRows(target);
});
