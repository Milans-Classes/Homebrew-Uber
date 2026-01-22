const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// IN-MEMORY DATA STORE (Resets on server restart)
let rides = [];
let idCounter = 1;

// 1. API to create a ride (Rider)
app.post('/api/rides', (req, res) => {
    const { name, email, start, end, minPrice, maxPrice, datetime } = req.body;
    
    const newRide = {
        id: idCounter++,
        name,
        email,
        start,
        end,
        minPrice,
        maxPrice,
        datetime: datetime || new Date().toISOString(), // Default to now if not set
        status: 'pending', // pending, accepted
        driver: null
    };
    
    rides.push(newRide);
    console.log(`New Ride Requested: ${newRide.id} by ${name}`);
    res.json({ success: true, ride: newRide });
});

// 2. API to get all pending rides (Driver)
app.get('/api/rides', (req, res) => {
    // Only send rides that haven't been taken yet
    const availableRides = rides.filter(r => r.status === 'pending');
    res.json(availableRides);
});

// 3. API to accept a ride (Driver)
app.post('/api/rides/:id/accept', (req, res) => {
    const rideId = parseInt(req.params.id);
    const rideIndex = rides.findIndex(r => r.id === rideId);

    if (rideIndex !== -1 && rides[rideIndex].status === 'pending') {
        rides[rideIndex].status = 'accepted';
        
        // In a real app, you would use Nodemailer here to email the user
        console.log(`CONFIRMATION SENT: Ride ${rideId} accepted for passenger ${rides[rideIndex].email}`);
        
        res.json({ success: true, message: "Ride accepted! Details sent." });
    } else {
        res.status(400).json({ success: false, message: "Ride no longer available." });
    }
});

// Serve frontend files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/rider', (req, res) => res.sendFile(path.join(__dirname, 'public', 'rider.html')));
app.get('/driver', (req, res) => res.sendFile(path.join(__dirname, 'public', 'driver.html')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});