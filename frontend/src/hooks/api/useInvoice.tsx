import useAxiosPrivate from "../useAxiosPrivate";

export function useInvoice() {
  const axiosPrivate = useAxiosPrivate();

  async function uploadInvoice({
    files,
    institution,
  }: {
    files: File[];
    institution?: String;
  }): Promise<{ [key: string]: string } | null> {
    try {
      const response = await axiosPrivate.post(`/import/${institution}`, files);
      return await response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  return { uploadInvoice };
}
