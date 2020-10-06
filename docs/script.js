let container = document.createElement("div");
container.className = "container";

let firstDiv = document.createElement("div");
firstDiv.className = "row";

let firstForm = document.createElement("form");
firstForm.method = "POST";
let firstTable = document.createElement("table");
firstTable.id = "form-table";
firstForm.appendChild(firstTable);
firstDiv.appendChild(firstForm);

let secondDiv = document.createElement("div");
secondDiv.className = "row";
let secondTable = document.createElement("table");
let thead = createThead();
let tbody = document.createElement("tbody");
tbody.id = "dataTable";
secondTable.append(thead, tbody);
secondDiv.appendChild(secondTable);

container.append(firstDiv, secondDiv);
document.body.append(container);

let formTable = document.querySelector("#form-table");
let form = document.querySelector("form");
var allusers = [];
let isEdit = false;
let selectUserId = null;

let mapIndexCounter = 0;
let countries = ["India", "Germany", "SriLanka"];
let states = {
    "India": ["Maharastra", "Goa", "Gujrat"],
    "Germany": ["Bavaria", "Hessen", "Saxony"],
    "SriLanka": ["Ampara", "Colombo", "Galle"]
}
let cities = {
    "Maharastra": ["Pune", "Mumbai", "Solapur"],
    "Goa": ["Calingute", "Bagha", "Panaji"],
    "Gujrat": ["Jamnagar", "Ahemdabad", "Rajkot"],
    "Bavaria": ["Munich", "Bamberg", "Fussen"],
    "Hessen": ["Frankfurt", "Kassel", "Fulda"],
    "Saxony": ["Dresden", "Meissen", "Bautzen"],
    "Ampara": ["Arugam", "Lahugala", "Pottuvil"],
    "Colombo": ["Dehiwala", "Moratuwa", "Negombo"],
    "Galle": ["Hiniduma", "Pitigala", "Neluwa"],
}

let formFields = {
    0: "Name",
    1: "Email",
    2: "Password",
    3: "Re-Enter Password",
    4: "Country",
    5: "State",
    6: "City",
    7: "Address Line 1",
    8: "Address Line 2",
    9: "Gender",
    10: "Marital Status",
    11: "Favourite Food",
    12: "Favourite Color"
}

for (let key in formFields) {
    let tr = document.createElement("tr");
    let firstTd = createTd1(formFields[key]);
    var secondTd;
    if (formFields[key] === "Gender") {
        secondTd = createGender();
    } else if (formFields[key] === "Country") {
        secondTd = createCountry();
    } else if (formFields[key] === "State") {
        secondTd = createState();
    } else if (formFields[key] === "City") {
        secondTd = createCity();
    } else if (formFields[key] === "Marital Status") {
        secondTd = createMarital();
    } else {
        secondTd = createTd2(formFields[key]);
    }
    tr.append(firstTd, secondTd);
    formTable.append(tr);
}


let submitButton = createSubmitButton();
formTable.appendChild(submitButton);



function createMarital() {
    let td = document.createElement("td");
    let firstLabel = document.createElement("label");
    firstLabel.innerHTML = "Single";
    firstLabel.setAttribute("for", "single");
    let firstRadio = document.createElement("input");
    firstRadio.type = "radio";
    firstRadio.value = "single";
    firstRadio.name = "marital";
    firstRadio.id = "single"
    let secondLabel = document.createElement("label");
    secondLabel.innerHTML = "Married";
    secondLabel.setAttribute("for", "married");
    let secondRadio = document.createElement("input");
    secondRadio.type = "radio";
    secondRadio.value = "married";
    secondRadio.name = "marital";
    secondRadio.id = "married"
    td.append(firstLabel, firstRadio, secondLabel, secondRadio);
    return td;
}


let password = document.querySelector("#password");
let rePassword = document.querySelector("#re-enterpassword");

let enteredPassword, reEnteredPassword;

password.addEventListener("change", event => {
    enteredPassword = event.target.value;
    comparePassword();
});

rePassword.addEventListener("change", event => {
    reEnteredPassword = event.target.value;
    comparePassword();
})

