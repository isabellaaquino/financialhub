import { WarningAmberRounded } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
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
import { useTransactions } from "../hooks/api/useTransactions";
import { Transaction, typeOptionColor } from "../models/Transaction";

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
    {
      field: "title",
      headerName: "Name",
      width: 300,
    },
    {
      field: "label",
      headerName: "Label",
      width: 300,
      renderCell: (params) => {
        return (
          params.value && (
            <Chip
              label={params.value.name}
              variant="outlined"
              style={{ borderColor: params.value.color }}
            />
          )
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 300,
      renderCell: (params) => {
        const { bgColor, color } = typeOptionColor(params.value);
        return (
          params.value && (
            <Chip
              label={params.value}
              style={{ color, backgroundColor: bgColor }}
            />
          )
        );
      },
    },
    {
      field: "value",
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
      field: "date",
      headerName: "Date",
      width: 200,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
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
    {
      field: "imported",
      headerName: "",
      width: 100,
      renderCell: (params) => {
        return (
          params.value && (
            <Tooltip title="This transaction was imported. Please finish filling out the remaining fields.">
              <WarningAmberRounded color="warning" />
            </Tooltip>
          )
        );
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
          title: item.title,
          label: item.label || "",
          type: item.type,
          value: item.value,
          date: new Date(item.date).toLocaleDateString(),
          imported: item.imported || false,
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
