import { pool } from "../data/connection.js";
import jwt from "jsonwebtoken";
import { generateHash, compareHash } from "../utils/hash.js";
import { JWT_SECRET } from "../config/config.js";

export const signup = async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({ message: "Nombre, email y contraseña son requeridos" });
    }

    try {
        const hash = await generateHash(password);

        const { rows } = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hash]
        );

        response.status(201).json(rows[0]);

    } catch (error) {
        if (error.code === '23505') {
            return response.status(409).json({ message: "El email ya está registrado." });
        }
        console.error("Error creating user in DB:", error);
        return response.status(500).send("Error al registrar usuario.");
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 LIMIT 1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const user = result.rows[0];

        const isPasswordValid = await compareHash(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });

    } catch (err) {
        res.status(500).json({ message: "Error en el servidor", error: err.message });
    }
};