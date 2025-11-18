import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);

        // 🔑 STEP 2: Get token from AsyncStorage
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          throw new Error("Missing token — please log in first.");
        }

        const response = await fetch(
          "https://your-api-endpoint.com/api/plans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status} — ${text}`);
        }

        const json = await response.json();
        setPlans(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};
