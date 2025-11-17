import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PORT } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import customerRoutes from "./routes/customer.routes.js";

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.json({ info: 'Guía labo X' });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));