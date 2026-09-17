let employees = [];

let displayedEmployees = [];

let currentDepartment = "All";

function displayDateTime() {

    const today = new Date();

    const day = today.getDate();

    const month = today.getMonth();

    const year = today.getFullYear();

    let hours = today.getHours();

    let minutes = today.getMinutes();

    let seconds = today.getSeconds();


    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    hours = hours === 0 ? 12 : hours;

    minutes = minutes < 10
        ? "0" + minutes
        : minutes;

    seconds = seconds < 10
        ? "0" + seconds
        : seconds;


    document.getElementById("date").innerHTML =
        `Today: ${day} ${months[month]} ${year}`;


    document.getElementById("time").innerHTML =
        `Time: ${hours}:${minutes}:${seconds} ${ampm}`;
}


displayDateTime();

setInterval(displayDateTime, 1000);

function fetchEmployees() {

    document.getElementById("message").innerHTML =
        "Loading employees...";


    fetch("https://dummyjson.com/users")

        .then(response => {

            return response.json();

        })


        .then(data => {

            employees = data.users.map(user => {

                return {

                    id: user.id,

                    name:
                        `${user.firstName} ${user.lastName}`,

                    age: user.age,

                    email: user.email,

                    phone: user.phone,

                    department:
                        user.company.department,

                    image: user.image,

                    salary:
                        Math.floor(
                            Math.random() * 70000
                        ) + 30000

                };

            });


            displayedEmployees =
                [...employees];


            displayEmployees(displayedEmployees);


            document.getElementById("message").innerHTML =
                "Employee data loaded successfully.";


            document.getElementById("message").className =
                "success";

        })


        .catch(error => {

            console.log(error);


            document.getElementById("message").innerHTML =
                "Unable to load employee data. Please try again.";


            document.getElementById("message").className =
                "error";

        })


        .finally(() => {

            console.log(
                "Employee API request completed."
            );

        });

}

function displayEmployees(employeeArray) {

    const container =
        document.getElementById("employeeContainer");


    container.innerHTML = "";


    displayedEmployees =
        employeeArray;


    employeeArray.forEach(employee => {

        const card =
            document.createElement("div");


        card.className =
            "employee-card";


        card.innerHTML = `

            <img
                src="${employee.image || "https://via.placeholder.com/100"}"
                alt="Employee Image"
            >

            <h3>
                ${employee.name}
            </h3>

            <p>
                <strong>Age:</strong>
                ${employee.age}
            </p>

            <p>
                <strong>Email:</strong>
                ${employee.email}
            </p>

            <p>
                <strong>Department:</strong>
                ${employee.department}
            </p>

            <p>
                <strong>Phone:</strong>
                ${employee.phone || "XXXXXXXX"}
            </p>

            <p>
                <strong>Salary:</strong>
                ₹${employee.salary.toLocaleString("en-IN")}
            </p>

            <button
                class="delete-btn"
                onclick="deleteEmployee(${employee.id})"
            >
                Delete
            </button>

        `;


        container.appendChild(card);

    });


    updateEmployeeCount(employeeArray);

    calculateSalary(employeeArray);

}

function searchEmployees() {

    const searchValue =
        document.getElementById("searchInput")
        .value
        .toLowerCase();


    let result =
        employees.filter(employee => {

            return employee.name
                .toLowerCase()
                .includes(searchValue);

        });


    // Department filter

    if (currentDepartment !== "All") {

        result =
            result.filter(employee => {

                return employee.department
                    .toLowerCase()
                    .includes(
                        currentDepartment.toLowerCase()
                    );

            });

    }


    displayEmployees(result);

}

function filterDepartment(department) {

    currentDepartment =
        department;


    let result;


    if (department === "All") {

        result =
            [...employees];

    } else {

        result =
            employees.filter(employee => {

                return employee.department
                    .toLowerCase()
                    .includes(
                        department.toLowerCase()
                    );

            });

    }


    // Search filter

    const searchValue =
        document.getElementById("searchInput")
        .value
        .toLowerCase();


    if (searchValue !== "") {

        result =
            result.filter(employee => {

                return employee.name
                    .toLowerCase()
                    .includes(searchValue);

            });

    }


    displayEmployees(result);

}

function updateEmployeeCount(employeeArray) {

    document.getElementById("employeeCount")
        .innerHTML =
        employeeArray.length;


    document.getElementById("salaryEmployeeCount")
        .innerHTML =
        employeeArray.length;

}

