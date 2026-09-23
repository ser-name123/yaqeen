"use client";

import { useState, useMemo } from "react";
import "./AdminDataTable.css";

export default function AdminDataTable({
  title,
  subtitle,
  data = [],
  columns = [],
  searchPlaceholder = "Search records...",
  searchKeys = [],
  actions = null,
  headerAction = null,
  emptyMessage = "No records found.",
  defaultPageSize = 10,
  keyField = "id"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase().trim();

    return data.filter((item) => {
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const val = item[key];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(term);
        });
      }
      // If no search keys specified, search all string/number fields
      return Object.values(item).some((val) => {
        if (typeof val === "string" || typeof val === "number") {
          return String(val).toLowerCase().includes(term);
        }
        return false;
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  // Ensure current page is valid after filtering or page size change
  const validCurrentPage = Math.min(currentPage, totalPages);
  if (validCurrentPage !== currentPage && totalPages > 0) {
    setCurrentPage(validCurrentPage);
  }

  // Slice paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, validCurrentPage, pageSize]);

  // Calculate start & end indices for info label
  const startEntry = filteredData.length === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endEntry = Math.min(validCurrentPage * pageSize, filteredData.length);

  // Generate page numbers to show
  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validCurrentPage > 3) pages.push("...");
      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(totalPages - 1, validCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (validCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, validCurrentPage]);

  return (
    <div className="admin-datatable-wrapper">
      {/* Top Header & Toolbar */}
      <div className="admin-datatable-top">
        <div className="admin-datatable-title-group">
          {title && <h3 className="admin-datatable-title">{title}</h3>}
          {subtitle && <p className="admin-datatable-subtitle">{subtitle}</p>}
        </div>

        <div className="admin-datatable-actions-group">
          {/* Search Box */}
          <div className="admin-datatable-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="admin-datatable-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="admin-datatable-search-clear"
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          {/* Page size selector */}
          <div className="admin-datatable-pagesize">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="admin-datatable-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Optional Header Export or custom action */}
          {headerAction}
        </div>
      </div>

      {/* Table Container with Horizontal Scrolling */}
      <div className="admin-datatable-scroll-container">
        <table className="admin-datatable-table">
          <thead>
            <tr>
              <th className="th-number" style={{ width: "50px", textAlign: "center" }}>#</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: col.align || "left",
                    width: col.width || "auto",
                    minWidth: col.minWidth || "auto"
                  }}
                >
                  {col.label}
                </th>
              ))}
              {actions && <th style={{ textAlign: "right", minWidth: "160px" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 2 : 1)} className="admin-datatable-empty">
                  {searchTerm ? `No results matching "${searchTerm}"` : emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const globalIndex = (validCurrentPage - 1) * pageSize + index + 1;
                const rowKey = row[keyField] || index;

                return (
                  <tr key={rowKey} className="admin-datatable-row">
                    <td className="td-number" style={{ textAlign: "center" }}>
                      <span className="row-number-badge">{globalIndex}</span>
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ textAlign: col.align || "left" }}
                      >
                        {col.render ? col.render(row, index, globalIndex) : (row[col.key] ?? "—")}
                      </td>
                    ))}
                    {actions && (
                      <td className="td-actions" style={{ textAlign: "right" }}>
                        <div className="actions-cell-wrapper">
                          {actions(row, index, globalIndex)}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Downside Pagination & Count Info */}
      <div className="admin-datatable-footer">
        <div className="admin-datatable-info">
          Showing <strong>{startEntry}</strong> to <strong>{endEntry}</strong> of <strong>{filteredData.length}</strong> entries
          {searchTerm && filteredData.length !== data.length && (
            <span className="admin-datatable-filtered-text"> (filtered from {data.length} total)</span>
          )}
        </div>

        {totalPages > 1 && (
          <div className="admin-datatable-pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="page-nav-btn"
              aria-label="Previous Page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <span>Prev</span>
            </button>

            <div className="page-numbers-group">
              {pageNumbers.map((num, i) => {
                if (num === "...") {
                  return <span key={`ellipsis-${i}`} className="page-ellipsis">&hellip;</span>;
                }
                const isActive = num === validCurrentPage;
                return (
                  <button
                    key={`page-${num}`}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={`page-num-btn ${isActive ? "active" : ""}`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="page-nav-btn"
              aria-label="Next Page"
            >
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
