const express = require("express");
const connectDB = require("./config/MongoDb");
const app = express();
const cors = require("cors");
const authRouter = require("./routes/AuthRouter");
const Adminroutes = require("./routes/Adminroutes");
const doctorRoutes = require("./routes/doctorRoutes");
const dotenv = require("dotenv");

app.use(express.json());
dotenv.config();
connectDB();

app.use(cors());

app.use("/api/v1/user", authRouter);
app.use("/api/v1/admin", Adminroutes);
app.use("/api/v1/doctor", doctorRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
