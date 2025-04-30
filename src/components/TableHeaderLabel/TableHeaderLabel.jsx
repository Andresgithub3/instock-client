import "./tableHeaderLabel.scss";
import Button from "../Button/Button";
import SortIcon from "../../assets/icons/sort-24px.svg";

function TableHeaderLabel({
  labelText,
  onSort,
  isSortable = true,
  isMobile = false,
  isSorted = false,
  sortOrder = "asc",
}) {
  const handleSortClick = () => {
    if (!isSortable || isMobile) return;
    onSort(labelText);
  };

  return (
    <div className="table-header-label">
      <label className="table-header-label__label">{labelText}</label>
      {!isMobile && (
        <Button
          imgSrc={SortIcon}
          buttonType="icon-only"
          onClick={handleSortClick}
          className={`table-header-label__button ${
            isSorted ? `table-header-label__button--${sortOrder}` : ""
          }`}
        />
      )}
    </div>
  );
}

export default TableHeaderLabel;
