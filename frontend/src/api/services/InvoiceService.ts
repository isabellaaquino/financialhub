import { api } from "./Api";

class InvoiceService {
  async sendPDFFile({
    accessToken,
    files,
    institution,
  }: {
    accessToken: string;
    files: FileList;
    institution?: String;
  }): Promise<{ [key: string]: string } | null> {
    try {
      const response = await api.post(`/import/${institution}`, files, {
        headers: {
          "Content-Type": "application/pdf",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return await response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
}

const invoiceService = new InvoiceService();
export default invoiceService;
