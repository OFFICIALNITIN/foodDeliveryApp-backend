//index.js app entry point
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const priceRouter = require('./src/routes/priceRouter.js')

// Middleware
app.use(express.json())

//Routes
app.use("/api/",priceRouter)

//Start Server
        // Start your Express app
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        });