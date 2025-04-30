import "./tableHeader.scss";
import TableHeaderLabel from "../TableHeaderLabel/TableHeaderLabel";

function TableHeader({
  labels,
  onSort,
  currentSortField,
  currentSortOrder,
  isMobile,
}) {
  // Map UI labels to API field names
  const mapLabelToField = (label) => {
    const labelMap = {
      WAREHOUSE: "warehouse_name",
      ADDRESS: "address",
      "CONTACT NAME": "contact_name",
      "CONTACT INFORMATION": "contact_phone",
      "INVENTORY ITEM": "item_name",
      CATEGORY: "category",
      STATUS: "status",
      QTY: "quantity",
      QUANTITY: "quantity",
    };

    return labelMap[label] || label.toLowerCase().replace(" ", "_");
  };

  const handleSort = (label) => {
    const field = mapLabelToField(label);

    // If clicking the same column, toggle direction. Otherwise, set to ascending
    const newOrder =
      field === currentSortField
        ? currentSortOrder === "asc"
          ? "desc"
          : "asc"
        : "asc";

    onSort(field, newOrder);
  };

  return (
    <div className="table-header">
      <div className="table-header__info-groups">
        {labels.map((label, index) => (
          <TableHeaderLabel
            key={index}
            labelText={label}
            onSort={handleSort}
            isSortable={true}
            isMobile={isMobile}
            isSorted={mapLabelToField(label) === currentSortField}
            sortOrder={currentSortOrder}
          />
        ))}
      </div>
      <div className="table-header__actions">
        <label className="table-header__label">ACTIONS</label>
      </div>
    </div>
  );
}

export default TableHeader;
