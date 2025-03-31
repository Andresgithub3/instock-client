import '../styles/warehouse.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { warehousesEndpoint } from '../data/apiData';
import { v4 as uuidv4 } from 'uuid';
import Hero from '../components/Hero/Hero';
import TableHeader from '../components/TableHeader/TableHeader';
import TableRow from '../components/TableRow/TableRow';

function Warehouse() {
    const [warehouses, setWarehouses] = useState([]);

    const fetchWarehouses = async () => {
        try {
            const warehousesResponse = await axios.get(warehousesEndpoint);
            setWarehouses(warehousesResponse.data);
        } catch (error) {
            console.log(`Could not load warehouses: ${error}`);
        }
    }

    const renderWarehouses = () => {
        return warehouses.map((warehouse) => {
            return (
                <TableRow warehouse={warehouse} key={uuidv4()}/>
            );
        });
    }

    useEffect( () => { fetchWarehouses(); }, []);

    return (
        <main className="warehouse">
            <Hero />
            <TableHeader />
            {renderWarehouses()}

        </main>
    );
}

export default Warehouse;