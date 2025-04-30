import "./warehouse.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  warehousesEndpoint,
  warehousesPageIndex,
} from "../../data/appData.json";
import { v4 as uuidv4 } from "uuid";
import HeroWhDetails from "../../components/HeroWhDetails/HeroWhDetails";
import WhDetails from "../../components/WhDetails/WhDetails";
import TableHeader from "../../components/TableHeader/TableHeader";
import TableRowInventory from "../../components/TableRowInventory/TableRowInventory";

function Warehouse({ setNavIndex }) {
  useEffect(() => {
    setNavIndex(warehousesPageIndex);
  }, [setNavIndex]);

  const { id } = useParams();
  const [warehouseDetails, setWarehouseDetails] = useState([]);
  const [warehouseInventory, setWarehouseInventory] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchWarehouseDetails = async () => {
    try {
      const warehouseResponse = await axios.get(`${warehousesEndpoint}/${id}`);
      setWarehouseDetails(warehouseResponse.data);
    } catch (error) {
      console.log(`Could not load warehouse details: ${error}`);
    }
  };

  const fetchWarehouseInventory = async () => {
    try {
      // Add sort parameters to API call if not on mobile
      let url = `${warehousesEndpoint}/${id}/inventories`;
      if (!isMobile && sortField) {
        url = `${url}?sort_by=${sortField}&order=${sortOrder}`;
      }

      const warehouseInventoryResponse = await axios.get(url);
      setWarehouseInventory(warehouseInventoryResponse.data);
    } catch (error) {
      console.log(`Could not load warehouse inventory: ${error}`);
    }
  };

  // Sort handler
  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const renderInventory = () => {
    return warehouseInventory.map((inventory) => {
      return <TableRowInventory inventory={inventory} key={uuidv4()} />;
    });
  };

  // Fetch warehouse details on first load
  useEffect(() => {
    fetchWarehouseDetails();
  }, [id]);

  // Fetch warehouse inventory when sort parameters change
  useEffect(() => {
    fetchWarehouseInventory();
  }, [id, sortField, sortOrder, isMobile]);

  const tableLabels = ["INVENTORY ITEM", "CATEGORY", "STATUS", "QUANTITY"];

  return (
    <main className="warehouse">
      <div className="warehouse__page-background"></div>
      <div className="warehouse__page-foreground">
        <HeroWhDetails heroTitle={warehouseDetails.warehouse_name} id={id} />
        <WhDetails warehouseDetails={warehouseDetails} />
        <section className="warehouse__table">
          <TableHeader
            labels={tableLabels}
            onSort={handleSort}
            currentSortField={sortField}
            currentSortOrder={sortOrder}
            isMobile={isMobile}
          />
          {renderInventory()}
        </section>
      </div>
    </main>
  );
}

export default Warehouse;
