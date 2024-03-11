import { TypeOption } from "../../enums/Enums";
import useAxiosPrivate from "../useAxiosPrivate";

export function useInvoice() {
  const axiosPrivate = useAxiosPrivate();

  async function uploadInvoices({
    invoices,
    institution,
    type,
    updateWallet,
  }: {
    invoices: FileList;
    institution?: String;
    type?: TypeOption;
    updateWallet?: boolean;
  }): Promise<{ [key: string]: string } | null> {
    try {
      let endpoint = `/import/?institution=${institution}`;
      if (type) endpoint += `&type=${type}`;
      if (updateWallet) endpoint += `&updateWallet=${updateWallet ? 1 : 0}`;
      const response = await axiosPrivate.post(endpoint, invoices);

      console.log(response);

      return await response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  return { uploadInvoices };
}
