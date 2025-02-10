const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
		.then(() => console.log("MongoDB Connected"))
 	 	.catch(err => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rides", require("./routes/rides"));


app.get('/', (req, res) => {
	res.send('Hello, welcome to the root route!');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
