import { useEffect, useState } from "react";

const initialState = {
  name: "",
  email: ""
};

export default function UserForm({ onSubmit, loading, initialValues = initialState, submitLabel }) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(form);
    if (success !== false) {
      setForm(initialState);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        <span>Name <span className="required-mark">*</span></span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter user name"
          required
        />
      </label>
      <label>
        <span>Email <span className="required-mark">*</span></span>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel || "Create User"}
      </button>
    </form>
  );
}
