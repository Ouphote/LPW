'use strict'

const openRegistration = () => document.getElementById('registration')
    .classList.add('active')

const closeRegistration = () => {
    document.getElementById('registration').classList.remove('active');
    document.getElementById("name").dataset.index = "new";
    resetFields();
}

//CRUD

const setLocalStorage = (databaseClient) => localStorage.setItem("databaseClient", JSON.stringify(databaseClient));

//CRUD - CREATE
const createClient = (client) => {
    const databaseClient = readClient();
    databaseClient.push(client);
    setLocalStorage(databaseClient);
    updateTable();
}

//CRUD - READ
const readClient = () => JSON.parse(localStorage.getItem('databaseClient')) ?? [];

const readClientByIndex = (index) => {
    const databaseClient =  readClient();
    return databaseClient[index];
}

//CRUD - UPDATE
const updateClient = (index, client) => {
    const databaseClient = readClient();
    databaseClient[index] = client;
    setLocalStorage(databaseClient);
    updateTable();
}

//CRUD - DELETE
const deleteClient = (index) => {
    const databaseClient = readClient();
    databaseClient.splice(index, 1);
    setLocalStorage(databaseClient);
    updateTable();
}

//Interações com front-end
const fieldsNotNull = () => {
    return document.getElementById('form').reportValidity();
}

const resetFields = () => {
    const fields = document.querySelectorAll('.registration-field');
    fields.forEach(field => field.value = null);
}

const saveClient = () => {
    if (fieldsNotNull()) {
        const client = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value
        }
        const index = document.getElementById("name").dataset.index;
        if (index == "new") {
            createClient(client);
        } else {
            updateClient(index, client);
        }
        closeRegistration();
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.city}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `;
    document.querySelector('#tbClient>tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tbClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

const updateTable = () => {
    const databaseClient = readClient();
    clearTable();
    databaseClient.forEach(createRow);
}

const fillFields = (client) => {
    document.getElementById("name").value = client.name;
    document.getElementById("email").value = client.email;
    document.getElementById("phone").value = client.phone;
    document.getElementById("city").value = client.city;
    document.getElementById("name").dataset.index = client.index;
}

const editClient = (index) => {
    const client = readClientByIndex(index);
    client.index = index;
    fillFields(client);
    openRegistration();
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split("-");
        if (action == "edit") {
            editClient(index);
        } else if (action == "delete") {
            const response = confirm(`Realmente deseja deletar o cliente ${readClientByIndex(index).name}?`);
            if (response) {
                deleteClient(index);
            }
        }
    }
}

updateTable();

//Eventos
document.getElementById('registerClient')
    .addEventListener('click', openRegistration)

document.getElementById('close')
    .addEventListener('click', closeRegistration)

document.getElementById('calcel')
    .addEventListener('click', closeRegistration)

document.getElementById('save')
    .addEventListener('click', saveClient);

document.querySelector('#tbClient>tbody')
    .addEventListener('click', editDelete)