const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const buildUrl = (path, query = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message || "Request failed",
      response.status,
      data.errors || null
    );
  }

  return data;
};

const getHeaders = (includeJson = true) => {
  const token = localStorage.getItem("auth_token");

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiClient = {
  get: async (path, query) => {
    try {
      const response = await fetch(buildUrl(path, query), {
        headers: getHeaders(false)
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Unable to reach server. Check whether backend is running.", 0);
    }
  },
  post: async (path, body) => {
    try {
      const response = await fetch(buildUrl(path), {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body)
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Unable to reach server. Check whether backend is running.", 0);
    }
  },
  patch: async (path, body) => {
    try {
      const response = await fetch(buildUrl(path), {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(body)
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Unable to reach server. Check whether backend is running.", 0);
    }
  },
  delete: async (path) => {
    try {
      const response = await fetch(buildUrl(path), {
        method: "DELETE",
        headers: getHeaders(false)
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Unable to reach server. Check whether backend is running.", 0);
    }
  }
};
