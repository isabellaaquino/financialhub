import axios from "axios";
import { CustomLabel } from "../../models/CustomLabel";
import { api } from "./Api";
import { TransactionInput } from "../../components/AddTransaction";

class LabelService {
  async getUserLoggedLabels(
    accessToken: string,
  ): Promise<CustomLabel[]> {
    try {
      const endpoint = "/labels/";
      const response = await api.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data as CustomLabel[];
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createLabelAPI(
    accessToken: string,
    label: CustomLabel
  ): Promise<{ [key: string]: string } | null> {
    try {
      const response = await api.post("/label/", label, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) return null;
      return await response.data;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async deleteLabelAPI(
    accessToken: string,
    label_pk: number
  ): Promise<{ [key: string]: string } | null> {
    try {
      const response = await api.delete(`/label/${label_pk}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return await response.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }
}

const labelService = new LabelService();
export default labelService;
