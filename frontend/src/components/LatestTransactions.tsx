import { Chip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Transaction, typeOptionColor } from "../models/Transaction";

const MAX_ROWS = 10;

interface Props {
  data: Transaction[] | null;
  headOnly: boolean;
}

function LatestTransactions(props: Props) {
  const columns: GridColDef[] = [
    { field: "col1", headerName: "Name", width: 300 },
    { field: "col2", headerName: "Label", width: 300 },
    {
      field: "col3",
      headerName: "Type",
      width: 300,
      renderCell: (params) => {
        const { bgColor, color } = typeOptionColor(params.value);
        return (
          <Chip
            label={params.value}
            style={{ color, backgroundColor: bgColor }}
          />
        );
      },
    },
    {
      field: "col4",
      headerName: "Value",
      width: 300,
      valueFormatter: (params: GridValueFormatterParams) => {
        return parseInt(params.value.toString()).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      field: "col5",
      headerName: "Date",
      width: 300,
    },
  ];

  function transformData(data: Transaction[] | null): GridRowsProp | [] {
    return data
      ? data.map((item) => ({
          id: item.id,
          col1: item.title,
          col2: item.label || "",
          col3: item.type,
          col4: item.value,
          col5: new Date(item.date).toLocaleDateString(),
        }))
      : [];
  }

  return (
    <>
      <DataGrid
        rows={
          props.headOnly
            ? transformData(props.data).slice(0, MAX_ROWS)
            : transformData(props.data)
        }
        columns={columns}
        hideFooter={props.headOnly}
        autoHeight
      />
    </>
  );
}

export default LatestTransactions;
