import useAxiosPrivate from "../useAxiosPrivate";
import { CustomLabel } from "../../models/CustomLabel";
import { NewLabelFormData } from "../../schemas/newLabelSchema";

export function useLabels() {
  const axiosPrivate = useAxiosPrivate();

  async function getLabels(): Promise<CustomLabel[]> {
    try {
      const endpoint = "/labels/";
      const response = await axiosPrivate.get(endpoint);
      const data = response.data as CustomLabel[];
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function createLabel({
    label,
  }: {
    label: NewLabelFormData;
  }): Promise<{ [key: string]: string } | null> {
    try {
      const response = await axiosPrivate.post("/label/", label);
      if (response.status !== 200) return null;
      return await response.data;
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  async function deleteLabel(
    label_pk: number
  ): Promise<{ [key: string]: string } | null> {
    try {
      const response = await axiosPrivate.delete(`/label/${label_pk}`);
      return await response.data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  return { getLabels, createLabel, deleteLabel };
}
