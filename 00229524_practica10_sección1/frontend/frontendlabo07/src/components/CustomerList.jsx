import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.get('/customers');

                setCustomers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar clientes: ' + err.message);
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) {
        return <p>Cargando clientes...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="customer-list-container">
            <h2>Lista de Clientes</h2>
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Código</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.address}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.code}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerList;