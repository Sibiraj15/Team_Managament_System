import { useEffect, useState } from "react";

const initialState = {
  name: "",
  description: ""
};

export default function TeamForm({ onSubmit, loading, initialValues = initialState, submitLabel }) {
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
      <label className="full-width">
        <span>Team name <span className="required-mark">*</span></span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter team name"
          required
        />
      </label>
      <label className="full-width">
        <span>Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the team"
          rows="3"
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel || "Create Team"}
      </button>
    </form>
  );
}
