import { pool } from "../data/connection.js";

export const getCustomers = (request, response) => {

    pool.query('SELECT * FROM customers ORDER BY id ASC', (error, results) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        response.status(200).json(results.rows);
    });
};

export const getCustomerByCode = (request, response) => {
    const { code } = request.query;

    if (!code) {
        return response.status(400).json({ message: "El parámetro 'code' es requerido." });
    }

    const query = 'SELECT * FROM customers WHERE TRIM(code) = TRIM($1)';
    
    pool.query(query, [code], (error, results) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }

        if (results.rows.length === 0) {
            return response.status(404).json({ message: "Cliente no encontrado con ese código." });
        }

        response.status(200).json(results.rows[0]);
    });
};