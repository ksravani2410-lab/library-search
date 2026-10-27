
import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      try {
        setError("");
        const response = await fetch(
          `http://localhost:5000/api/books?q=${encodeURIComponent(search)}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Request failed");

        setBooks(await response.json());
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load books. Check the backend.");
        }
      }
    }

    fetchBooks();
    return () => controller.abort();
  }, [search]);

  return (
    <div className="container">
      <h1>Digital Library</h1>
      <p>Search your favourite books</p>

      <input
        className="search"
        placeholder="Search by title, author or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p>{error}</p>}

      <div className="book-list">
        {!error && books.length === 0 && <p>No books found.</p>}

        {books.map(book => (
          <div className="book" key={book._id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <span>{book.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
