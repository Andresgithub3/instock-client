import "./inventories.scss";
import { useState, useEffect } from "react";
import {
  inventoriesEndpoint,
  inventoryPageIndex,
} from "../../data/appData.json";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Outlet, useLocation } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import TableHeader from "../../components/TableHeader/TableHeader";
import TableRowInventory from "../../components/TableRowInventory/TableRowInventory";

function Inventories({ setNavIndex, setDeleteModal }) {
  useEffect(() => {
    setNavIndex(inventoryPageIndex);
  }, [setNavIndex]);

  const [inventories, setInventories] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [doRefresh, setDoRefresh] = useState(false);
  const currentPath = useLocation().pathname;
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchInventories = async () => {
    try {
      // Add sort parameters to the API call if we're not on mobile
      let url = inventoriesEndpoint;
      if (!isMobile && sortField) {
        url = `${url}?sort_by=${sortField}&order=${sortOrder}`;
      }

      const inventoriesResponse = await axios.get(url);
      setInventories(inventoriesResponse.data);
    } catch (error) {
      console.log(`Could not load inventories: ${error}`);
    }
  };

  // Sort handler
  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const renderInventories = () => {
    return inventories.map((inventory) => {
      return (
        <TableRowInventory
          inventory={inventory}
          showWarehouse={true}
          key={uuidv4()}
        />
      );
    });
  };

  // Fetch inventories on initial load
  useEffect(() => {
    fetchInventories();
  }, []);

  // Fetch inventories when sort parameters change
  useEffect(() => {
    if (!isDeleting) {
      // Only fetch if not in delete mode
      fetchInventories();
    }
  }, [sortField, sortOrder, isMobile]);

  // Handle delete state
  useEffect(() => {
    if (currentPath.includes("delete")) {
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
      fetchInventories();
      setDoRefresh(false);
    }
  }, [doRefresh]);

  const tableLabels = [
    "INVENTORY ITEM",
    "CATEGORY",
    "STATUS",
    "QTY",
    "WAREHOUSE",
  ];

  return (
    <main className="inventories">
      <div
        className={`inventories__page-background ${
          isDeleting ? "inventories__page-foreground--hide" : ""
        }`}
      ></div>
      <div
        className={`inventories__page-foreground ${
          isDeleting ? "inventories__page-foreground--hide" : ""
        }`}
      >
        <Hero
          heroTitle="Inventory"
          buttonText="+ Add New Item"
          addButtonUrl={"/inventories/add"}
        />
        <section className="inventories__table">
          <TableHeader
            labels={tableLabels}
            onSort={handleSort}
            currentSortField={sortField}
            currentSortOrder={sortOrder}
            isMobile={isMobile}
          />
          {renderInventories()}
        </section>
      </div>
      <div
        className={`inventories__dimming-overlay ${
          isDeleting ? "" : "inventories__dimming-overlay--hidden"
        }`}
      ></div>
      <div
        className={`inventories__delete-modal ${
          isDeleting ? "" : "inventories__delete-modal--hidden"
        }`}
      >
        <Outlet context={{ setDoRefresh }} />
      </div>
    </main>
  );
}

export default Inventories;
