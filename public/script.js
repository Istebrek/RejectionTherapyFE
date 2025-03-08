//show/update dares
const randomDareDiv = document.getElementById("random-dare-div");
async function randomDare() {
    try {
        const response = await fetch("http://localhost:3000/express/dares");
        const dares = await response.json();
        let dare = dares[Math.floor(Math.random()*dares.length)];
        const dareP = document.getElementById("dare-p");
        randomDareDiv.innerHTML = "";
        const difficultySpan = document.createElement('span');
        difficultySpan.classList.add("dif-span");
        difficultySpan.textContent = `Difficuly: ${dare.difficulty.charAt(0).toUpperCase()}${dare.difficulty.slice(1)} | Category: ${dare.category.charAt(0).toUpperCase()}${dare.category.slice(1)}`;
        const dareId = document.createElement('span');
        dareId.classList.add("dare-id");
        randomDareDiv.appendChild(dareId);
        dareId.style.display = 'none';
        
        const dareSpan = document.createElement('span');
        dareSpan.classList.add("dare-span");
        const fullDareSpan = document.createElement('span');
        fullDareSpan.classList.add("full-dare-span");
        fullDareSpan.id = "dare-id";

        dareSpan.textContent = `${dare.name.charAt(0).toUpperCase()}${dare.name.slice(1)}`;
        randomDareDiv.appendChild(dareSpan);
        fullDareSpan.textContent = `${dare.dare.charAt(0).toUpperCase()}${dare.dare.slice(1)}`
        randomDareDiv.appendChild(fullDareSpan);
        randomDareDiv.appendChild(difficultySpan);
    

    } catch (error) {
        console.error("Error randomizing dare: ", error)
    }
}
randomDare();
const shuffleButton = document.getElementById("shuffle-button");

shuffleButton.addEventListener("click", () => {
    randomDare();   
});

const completedButton = document.getElementById("completed-button");
completedButton.addEventListener("click", async () => {
    try {
        const Username = document.getElementById('username').value;
        if (!Username) {
            alert("Please enter a username before completing a dare.");
            return;
        }

        const dareName = document.querySelector(".dare-span").textContent;
        const dareDescription = document.querySelector(".full-dare-span").textContent;
        const difficultyText = document.querySelector(".dif-span").textContent;
        const [difficulty, category] = difficultyText.replace("Difficuly: ", "").split(" | Category: ");

        const completedDare = {
            name: dareName,
            dare: dareDescription,
            difficulty: difficulty,
            category: category
        };

        // Fetch user data to check if the user already exists
        const usersResponse = await fetch("http://localhost:3000/express/users");
        const users = await usersResponse.json();
        let userExists = users.find(user => user.username === Username);
        const updatedDares = [completedDare];

        // Send update request to add dare to user's completed list
        const updateResponse = await fetch("http://localhost:3000/express/user/" + userExists.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: Username, completedDares: updatedDares })
        });

        if (updateResponse.ok) {
            randomDare();
            fetchUserInfo();
        } else {
            console.error("Failed to update user.");
        }
    } catch (error) {
        console.error("Error updating completed dare: ", error);
    }
});

async function login() {
    try {        
        const response = await fetch("http://localhost:3000/express/users");
        const users = await response.json();

        let welcome = document.getElementById("welcome");
        let Username = document.getElementById('username').value;
        if (Username.trim() !== "") {
            let userExists = users.find(user => user.username === Username.trim());

            if (userExists) {
                if (userExists.completedDares && userExists.completedDares.length > 0) {
                    fetchUserInfo();
                } else {
                    alert("No completed dares yet.");
                }
            } else {
                newUser();
            }
            welcome.textContent = `${Username.trim()}'s Completed Dares:`;
            document.getElementById('loginBox').style.display = 'none';
            document.getElementById('mainUI').style.display = 'block';
        } else {
            alert('Please enter a username');
        }
    } catch (error) {
        console.log(error);
    }
}

