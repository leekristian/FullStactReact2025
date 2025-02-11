// Initialize //
// set current date on the add task section
const inputDate = document.getElementById('task-date');
inputDate.value = formatDate(new Date()); // format today date to YYYY-MM-DD to set into input type date field

// retrieve tbody element
const tblBody = document.getElementById('task-table');

// load tasks from local storage
loadTasks();

/*
    Load tasks from local storage to tbody on page load/refresh
    @input none
    @result populate tbody if tasks are existing from localstorage

*/
function loadTasks() {
    const storageTasks = localStorage.getItem('tasks');
    // console.log("retrieving storage tasks ", storageTasks);

    if(storageTasks != null) {
        tblBody.innerHTML = "";
        const tasks = JSON.parse(storageTasks); // returns iterable object so can use foreach here

        // Iterate through the stored tasks
        tasks.forEach(task => {
            const row = tblBody.insertRow();
            row.setAttribute("class", task.status); // set class attribute for this <tr> and set to incomplete by default

            row.insertCell().textContent = task.taskName;
            row.insertCell().textContent = task.description;
            row.insertCell().textContent = task.dueDate;

            const actions = row.insertCell();
            createActions(row, actions);            
        });
    }
}

/*
    Add tasks into tbody
    @input none
    @result inserts a row into tbody as td that contains task name, description, due date and action buttons
*/
function addTask() {
    const row = tblBody.insertRow();
    row.setAttribute("class", 'incomplete'); // set class attribute for this <tr> and set to incomplete by default

    // insert td for task name, description, due date by this order
    row.insertCell().textContent = document.getElementById('task-name').value;
    row.insertCell().textContent = document.getElementById('task-desc').value;
    row.insertCell().textContent = document.getElementById('task-date').value;
   
    // insert td for action and create action buttons
    const td = row.insertCell();
    createActions(row, td);    

    /// re-syncs data to localstorage
    saveTask();
}

/*
    Updates table row data to reflect edited values into the table and save to storage
    @input row 
    @result updates 
*/
function updateRow(row) {
    const name = row.cells[0];
    const desc = row.cells[1];
    const date = row.cells[2];

    name.textContent = name.getElementsByTagName("input")[0] ? name.getElementsByTagName("input")[0].value : name.textContent;
    desc.textContent = desc.getElementsByTagName("input")[0] ? desc.getElementsByTagName("input")[0].value : desc.textContent;
    date.textContent = date.getElementsByTagName("input")[0] ? date.getElementsByTagName("input")[0].value : date.textContent;

    // re-syncs data to localstorage
    saveTask();
}

/*
    Converts td text content to input type text to make value editable
    @input row
    @result create <input> element and sets textContent as value and append created element to tr
*/
function editRow(row) {
    const name = row.cells[0]; // td
    const desc = row.cells[1]; // td
    const date = row.cells[2]; // td

    // input element for task name td
    const inputTask = document.createElement("input");
    inputTask.setAttribute("type","text");
    inputTask.setAttribute("value",name.textContent);
    console.log(inputTask);
    name.textContent = ""; // set to empty to replace td content with text input
    name.appendChild(inputTask);

    // input element for task desc td
    const inputDesc = document.createElement("input");
    inputDesc.setAttribute("type","text");
    inputDesc.setAttribute("value",desc.textContent);
    desc.textContent = ""; // set to empty to replace td content with text input
    desc.appendChild(inputDesc);
    
    // input element for task due date td
    const inputDate = document.createElement("input");
    inputDate.setAttribute("type","date");
    inputDate.setAttribute("value",formatDate(new Date(date.textContent)));
    date.textContent = "";
    date.appendChild(inputDate);
}

/*
    Delete selected row from tbody
    @input row
    @result deletes row and updates localstorage
*/
function deleteRow(row) {
    // remove selected tr element
    tblBody.removeChild(row);

    // re-syncs data to localstorage
    saveTask();
}


