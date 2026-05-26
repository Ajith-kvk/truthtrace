import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useCheck = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitClaim = async (claimText) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Get token if user is logged in
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/api/check`,
        { claimText },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return { result, loading, error, submitClaim, clearResult };
};

export default useCheck;