//add user
async function newUser() {
    let Username = document.getElementById('username').value;
    const dareData = {
        username: Username
    };


    try {
        const response = await fetch("http://localhost:3000/express/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dareData)
        });

        if (response.ok) {
            console.log("User added successfully");
        } else {
            console.error(error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", ()=> {
    login();
});

async function fetchUserInfo () {
    try {
        const response = await fetch("http://localhost:3000/express/users");
        const users = await response.json();

        const completedUl = document.getElementById("completed-ul");
        completedUl.innerHTML = ""; 

        let usernameInput = document.getElementById("username").value.trim();


        let loggedInUser = users.find(user => user.username === usernameInput);

        // Display the logged-in user's completed dares
        const userItem = document.createElement("li");

        const userDareList = document.createElement("ul");

        if (loggedInUser.completedDares && loggedInUser.completedDares.length > 0) {
            loggedInUser.completedDares.forEach(dare => {
                const dareItem = document.createElement("li");
                dareItem.textContent = `${dare.name}: ${dare.dare}`;
                userDareList.appendChild(dareItem);
            });
        } else {
            const noDaresItem = document.createElement("li");
            noDaresItem.textContent = "No completed dares yet.";
            userDareList.appendChild(noDaresItem);
        }

        completedUl.appendChild(userDareList);

    } catch (error) {
        console.log("Error fetching user info:", error);
    }
}    

async function fetchDares() {
    try {
        const daresList = document.getElementById("dares-list");

        const response = await fetch("http://localhost:3000/express/dares");
        const dares = await response.json();

        daresList.innerHTML = ""; 
        dares.forEach(dare => {
            const dareItem = document.createElement("li");

            
            dareItem.innerHTML = `
                <span class="dare-name">${dare.name}</span>
                <span class="dare-description">${dare.dare}</span>
                <div class="structure-div">
                <span class="dare-difficulty">Difficulty: ${dare.difficulty} </span> 
                <span class="dare-category">Category: ${dare.category}</span>
                </div>
            `;

            
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("buttons");

            
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button-class");
            deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteButton.addEventListener("click", async () => {
                await deleteDare(dare.id);
                fetchDares();
            });

            
            const editButton = document.createElement("button");
            editButton.classList.add("edit-button-class");
            editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
            editButton.addEventListener("click", () => {
                enableEditing(dareItem, dare);
            });

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            dareItem.appendChild(buttonContainer);
            daresList.appendChild(dareItem);
        });

    } catch (error) {
        console.error("Error loading dares:", error);
    }
}

fetchDares();
function enableEditing(dareItem, dare) {
    dareItem.innerHTML = `
        <input type="text" class="edit-name" value="${dare.name}">
        <input type="text" class="edit-description" value="${dare.dare}">
        <input type="text" class="edit-difficulty" value="${dare.difficulty}">
        <input type="text" class="edit-category" value="${dare.category}">
        <button class="save-button"><i class="fa-solid fa-save"></i> Save</button>
    `;

    
    const saveButton = dareItem.querySelector(".save-button");
    saveButton.addEventListener("click", async () => {
        await updateDare(dare.id, dareItem);
    });
}

async function updateDare(dareId, dareItem) {
    try {
        const updatedDare = {
            name: dareItem.querySelector(".edit-name").value,
            dare: dareItem.querySelector(".edit-description").value,
            difficulty: dareItem.querySelector(".edit-difficulty").value,
            category: dareItem.querySelector(".edit-category").value
        };

        const response = await fetch(`http://localhost:3000/express/dare/${dareId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedDare)
        });

        if (response.ok) {
            console.log("Dare updated successfully");
            fetchDares(); // Refresh list after update
        } else {
            console.error("Failed to update dare");
        }
    } catch (error) {
        console.error("Error updating dare:", error);
    }
}

//add dare
    const modal = document.getElementById("add-dare-modal");
    const openModalButton = document.getElementById("open-modal-button");
    const closeModalButton = document.querySelector(".close-modal");
    const cancelModalButton = document.getElementById("cancel-modal-button");
    const saveDareButton = document.getElementById("save-dare-button");
    const modalForm = document.getElementById("modal-dare-form");

    // Open modal
    openModalButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close modal
    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    cancelModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Save Dare
    modalForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dareData = {
            name: document.getElementById("modal-name").value,
            dare: document.getElementById("modal-dare").value,
            difficulty: document.getElementById("modal-difficulty").value,
            category: document.getElementById("modal-category").value
        };

        try {
            const response = await fetch("http://localhost:3000/express/dare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dareData)
            });

            if (response.ok) {
                console.log("Dare added successfully");
                modalForm.reset();
                modal.style.display = "none";
                fetchDares(); // Refresh the list of dares
            } else {
                console.error("Failed to add dare");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

//delete
async function deleteDare(dareId) {
    try {
        console.log("Deleting dare with ID:", dareId); // Log the ID before making the request
        const response = await fetch(`http://localhost:3000/express/dare/${dareId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            console.log("Dare deleted successfully");
        } else {
            console.error("Failed to delete dare");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

