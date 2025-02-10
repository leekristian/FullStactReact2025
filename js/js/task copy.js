const currentDate = new Date();
const inputDate = document.getElementById('task-date');
const formattedDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD

inputDate.value = formattedDate;

const tblBody = document.getElementById('task-table');
loadTasks();

const searchInput = document.getElementById('task-search');
searchInput.addEventListener('input', inputFilter);


function inputFilter() {
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

function optFilter() {
    const selected = document.querySelector('input[name="task-status"]:checked').value;
    const tblRows = tblBody.querySelectorAll('tr');
    let searchStr = searchInput.value.toUpperCase();

    tblRows.forEach(row => {
        const nameMatch = row.cells[0].textContent.toUpperCase().includes(searchStr);
        const descMatch = row.cells[1].textContent.toUpperCase().includes(searchStr);
        const status  = row.getAttribute('class');        

        console.log(searchStr);

        if(nameMatch) {
            console.log("here true");
            if(selected === 'all' || selected === status){
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        } else {
            console.log("here false");
            if(selected === 'all' || selected === status){
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }

        if(selected === 'all' || selected === status){
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}


function loadTasks() {
    const storageTasks = localStorage.getItem('tasks');
    console.log("retrieving storage tasks ", storageTasks);

    if(storageTasks != null) {
        tblBody.innerHTML = "";
        const tasks = JSON.parse(storageTasks);

        // Iterate through the stored tasks
        tasks.forEach(task => {
            const row = tblBody.insertRow();

            row.setAttribute("class", task.status);

            row.insertCell().textContent = task.taskName;
            row.insertCell().textContent = task.description;
            row.insertCell().textContent = task.dueDate;

            const actions = row.insertCell();
            createActions(row, actions);            
        });
    }
}

function changeStatus(row, btn) {
    let change = row.getAttribute('class') == 'complete' ? row.setAttribute('class','incomplete') :  row.setAttribute('class','complete');
    btn.textContent == "Mark Complete" ? btn.textContent = "Mark Incomplete" : btn.textContent = "Mark Complete";
}


function editRow(row) {
    const name = row.cells[0];
    const desc = row.cells[1];
    const date = row.cells[2];

    console.log(row);
    // alert(name.textContent + " and inner text: " + name.textContent);
    const inputTask = document.createElement("input");
    inputTask.setAttribute("type","text");
    inputTask.setAttribute("value",name.textContent);
    console.log(inputTask);
    name.textContent = "";
    name.appendChild(inputTask);

    const inputDesc = document.createElement("input");
    inputDesc.setAttribute("type","text");
    inputDesc.setAttribute("value",desc.textContent);
    desc.textContent = "";
    desc.appendChild(inputDesc);

    
    const inputDate = document.createElement("input");
    const dateObj = new Date(date.textContent);
    const formattedDate = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
    // alert(formattedDate);

    inputDate.setAttribute("type","date");
    inputDate.setAttribute("value",formattedDate);
    date.textContent = "";
    date.appendChild(inputDate);
}

function updateRow(row) {
    const name = row.cells[0];
    const desc = row.cells[1];
    const date = row.cells[2];
    const taskData = [];

    name.textContent = name.getElementsByTagName("input")[0] ? name.getElementsByTagName("input")[0].value : name.textContent;
    desc.textContent = desc.getElementsByTagName("input")[0] ? desc.getElementsByTagName("input")[0].value : desc.textContent;
    date.textContent = date.getElementsByTagName("input")[0] ? date.getElementsByTagName("input")[0].value : date.textContent;

    for(let i = 0; i < tblBody.rows.length; i++) {
        const data = tblBody.rows[i];
        
        taskData.push({
            taskName: data.cells[0].textContent,
            description: data.cells[1].textContent,
            dueDate: data.cells[2].textContent,
            status: data.getAttribute("class") == 'complete' ? 'complete' : 'incomplete'
        });
    }

    localStorage.setItem('tasks', JSON.stringify(taskData)); // note must stringify to convert object to JSON string when storing
}

function addTask() {
    const row = tblBody.insertRow();

    row.insertCell().textContent = document.getElementById('task-name').value;
    row.insertCell().textContent = document.getElementById('task-desc').value;
    row.insertCell().textContent = document.getElementById('task-date').value;
    row.setAttribute("class", 'incomplete');
    
    const actions = row.insertCell();
    createActions(row, actions);    

    saveTask();
}

function createActions(row, action) {
    const saveBtn = document.createElement('button');
    saveBtn.textContent = "Save";
    saveBtn.addEventListener('click', function() {
        saveBtn.disabled = true;
        edtBtn.disabled = false;
        updateRow(row);
    });

    const edtBtn = document.createElement('button');
    saveBtn.disabled = true;
    edtBtn.textContent = "Edit";
    edtBtn.addEventListener('click', function() {
        saveBtn.disabled = false;
        edtBtn.disabled = true;
        editRow(row);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', function() {
        deleteRow(row);
    });

    const markBtn = document.createElement('button');
    markBtn.textContent = "Mark Complete";
    markBtn.addEventListener('click', function () {
        changeStatus(row, this);                            
        updateRow(row);
     });

     action.appendChild(saveBtn);
     action.appendChild(edtBtn);
     action.appendChild(delBtn);
     action.appendChild(markBtn);
}

function deleteRow(row) {
    console.log("row to delete ", row);
    tblBody.removeChild(row);
    saveTask();
}

function saveTask() {
    const task = [];

    // iterate through the table rows
    for(let i = 0; i < tblBody.rows.length; i++) {
        const rows = tblBody.rows[i];
        // Extract data from cells
        const name = rows.cells[0].textContent;
        const desc = rows.cells[1].textContent;
        const dueDate = rows.cells[2].textContent;
        // Add data to the array
        task.push({ taskName: name, description: desc, dueDate: dueDate, status: 'incomplete' });
        console.log(task);
    }

    localStorage.setItem('tasks', JSON.stringify(task)); // note must stringify to convert object to JSON string when storing
}


