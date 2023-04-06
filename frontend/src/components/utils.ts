import { TypeOptionType } from "../models/Transaction";

export function capitalizeType(type: TypeOptionType) {
    const typeStr = type.toString().toLowerCase();
    return typeStr.charAt(0).toUpperCase() + typeStr.slice(1) as TypeOptionType;
  }