import axios from "axios";
import { Review } from "../types/types";

export const getReceivedReviews = async (): Promise<Review[]> => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/reviews/received", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};