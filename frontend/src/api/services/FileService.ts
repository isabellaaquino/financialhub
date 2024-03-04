import { api } from "./api";

class FileService {
  async sendPDFFile(
    accessToken: string,
    file: File,
    institution?: String
  ): Promise<{ [key: string]: string } | null> {
    try {
      const blob = new Blob([file], { type: file.type });
      const response = await api.post(`/import/${institution}`, blob, {
        headers: {
          "Content-Type": blob.type,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return await response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }
}

const fileService = new FileService();
export default fileService;
