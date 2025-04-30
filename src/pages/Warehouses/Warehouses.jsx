import './warehouses.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { warehousesEndpoint, warehousesPageIndex } from '../../data/appData.json';
import { v4 as uuidv4 } from 'uuid';
import { Outlet, useLocation } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import TableHeader from '../../components/TableHeader/TableHeader';
import TableRow from '../../components/TableRow/TableRow';

function Warehouses({setNavIndex, setDeleteModal}) {
    useEffect(() => {
        setNavIndex(warehousesPageIndex);
    }, [setNavIndex]);
    
    const [warehouses, setWarehouses] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [doRefresh, setDoRefresh] = useState(false);
    const currentPath = useLocation().pathname;
    
    // Add sort state
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Check for mobile screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchWarehouses = async () => {
        try {
            // Add sort parameters to the API call if we're not on mobile
            let url = warehousesEndpoint;
            if (!isMobile && sortField) {
                url = `${url}?sort_by=${sortField}&order=${sortOrder}`;
            }
            
            const warehousesResponse = await axios.get(url);
            setWarehouses(warehousesResponse.data);
            console.log(warehousesResponse.data);
        } catch (error) {
            console.log(`Could not load warehouses: ${error}`);
        }
    }

    // Sort handler
    const handleSort = (field, order) => {
        setSortField(field);
        setSortOrder(order);
    };

    const renderWarehouses = () => {
        return warehouses.map((warehouse) => {
            return (
                <TableRow warehouse={warehouse} key={uuidv4()}/>
            );
        });
    }

    // Fetch warehouses on initial load
    useEffect(() => { 
        fetchWarehouses(); 
    }, []);
    
    // Fetch warehouses when sort parameters change
    useEffect(() => {
        if (!isDeleting) { // Only fetch if not in delete mode
            fetchWarehouses();
        }
    }, [sortField, sortOrder, isMobile]);
    
    // Handle delete state
    useEffect(() => {
        if (currentPath.includes('delete')) {
            setIsDeleting(true);
            setDeleteModal(true);
        } else {
            setIsDeleting(false);
            setDeleteModal(false);
        }
    }, [currentPath, setDeleteModal]);
    
    // Handle refresh after delete
    useEffect(() => {
        if (doRefresh) {
            fetchWarehouses();
            setDoRefresh(false);
        }
    }, [doRefresh]);

    const tableLabels = ['WAREHOUSE', 'ADDRESS', 'CONTACT NAME', 'CONTACT INFORMATION'];

    return (
        <main className="warehouses">
            <div className={`warehouses__page-background ${isDeleting ? 'warehouses__page-background--hide' : ''}`}></div>
            <div className={`warehouses__page-foreground ${isDeleting ? 'warehouses__page-foreground--hide' : ''}`}>
                <Hero heroTitle="Warehouses" buttonText="+ Add New Warehouse" addButtonUrl={'/warehouses/add'}/>
                <section className="warehouses__table">
                    <TableHeader 
                        labels={tableLabels}
                        onSort={handleSort}
                        currentSortField={sortField}
                        currentSortOrder={sortOrder}
                        isMobile={isMobile}
                    />
                    {renderWarehouses()}
                </section>
            </div>
            <div className={`warehouses__dimming-overlay ${isDeleting ? '' : 'warehouses__dimming-overlay--hidden'}`}></div>
            <div className={`warehouses__delete-modal ${isDeleting ? '' : 'warehouses__delete-modal--hidden'}`}>
                <Outlet context={{ setDoRefresh }}/>
            </div>
        </main>
    );
}

export default Warehouses;