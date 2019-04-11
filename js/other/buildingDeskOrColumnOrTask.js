// Require for Create Desk/Column/Task

let objCreate = {};
let formName;
let url;
let closeModule;





function funcCreate(event) {

    if(event.target.getAttribute('id') === 'btn-create-desk') { // All variables for Desk.
        formName = 'formCreateDesk';
        url = `/api-desks/`;
        closeModule = document.getElementById('modal-create-desk');
        objCreate = {
            name: document.getElementById('input-name').value,
            description: document.getElementById('input-description').value
        };
    } else if (event.target.getAttribute('id') === 'btn-create-column') { // All variables for Column.
        formName = 'formCreateColumn';
        url = `/api-desks/${getCookie('desk_id')}/columns/`;
        closeModule = document.getElementById('modal-create-column');
        objCreate = {
            name: document.getElementById('input-name-column').value,
        };
    } else if (event.target.getAttribute('id') === 'btn-create-task') { // All variables for Task.
        formName = 'formCreateTask';
        url = `/api-desks/${desk_id}/columns/${column_id}/tasks/`;
        closeModule = document.getElementById('modal-create-task');
        objCreate = {
            name: document.getElementById('input-name-task').value,
            description: document.getElementById('input-description-task').value,
            task_deadline: document.getElementById('input-deadline-task').value,
            priority: document.getElementById('input-priority-task').value,
            image: document.getElementById('input-image-task').value
        };
    }

    console.log(objCreate);
    console.log(formName);
    console.log(validator(formName));

    if (!validator(formName)) {
        return false;
    } else {
        let csrftoken = getCookie('csrftoken');
        let option = {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(objCreate)
        };


        request(`http://127.0.0.1:8000${url}`, option, requestCallbackCreate);

        function requestCallbackCreate(data) {
            console.log(data);
            if (data.status !== 201) {
                console.log(data.status);
                console.log(data.json());
            } else {
                closeModule.classList.remove('active');

                data.json()
                    .then((resolve) => {
                        return resolve
                    })
                    .then((result) => {
                        if (document.getElementById('section').parentElement.classList.contains('home-page')) {
                            buildingDesks(result);
                        } else if (document.getElementById('section').parentElement.classList.contains('desk-page')) {
                            notification(data.status, result);
                            buildingColumns(result);
                        } else {
                            console.log('Inner page')
                        }

                    })
            }
        }
    }
}

// Close for Create Desk