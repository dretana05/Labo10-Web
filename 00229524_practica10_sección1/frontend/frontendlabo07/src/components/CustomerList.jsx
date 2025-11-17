import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchCode, setSearchCode] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

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

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearching(true);
        setSearchError(null);
        setSearchResult(null);

        if (!searchCode) {
            setSearchError("Por favor ingrese un código para buscar.");
            setIsSearching(false);
            return;
        }

        try {
            const response = await api.get(`/customers/search?code=${searchCode}`);
            setSearchResult(response.data);
            setSearchError(null);
        } catch (err) {
            setSearchError(err.response?.data?.message || "Error en la búsqueda.");
            setSearchResult(null);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchCode('');
        setSearchResult(null);
        setSearchError(null);
    };

    if (loading) {
        return <p>Cargando clientes...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="customer-list-container">

            <form onSubmit={handleSearch} className="search-form">
                <h2>Buscar Cliente por Código</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Ingrese código"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                    />
                    <button type="submit" disabled={isSearching}>
                        {isSearching ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button type="button" onClick={clearSearch} className="clear-btn">
                        Limpiar
                    </button>
                </div>
                {searchError && <p className="form-error">{searchError}</p>}
            </form>

            {searchResult && (
                <div className="search-result-container">
                    <h3>Resultado de la Búsqueda</h3>
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
                            <tr>
                                <td>{searchResult.id}</td>
                                <td>{searchResult.name}</td>
                                <td>{searchResult.address}</td>
                                <td>{searchResult.phone}</td>
                                <td>{searchResult.code}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            <hr style={{ margin: '2rem 0' }} />

            {!searchResult && (
                <>
                    <h2>Lista Completa de Clientes</h2>
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
                </>
            )}
        </div>
    );
}

export default CustomerList;