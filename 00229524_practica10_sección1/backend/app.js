import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PORT } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.json({ info: 'Guía labo IX' });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));