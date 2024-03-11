import { z } from "zod";
import { TypeOption } from "../enums/Enums";
import { BankInstitutions } from "../models/Invoices";

const MAX_FILE_SIZE = 300000;
const ACCEPTED_DOC_TYPES = ["application/pdf"];

export const newInvoiceImportSchema = z
  .object({
    invoices: z
      .instanceof(FileList)
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`
      )
      .refine(
        (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
        "Only .PDF files are accepted."
      ),
    institution: z
      .nativeEnum(BankInstitutions)
      .default(BankInstitutions.SANTANDER),
    // global optional attributes
    type: z.nativeEnum(TypeOption).optional(),
    updateWallet: z.boolean().optional(),
  })
  .refine((data) => {
    // Check if updateWallet is true and type is not set
    if (data.updateWallet === true && data.type === undefined) {
      throw new Error("type is required when updateWallet is true");
    }

    // All other cases are valid
    return true;
  });

export type NewInvoiceImportFormData = z.infer<typeof newInvoiceImportSchema>;
