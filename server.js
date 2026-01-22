const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer'); // Import Nodemailer
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// EMAIL CONFIGURATION
// For Gmail, you usually need to generate an "App Password" in your Google Account settings.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address (set in Render Env Vars)
        pass: process.env.EMAIL_PASS  // Your email password or App Password
    }
});

// IN-MEMORY DATA STORE
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
        datetime: datetime || new Date().toISOString(),
        status: 'pending'
    };
    
    rides.push(newRide);
    console.log(`New Ride Requested: ${newRide.id} by ${name}`);
    res.json({ success: true, ride: newRide });
});

// 2. API to get all pending rides (Driver)
app.get('/api/rides', (req, res) => {
    res.json(rides); // Since we delete accepted rides now, the list only contains pending ones
});

// 3. API to accept a ride (Driver)
app.post('/api/rides/:id/accept', async (req, res) => {
    const rideId = parseInt(req.params.id);
    const { driverEmail } = req.body; // Get driver email from frontend
    
    const rideIndex = rides.findIndex(r => r.id === rideId);

    if (rideIndex !== -1) {
        const ride = rides[rideIndex];

        // 1. Prepare Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: `${ride.email}, ${driverEmail}`, // Send to BOTH rider and driver
            subject: 'Ride Confirmed! - Lowkey Rides',
            text: `
                Ride Confirmed!
                
                From: ${ride.start}
                To: ${ride.end}
                Time: ${ride.datetime}
                Price Range: $${ride.minPrice} - $${ride.maxPrice}
                
                Driver Contact: ${driverEmail}
                Rider Contact: ${ride.email}
            `
        };

        // 2. Send Email
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Emails sent to ${ride.email} and ${driverEmail}`);
        } catch (error) {
            console.error("Error sending email:", error);
            // We continue even if email fails, or you could return an error here
        }

        // 3. DELETE the ride from the database (array)
        rides.splice(rideIndex, 1);
        
        res.json({ success: true, message: "Ride accepted, emails sent, and removed from list." });
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