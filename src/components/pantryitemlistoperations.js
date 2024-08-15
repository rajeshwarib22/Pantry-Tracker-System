import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  limit,
} from "firebase/firestore";
import { auth, db } from "../components/firebase";
import "../styles/pantryItemsOperations.css";

const ITEMS_PER_PAGE = 15;
const CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Meat",
  "Grains",
  "Snacks",
  "Breakfast",
  "Spices",
  "Other",
];

const PantryItemOperations = () => {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updateItemId, setUpdateItemId] = useState(null);

  const updatePaginatedItems = useCallback(
    (itemsList) => {
      const filteredItems = itemsList.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;

      setItems(filteredItems.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    },
    [searchTerm, currentPage]
  );

  useEffect(() => {
    const fetchItems = async () => {
      const user = auth.currentUser;
      if (user) {
        const itemsRef = collection(db, "PantryList", user.uid, "pantry");
        const q = query(
          itemsRef,
          orderBy("createdAt", "desc"),
          limit(ITEMS_PER_PAGE * 10)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const itemList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAllItems(itemList);

          updatePaginatedItems(itemList);
        });

        return () => unsubscribe();
      }
    };

    fetchItems();
  }, [updatePaginatedItems]);

  useEffect(() => {
    if (allItems.length) {
      updatePaginatedItems(allItems);
    }
  }, [searchTerm, currentPage, allItems, updatePaginatedItems]);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const item = {
        name,
        quantity: Number(quantity),
        createdAt: new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        category,
      };

      try {
        if (updateItemId) {
          // Update existing item
          const itemDoc = doc(
            db,
            "PantryList",
            user.uid,
            "pantry",
            updateItemId
          );
          await updateDoc(itemDoc, item);
        } else {
          await addDoc(collection(db, "PantryList", user.uid, "pantry"), item);
        }

        setName("");
        setQuantity(1);
        setExpiryDate("");
        setCategory("");
        setUpdateItemId(null);
      } catch (error) {
        console.error("Error adding/updating item: ", error);
      }
    }
  };

  const handleDelete = async (itemId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteDoc(doc(db, "PantryList", user.uid, "pantry", itemId));
      } catch (error) {
        console.error("Error deleting item: ", error);
      }
    }
  };

  const handleUpdateClick = (item) => {
    setName(item.name);
    setQuantity(item.quantity);
    setExpiryDate(
      item.expiryDate
        ? new Date(item.expiryDate.toDate()).toISOString().split("T")[0]
        : ""
    );
    setCategory(item.category || ""); // Set category
    setUpdateItemId(item.id); // Set the ID of the item to be updated
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="pantry-container">
      <h1>Pantry List</h1>
      <form onSubmit={handleAddOrUpdate} className="add-item-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item Name"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          min="1"
          required
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="Expiry Date (optional)"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button className="btn btn-outline-primary" type="submit">
          {updateItemId ? "Update Item" : "Add Item"}
        </button>
      </form>

      <form>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search items"
          className="search-bar"
        />
      </form>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Expiry Date</th>
            <th>Category</th> {/* New column for category */}
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                {item.expiryDate
                  ? new Date(item.expiryDate.toDate()).toLocaleDateString()
                  : "---"}
              </td>
              <td>{item.category || "---"}</td> {/* Display category */}
              <td>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleUpdateClick(item)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePagination(index + 1)}
            className={index + 1 === currentPage ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PantryItemOperations;