/*
    Save tasks to localstorage
    @input none
    @result saves all tasks into localstorage
*/
function saveTask() {
    const taskData = [];

    // iterate through the table rows
    for(let i = 0; i < tblBody.rows.length; i++) {
        const data = tblBody.rows[i];
        
        taskData.push({
            taskName: data.cells[0].textContent,
            description: data.cells[1].textContent,
            dueDate: data.cells[2].textContent,
            status: data.getAttribute("class") == 'complete' ? 'complete' : 'incomplete'
        });
    }

    // save to local storage
    localStorage.setItem('tasks', JSON.stringify(taskData)); // note must stringify to convert object to JSON string when storing
}

/*
    Creates action buttons and appends td element 
    @input row - tr passed as parameter for the button functions 
           td  - td to which buttons will be appended
*/
function createActions(row, td) {
    // button creation for saving task
    const saveBtn = document.createElement('button');
    const saveIcon = document.createElement('i');
    saveIcon.setAttribute('class','fa-solid fa-floppy-disk');

    saveBtn.appendChild(saveIcon);
    saveBtn.addEventListener('click', function() {
        saveBtn.disabled = true;
        edtBtn.disabled = false;
        updateRow(row);
    });

     // button creation for editing task
    const edtBtn = document.createElement('button');
    const edtIcon = document.createElement('i');
    edtIcon.setAttribute('class','fa-solid fa-pen-to-square');

    // disable save button by default, enable when edit is clicked.
    saveBtn.disabled = true;
    edtBtn.appendChild(edtIcon);    
    edtBtn.addEventListener('click', function() {
        saveBtn.disabled = false;
        edtBtn.disabled = true;
        editRow(row);
    });

    // button creation for deleting task
    const delBtn = document.createElement('button');
    const delIcon = document.createElement('i');
    delIcon.setAttribute('class','fa-solid fa-trash');

    delBtn.appendChild(delIcon);
    delBtn.addEventListener('click', function() {
        deleteRow(row);
    });


    // button creation for marking task as complete and incomplete
    const markBtn = document.createElement('button');
    const markIcon = document.createElement('i');
    markIcon.setAttribute('class','fa-regular fa-square-check');

    markBtn.appendChild(markIcon);
    markBtn.addEventListener('click', function () {
        changeStatus(row, this);                            
        updateRow(row);
     });

     // appends all button elements to action td
     td.appendChild(saveBtn);
     td.appendChild(edtBtn);
     td.appendChild(delBtn);
     td.appendChild(markBtn);
}

/*
    Filters list of tasks on input by task name or task description
    @input none
    @result populates tbody with list of tasks based on matching data
*/
function inputFilter() {
    const searchInput = document.getElementById('task-search');
    let searchStr = searchInput.value.toUpperCase();

    for(let i = 0; i < tblBody.rows.length; i++){
        const row = tblBody.rows[i];
        const name = row.cells[0];
        const desc = row.cells[1];

        const nameMatch = name.textContent.toUpperCase().includes(searchStr);
        const descMatch = desc.textContent.toUpperCase().includes(searchStr);

        if(nameMatch || descMatch) {
            row.style.display = ""; // show
        } else {
            row.style.display = "none"; // hide
        }
    }
}

/*
    Filters list of tasks on options filters (All, Incomplete and Complete)
    @input none
    @result populates tbody with list of tasks based on selected option
*/
function optFilter() {
    const selected = document.querySelector('input[name="task-status"]:checked').value;
    const tblRows = tblBody.querySelectorAll('tr');

    tblRows.forEach(row => {
        const status  = row.getAttribute('class');        

        if(selected === 'all' || selected === status){
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}


/*
    Change status for the task
    @input none
    @result modify tr class attribute to 'complete' or 'incomplete' and i class respectively 
*/
function changeStatus(row, btn) {
    let change = row.getAttribute('class') == 'complete' ? row.setAttribute('class','incomplete') :  row.setAttribute('class','complete');
    const icon = btn.querySelector('i');

    if(row.getAttribute('class') == 'complete' ) {     
        icon.setAttribute('class','fa-regular fa-square-check');
    } else {
        icon.setAttribute('class','fa-solid fa-square-check');
    }
}

/*
    Format string date to YYYY-MM-DD for the input type date field
    @input date obj
    @result converts string date to ISO format and extracts the needed format
*/
function formatDate(date) {
    const formattedDate = date.toISOString().slice(0, 10); // ISOString formats to YYYY-MM-DDTHH:mm:ss.sssZ use slice to extract needed format
    return formattedDate;
}
