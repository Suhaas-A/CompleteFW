// src/hooks/useFetch.js
import { useState, useEffect } from "react";

export function useFetch(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiFn()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.detail || "Fetch failed"))
      .finally(() => setLoading(false));
  }, deps);

  return { data, loading, error };
}