function comparePassword() {
    let button = document.querySelector("button");
    if (enteredPassword === reEnteredPassword && enteredPassword && reEnteredPassword) {
        button.removeAttribute("disabled");
    } else {
        button.setAttribute("disabled", true);
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    let button = document.querySelector("button");
    let formDataArray = event.target;
    // console.log(event);
    let user = {
        "name": formDataArray[0].value,
        "password": formDataArray[2].value,
        "email": formDataArray[1].value,
        "country": formDataArray[4].value,
        "state": formDataArray[5].value,
        "city": formDataArray[6].value,
        "address1": formDataArray[7].value,
        "gender": formDataArray[9].checked ? "Male" : "Female",
        "marital": formDataArray[11].checked ? "Single" : "Married",
        "favFood": formDataArray[13].value,
        "favColor": formDataArray[14].value
    }
    if (!isEdit) {
        let submitedData = await fetch("https://5f7b62d400bd7400169097f0.mockapi.io/api/users/", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
    } else {
        let putdata = await fetch("https://5f7b62d400bd7400169097f0.mockapi.io/api/users/" + selectUserId, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        isEdit = false;
        selectUserId = null;
    }
    resetAll();
    getUsers();
    button.setAttribute("disabled", true);
});

async function getUsers() {
    let response = await fetch("https://5f7b62d400bd7400169097f0.mockapi.io/api/users/");
    let data = await response.json();
    allusers = data;
    // console.log(data);
    displayData(data);
}

getUsers();

function displayData(data) {
    let dataTable = document.querySelector("#dataTable");
    dataTable.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement("tr");
        let name = createTd(data[i].name);
        let email = createTd(data[i].email);
        // let password = createTd(data[i].password);
        let country = createTd(data[i].country);
        let state = createTd(data[i].state);
        let city = createTd(data[i].city);
        let address = createTd(data[i].address1);
        let gender = createTd(data[i].gender);
        let marital = createTd(data[i].marital);
        let food = createTd(data[i].favFood);
        let color = createTd(data[i].favColor);
        let editButton = createButton(data[i].id);
        let delButton = createDelButton(data[i].id);
        tr.append(name, email, country, state, city, address, gender, marital, food, color, editButton, delButton);
        dataTable.appendChild(tr);
    }
}

function createDelButton(id) {
    let element = document.createElement("button");
    element.innerHTML = "Delete";
    element.setAttribute("onclick", "deleteItem(" + id + ")");
    return element;
}

async function deleteItem(id) {
    let deletedRow = await fetch("https://5f7b62d400bd7400169097f0.mockapi.io/api/users/" + id, {
        method: "DELETE"
    });
    await deletedRow.json();
    getUsers();
}

function createButton(id) {
    let element = document.createElement("button");
    element.innerHTML = "Edit";
    element.setAttribute("onclick", "getId(" + id + ")");
    return element;
}

function getId(id) {
    isEdit = true;
    selectUserId = id;
    let currentUser = allusers[id - 1];
    // console.log(allusers);
    // console.log(currentUser);
    document.querySelector("#name").value = currentUser.name;
    document.querySelector("#email").value = currentUser.email;
    document.querySelector("#password").value = "";
    document.querySelector("#re-enterpassword").value = "";
    document.querySelector("#addressline1").value = currentUser.address1;
    document.querySelector("#addressline2").value = currentUser.address1;
    document.querySelector("#favouritefood").value = currentUser.favFood;
    document.querySelector("#favouritecolor").value = currentUser.favColor;
}

function resetAll() {
    document.querySelector("#name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#password").value = "";
    document.querySelector("#re-enterpassword").value = "";
    document.querySelector("#addressline1").value = "";
    document.querySelector("#addressline2").value = "";
    document.querySelector("#favouritefood").value = "";
    document.querySelector("#favouritecolor").value = "";
}

function createTd(text) {
    let td = document.createElement("td");
    td.innerHTML = text;
    return td;
}

let countrySelect = document.querySelector("#country");

countrySelect.addEventListener("change", event => {
    let selectedCountry = event.target.value;
    changeStates(states[selectedCountry]);
});

let statesTag = document.querySelector("#state");

statesTag.addEventListener("change", event => {
    let selectedState = event.target.value;
    changeCities(cities[selectedState]);
})

function changeStates(statesArray) {
    let statesSelect = document.querySelector("#state");
    statesSelect.innerHTML = "";
    for (let i = 0; i < statesArray.length; i++) {
        let option = createOption(statesArray[i]);
        statesSelect.appendChild(option);
    }
    changeCities(cities[statesArray[0]]);
}

function changeCities(cityArray) {
    let citiesSelect = document.querySelector("#city");
    citiesSelect.innerHTML = "";
    for (let i = 0; i < cityArray.length; i++) {
        let option = createOption(cityArray[i]);
        citiesSelect.appendChild(option);
    }
}

function createThead() {
    let thead = document.createElement("thead");
    let th1 = createTh1("Name");
    let th2 = createTh1("Email");
    let th3 = createTh1("Country");
    let th4 = createTh1("State");
    let th5 = createTh1("City");
    let th6 = createTh1("Address");
    let th7 = createTh1("Gender");
    let th8 = createTh1("Marital Status");
    let th9 = createTh1("Food");
    let th10 = createTh1("Color");
    let th11 = createTh1("Operations");
    thead.append(th1, th2, th3, th4, th5, th6, th7, th8, th9, th10, th11);
    return thead;
}

function createTh1(text) {
    let th = document.createElement("th");
    th.innerHTML = text;
    return th;
}

function createSubmitButton() {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let buttonDiv = document.createElement("div");
    buttonDiv.className = "buttonDiv";
    td.colSpan = "2";
    let button = document.createElement("button");
    button.type = "submit";
    button.className = "btn"
    button.setAttribute("disabled", true);
    button.innerHTML = "Submit";
    buttonDiv.append(button);
    td.append(buttonDiv);
    tr.appendChild(td);
    return tr;
}

function createCity() {
    let td = document.createElement("td");
    let select = document.createElement("select");
    select.name = "city";
    select.id = "city";
    for (let i = 0; i < cities["Maharastra"].length; i++) {
        let option = createOption(cities["Maharastra"][i]);
        select.appendChild(option);
    }
    td.appendChild(select);
    return td;
}

function createState() {
    let td = document.createElement("td");
    let select = document.createElement("select");
    select.name = "state";
    select.id = "state";
    for (let i = 0; i < states["India"].length; i++) {
        let option = createOption(states["India"][i]);
        select.appendChild(option);
    }
    td.appendChild(select);
    return td;
}

function createCountry() {
    let td = document.createElement("td");
    let select = document.createElement("select");
    select.name = "country";
    select.id = "country";
    for (let i = 0; i < countries.length; i++) {
        let option = createOption(countries[i]);
        select.appendChild(option);
    }
    td.appendChild(select);
    return td;
}

function createOption(optionName) {
    let element = document.createElement("option");
    element.value = optionName;
    element.innerHTML = optionName;
    return element;
}

function createGender() {
    let td = document.createElement("td");
    let firstLabel = document.createElement("label");
    firstLabel.innerHTML = "Male";
    firstLabel.setAttribute("for", "male");
    let firstRadio = document.createElement("input");
    firstRadio.type = "radio";
    firstRadio.value = "male";
    firstRadio.name = "gender";
    firstRadio.id = "male"
    let secondLabel = document.createElement("label");
    secondLabel.innerHTML = "Female";
    secondLabel.setAttribute("for", "female");
    let secondRadio = document.createElement("input");
    secondRadio.type = "radio";
    secondRadio.value = "female";
    secondRadio.name = "gender";
    secondRadio.id = "female"
    td.append(firstLabel, firstRadio, secondLabel, secondRadio);
    return td;
}

function createTd2(text) {
    let td = document.createElement("td");
    let inputBox = document.createElement("input");
    inputBox.value = "";
    if (text === "Email") {
        inputBox.type = "email";
    } else if (text === "Password" || text === "Re-Enter Password") {
        inputBox.type = "password";
    } else {
        inputBox.type = "text";
    }
    inputBox.id = text.split(" ").join("").toLowerCase();
    inputBox.placeholder = text;
    td.appendChild(inputBox);
    return td;
}

function createTd1(text) {
    let td = document.createElement("td");
    let label = document.createElement("label");
    label.innerHTML = text + " : ";
    label.for = text;
    td.appendChild(label);
    return td;
}