import { pool } from "../data/connection.js";

export const createSale = async (req, res) => {
    const { amount, id_customer } = req.body;

    if (!amount || !id_customer) {
        return res.status(400).json({ message: "El monto (amount) y el ID de cliente (id_customer) son requeridos." });
    }

    try {
        const customerCheck = await pool.query(
            'SELECT id FROM customers WHERE id = $1',
            [id_customer]
        );

        if (customerCheck.rows.length === 0) {
            return res.status(404).json({ message: "Error: El cliente con el ID especificado no existe." });
        }

        const { rows } = await pool.query(
            'INSERT INTO sales (amount, id_customer, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [amount, id_customer]
        );

        res.status(201).json(rows[0]);

    } catch (error) {
        console.error("Error al registrar la venta:", error);
        res.status(500).json({ message: "Error interno del servidor al registrar la venta." });
    }
};

export const getSales = (req, res) => {

    const query = `
        SELECT s.id, s.amount, s.created_at, c.name AS customer_name
        FROM sales s
        JOIN customers c ON s.id_customer = c.id
        ORDER BY s.created_at DESC;
    `;

    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results.rows);
    });
};

export const getSalesReport = (req, res) => {

    const query = `
        SELECT c.name, SUM(s.amount) AS total_sales
        FROM sales s
        JOIN customers c ON s.id_customer = c.id
        GROUP BY c.name
        ORDER BY total_sales DESC;
    `;

    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results.rows);
    });
};