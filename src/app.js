const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const errorMiddleware = require("./utils/errorMiddleware");

app.use(express.json());
app.use(cors())
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/documents", documentRoutes);


app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use(errorMiddleware);

module.exports = app;