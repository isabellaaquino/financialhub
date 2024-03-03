import { NewLabelFormData } from "../../schemas/newLabelSchema";
import { api } from "./Api";

class LabelService {
  async createLabelAPI({
    accessToken,
    label,
  }: {
    accessToken: string;
    label: NewLabelFormData;
  }): Promise<{ [key: string]: string } | null> {
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
