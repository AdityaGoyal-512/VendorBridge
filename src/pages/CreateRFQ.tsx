import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRFQ() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    productName: "",
    description: "",
    quantity: 1,
    estimatedBudget: 0,
    category: "",
    priority: "medium",
    deadline: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:8080/api/v1/rfqs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          createdBy: "685000000000000000000001",
        }),
      }
    );

    if (response.ok) {
      navigate("/rfqs");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create RFQ
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          className="border p-3 w-full rounded"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Product Name"
          name="productName"
          onChange={handleChange}
        />

        <textarea
          className="border p-3 w-full rounded"
          placeholder="Description"
          name="description"
          onChange={handleChange}
        />

        <input
          type="number"
          className="border p-3 w-full rounded"
          placeholder="Quantity"
          name="quantity"
          onChange={handleChange}
        />

        <input
          type="number"
          className="border p-3 w-full rounded"
          placeholder="Budget"
          name="estimatedBudget"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Category"
          name="category"
          onChange={handleChange}
        />

        <select
          name="priority"
          className="border p-3 w-full rounded"
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          name="deadline"
          className="border p-3 w-full rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Create RFQ
        </button>
      </form>
    </div>
  );
}