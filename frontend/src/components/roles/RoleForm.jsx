import { useEffect, useMemo, useState } from "react";

const initialState = {
  name: "",
  description: "",
  permissions: []
};

export default function RoleForm({
  onSubmit,
  loading,
  permissionsCatalog,
  initialValues = initialState,
  submitLabel
}) {
  const [form, setForm] = useState(initialValues);
  const availablePermissions = useMemo(() => permissionsCatalog || [], [permissionsCatalog]);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePermissionToggle = (permission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission]
    }));
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
        <span>Role name <span className="required-mark">*</span></span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Admin, Manager, Viewer"
          required
        />
      </label>
      <label>
        <span>Description</span>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the role"
        />
      </label>
      <div className="full-width">
        <span className="field-label">Permissions</span>
        <div className="selection-grid compact-grid">
          {availablePermissions.map((permission) => (
            <label
              className={`selection-card compact ${form.permissions.includes(permission) ? "active" : ""}`}
              key={permission}
            >
              <input
                type="checkbox"
                checked={form.permissions.includes(permission)}
                onChange={() => handlePermissionToggle(permission)}
              />
              <span className="selection-check" aria-hidden="true" />
              <div className="selection-copy">
                <strong>{permission}</strong>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="full-width form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel || "Create Role"}
        </button>
      </div>
    </form>
  );
}
