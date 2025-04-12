import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ThemeContext } from "./context/ThemeContext";
import "react-toastify/dist/ReactToastify.css";

const SavedAnalyses = () => {
  const { theme } = useContext(ThemeContext);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterFavorites, setFilterFavorites] = useState("all");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch(
          "https://rose-renters-backend.onrender.com/api/analysis/all"
        );
        const data = await res.json();
        setAnalyses(data);

        const stored = localStorage.getItem("favorites");
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error("Failed to fetch analyses:", error);
        toast.error("Failed to load saved analyses.");
      } finally {
        setLoading(false);
        setFavoritesLoaded(true);
      }
    };

    fetchAnalyses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(
        `https://rose-renters-backend.onrender.com/api/analysis/delete/${id}`,
        { method: "DELETE" }
      );
      setAnalyses((prev) => prev.filter((item) => item._id !== id));
      setFavorites((prev) => {
        const updated = prev.filter((favId) => favId !== id);
        localStorage.setItem("favorites", JSON.stringify(updated));
        return updated;
      });
      toast.success("Analysis deleted.");
    } catch (error) {
      console.error("Failed to delete analysis:", error);
      toast.error("Error deleting analysis. Please try again.");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Purchase Price", "Monthly Rent", "Created At"];
    const rows = filteredAnalyses.map((item) => [
      item.purchasePrice,
      item.monthlyRent,
      new Date(item.createdAt).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "saved_analyses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((favId) => favId !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const filteredAnalyses = analyses
    .filter((item) => {
      const purchase = String(item.purchasePrice || "");
      const rent = String(item.monthlyRent || "");
      const matchSearch =
        purchase.includes(search.toLowerCase()) ||
        rent.includes(search.toLowerCase());
      const isFavorite = favorites.includes(item._id);
      return matchSearch && (filterFavorites === "all" || isFavorite);
    })
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  if (loading || !favoritesLoaded)
    return <p style={{ textAlign: "center" }}>Loading...</p>;

  const cardStyle = {
    padding: "1rem",
    marginBottom: "1rem",
    border: theme === "dark" ? "1px solid #333" : "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow:
      theme === "dark"
        ? "0 2px 5px rgba(255,255,255,0.05)"
        : "0 2px 5px rgba(0,0,0,0.05)",
    backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
    color: theme === "dark" ? "#f0f0f0" : "#111111",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 style={{ marginBottom: "1.5rem" }}>📂 Saved Analyses</h2>

      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by price or rent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            flex: "1 1 200px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <select
          value={filterFavorites}
          onChange={(e) => setFilterFavorites(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="all">All</option>
          <option value="favorites">Favorites Only</option>
        </select>
        <button
          onClick={handleExportCSV}
          style={{
            backgroundColor: "#10b981",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ⬇️ Download CSV
        </button>
      </div>

      {filteredAnalyses.length === 0 ? (
        <p>No matching results found.</p>
      ) : (
        filteredAnalyses.map((item) => {
          const isFavorited = favorites.includes(item._id);
          return (
            <div key={item._id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p>
                    <strong>Property:</strong> ${item.purchasePrice}
                  </p>
                  <p>
                    <strong>Monthly Rent:</strong> ${item.monthlyRent}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(item._id)}
                  style={{
                    fontSize: "1.25rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: isFavorited ? "#fbbf24" : "#aaa",
                    transition: "color 0.3s ease",
                  }}
                  title={isFavorited ? "Unfavorite" : "Mark as Favorite"}
                >
                  ⭐
                </button>
              </div>
              <div
                style={{ marginTop: "0.5rem", display: "flex", gap: "1rem" }}
              >
                <Link
                  to={`/analysis/${item._id}`}
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  View →
                </Link>
                <a
                  href={`${window.location.origin}/analysis/${item._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#059669", textDecoration: "none" }}
                >
                  Public Link ↗
                </a>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SavedAnalyses;
