import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateVendor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gstNumber: "",
    email: "",
    phone: "",
    category: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "pincode"].includes(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:8080/api/v1/vendors",
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
      navigate("/vendors");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create Vendor
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          className="border p-3 w-full rounded"
          placeholder="Vendor Name"
          name="name"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="GST Number"
          name="gstNumber"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Phone"
          name="phone"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Category"
          name="category"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Street"
          name="street"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="City"
          name="city"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="State"
          name="state"
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Pincode"
          name="pincode"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Create Vendor
        </button>
      </form>
    </div>
  );
}