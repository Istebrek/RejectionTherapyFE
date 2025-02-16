const axios = require("axios");
const express = require("express");
const fetch = require("node-fetch");
const cors = require ("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(express.static("public"));
app.use(cors());

const URL = "https://rejectiontherapy-gtfecsatecebfna4.westeurope-01.azurewebsites.net";



//Get All Dares
app.get("/express/dares", async (req, res) => {
    try {
        const response = await axios.get(`${URL}/dares`);
        res.status(200).json(response.data);
        console.log("Dares loaded successfully");
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch dares" });
    }
});
//Get All Users
app.get("/express/users", async (req, res) => {
    try {
        const response = await axios.get(`${URL}/users`);
        res.status(200).json(response.data);
        console.log("Users loaded successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});
//Add dare
app.post("/express/dare", async (req, res) => {
    try {
        const response = await axios.post(`${URL}/dare`, req.body, {
            headers: { "Content-Type": "application/json" }
        });
        res.status(201).json(response.data);
        console.log("Dare added successfully");
    } catch (error) {
        res.status(500).json({ error: "Failed to add dare" });
    }
});

//Add user
app.post("/express/user", async (req, res) => {
    try {
        const response = await axios.post(`${URL}/user`, req.body, {
            headers: { "Content-Type": "application/json" }
        });
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json(error);
    }
});


//Get by id
app.get("/express/dare/:id", async (req, res) => {
    try {
        const dareId = req.params.id;
        const response = await axios.get(`${URL}/dare/${dareId}`, {
            headers: { "Content-Type": "application/json" }
        });
        res.status(200).json(response.data);
        console.log("Dare fetched successfully");
    } catch (error) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        res.status(404).json({ error: "Dare not found" });
    }
});


//update
app.put("/express/dare/:id", async (req, res) => {
    try {
        const dareId = req.params.id;
        const updatedDare = { ...req.body, id: dareId }; // Attach the ID to the body

        const response = await axios.put(`${URL}/dare`, updatedDare, {
            headers: { "Content-Type": "application/json" }
        });

        res.status(200).json(response.data);
        console.log("Dare updated successfully");
    } catch (error) {
        console.error("Error updating dare:", error);
        res.status(500).json({ error: "Failed to update dare" });
    }
});

//update user
app.put("/express/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = { ...req.body, id: userId }; // Attach the ID to the body

        const response = await axios.put(`${URL}/user`, updatedUser, {
            headers: { "Content-Type": "application/json" }
        });

        res.status(200).json(response.data);
        console.log("User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});


//delete
app.delete("/express/dare/:id", async (req, res) => {
    try {
        const dareId = req.params.id;
        const response = await axios.delete(`${URL}/dare/${dareId}`, {
            headers: { "Content-Type": "application/json" }
        });

        res.status(200).json(response.data);
        console.log("Dare deleted successfully");
    } catch (error) {
        console.error("Error deleting dare:", error);
        res.status(500).json({ error: "Failed to delete dare" });
    }
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));