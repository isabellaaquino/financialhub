import { Chip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridDeleteIcon,
  GridRowId,
  GridRowsProp,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { Transaction, typeOptionColor } from "../models/Transaction";
import { useTransactions } from "../hooks/api/useTransactions";

const MAX_ROWS = 10;

interface Props {
  data: Transaction[] | null;
  headOnly: boolean;
}

function LatestTransactions(props: Props) {
  const queryClient = useQueryClient();
  const { deleteTransaction } = useTransactions();
  const { enqueueSnackbar } = useSnackbar();

  const columns: GridColDef[] = [
    { field: "col1", headerName: "Name", width: 300 },
    {
      field: "col2",
      headerName: "Label",
      width: 300,
      renderCell: (params) => {
        return (
          <Chip
            label={params.value.name}
            variant="outlined"
            style={{ borderColor: params.value.color }}
          />
        );
      },
    },
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
        return parseFloat(params.value).toLocaleString("pt-BR", {
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
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<GridDeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteTransaction(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const { mutateAsync } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });
      enqueueSnackbar("Transaction deleted successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar("No server response", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
  });

  const [rows, setRows] = React.useState(props.data);

  async function handleDeleteTransaction(id: GridRowId) {
    // TODO: Add are you sure alert
    await mutateAsync({
      transactionId: Number(id),
    });
    setRows(
      rows &&
        rows.filter((row) => {
          row.id !== id;
        })
    );
  }

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
