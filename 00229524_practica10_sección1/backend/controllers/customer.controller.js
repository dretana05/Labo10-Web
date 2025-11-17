import { pool } from "../data/connection.js";

export const getCustomers = (request, response) => {

    pool.query('SELECT * FROM customers ORDER BY id ASC', (error, results) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        response.status(200).json(results.rows);
    });
};