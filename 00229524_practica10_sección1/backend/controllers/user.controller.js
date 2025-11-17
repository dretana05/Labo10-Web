import { pool } from "../data/connection.js";
import { generateHash } from "../utils/hash.js";

export const getUsers = (request, response) => {
    pool.query('SELECT id, name, email FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        response.status(200).json(results.rows);
    });
};

export const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT id, name, email FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        if (results.rows.length === 0) {
            return response.status(404).json({ message: "Usuario no encontrado" });
        }
        response.status(200).json(results.rows[0]);
    });
};

export const updateUser = async (request, response) => {
    const id = parseInt(request.params.id);
    const { name, email, password } = request.body;

    try {
        if (password) {
            const hash = await generateHash(password);

            const { rows } = await pool.query(
                'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email',
                [name, email, hash, id]
            );

            if (rows.length === 0) {
                return response.status(404).json({ message: "Usuario no encontrado" });
            }
            response.status(200).json(rows[0]);

        } else {
            const { rows } = await pool.query(
                'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
                [name, email, id]
            );

            if (rows.length === 0) {
                return response.status(404).json({ message: "Usuario no encontrado" });
            }
            response.status(200).json(rows[0]);
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return response.status(500).send("Error al actualizar usuario.");
    }
};

export const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        if (results.rowCount === 0) {
            return response.status(404).json({ message: "Usuario no encontrado" });
        }
        response.status(200).send(`Usuario con ID: ${id} eliminado`);
    });
};