function calculateSalary(employeeArray) {

    if (employeeArray.length === 0) {

        document.getElementById("totalSalary")
            .innerHTML = "₹0";


        document.getElementById("averageSalary")
            .innerHTML = "₹0";


        document.getElementById("highestEmployee")
            .innerHTML =
            "No employee available";


        return;

    }


    // Total Salary

    const totalSalary =
        employeeArray.reduce(
            (total, employee) => {

                return total + employee.salary;

            },
            0
        );


    // Average Salary

    const averageSalary =
        totalSalary /
        employeeArray.length;


    // Highest Salary

    const highestEmployee =
        employeeArray.reduce(
            (highest, employee) => {

                return employee.salary >
                    highest.salary
                    ? employee
                    : highest;

            }
        );


    document.getElementById("totalSalary")
        .innerHTML =
        `₹${totalSalary.toLocaleString("en-IN")}`;


    document.getElementById("averageSalary")
        .innerHTML =
        `₹${Math.round(
            averageSalary
        ).toLocaleString("en-IN")}`;


    document.getElementById("highestEmployee")
        .innerHTML = `

            Name:
            <strong>
                ${highestEmployee.name}
            </strong>

            <br>

            Salary:
            <strong>
                ₹${highestEmployee.salary
                    .toLocaleString("en-IN")}
            </strong>

        `;

}

function validateEmployee() {

    const name =
        document.getElementById("name")
        .value
        .trim();


    const age =
        Number(
            document.getElementById("age")
            .value
        );


    const email =
        document.getElementById("email")
        .value
        .trim();


    const department =
        document.getElementById("department")
        .value;


    const salary =
        Number(
            document.getElementById("salary")
            .value
        );


    let errors = [];


    // Name validation

    if (name === "") {

        errors.push(
            " Please enter employee name"
        );

    }


    // Age validation

    if (age <= 18 || isNaN(age)) {

        errors.push(
            " Age must be greater than 18"
        );

    }


    // Email validation

    if (email === "") {

        errors.push(
            " Please enter employee email"
        );

    }


    // Department validation

    if (department === "") {

        errors.push(
            " Please select department"
        );

    }


    // Salary validation

    if (salary <= 0 || isNaN(salary)) {

        errors.push(
            " Please enter valid salary"
        );

    }


    // Display errors

    if (errors.length > 0) {

        document.getElementById("errorMessage")
            .innerHTML =
            errors.join("<br>");

        document.getElementById("errorMessage")
            .className = "error";


        return false;

    }


    document.getElementById("errorMessage")
        .innerHTML = "";


    return true;

}

function addEmployee(event) {

    event.preventDefault();


    if (!validateEmployee()) {

        return;

    }


    const name =
        document.getElementById("name")
        .value;


    const age =
        Number(
            document.getElementById("age")
            .value
        );


    const email =
        document.getElementById("email")
        .value;


    const department =
        document.getElementById("department")
        .value;


    const salary =
        Number(
            document.getElementById("salary")
            .value
        );


    // Employee object

    const newEmployee = {

        id: Date.now(),

        name: name,

        age: age,

        email: email,

        department: department,

        salary: salary,

        phone: "XXXXXXXX",

        image:
            "https://via.placeholder.com/100"

    };


    // Spread operator

    employees = [
        ...employees,
        newEmployee
    ];


    clearForm();


    currentDepartment =
        "All";


    displayEmployees(employees);


    document.getElementById("errorMessage")
        .innerHTML =
        "Employee added successfully.";


    document.getElementById("errorMessage")
        .className =
        "success";

}
function deleteEmployee(id) {

    employees =
        employees.filter(employee => {

            return employee.id !== id;

        });


    searchEmployees();

}
function clearForm() {

    document.getElementById("employeeForm")
        .reset();

}

function sortEmployees(type) {

    let sortedEmployees =
        [...displayedEmployees];
    if (type === "name") {

        sortedEmployees.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }
    if (type === "age") {

        sortedEmployees.sort(
            (a, b) =>
                a.age - b.age
        );

    }
    if (type === "salary") {

        sortedEmployees.sort(
            (a, b) =>
                b.salary - a.salary
        );

    }
    displayEmployees(
        sortedEmployees
    );

}
// Search button
document.getElementById("searchBtn")
    .addEventListener(
        "click",
        searchEmployees
    );
// Search while typing
document.getElementById("searchInput")
    .addEventListener(
        "keyup",
        searchEmployees
    );
// Department buttons
document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const department =
                    this.getAttribute(
                        "data-department"
                    );


                filterDepartment(
                    department
                );

            }
        );

    });
// Add Employee form
document.getElementById("employeeForm")
    .addEventListener(
        "submit",
        addEmployee
    );
// Sort by Name
document.getElementById("sortName")
    .addEventListener(
        "click",
        () => sortEmployees("name")
    );
// Sort by Age
document.getElementById("sortAge")
    .addEventListener(
        "click",
        () => sortEmployees("age")
    );
// Sort by Salary
document.getElementById("sortSalary")
    .addEventListener(
        "click",
        () => sortEmployees("salary")
    );
fetchEmployees();

