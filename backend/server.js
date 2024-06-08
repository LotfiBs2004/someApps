const express = require('express');
const cors = require('cors'); // Importing cors package
const path = require('path'); 
const app = express();
const mysql = require('mysql');
const axios = require('axios');
// Enable CORS for all routes
app.use(cors());

// Define your routes and middleware here

const port = 7000;  

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '01061977',
    database: 'test'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, "../public/index.html"));
}); 



app.get("/users", (req, res) => {
    db.query('SELECT * FROM user', (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            res.end();
        } else {
            res.json(result); 
        }
    });
});

 
app.get('/search', async (req, res) => {
    const query = req.query.q;
    const apiKey = 'ouBreb-IslvgFL3PhfA4wQqDwbIYN2lAse9E4uKlzyg'; // Replace with your Unsplash API key

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query },
            headers: {
                Authorization: `Client-ID ${apiKey}`
            }
        });
        res.json(response.data.results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching images');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
