import { useState } from "react";
import { Transaction, TypeOption } from "../models/Transaction";
import Title from "./Title";
import dateService from "../api/services/DateService";

const MAX_ROWS = 5;
interface Props {
  data: Transaction[] | null;
  isSideNavOpen: boolean;
}

function LatestTransactions(props: Props) {
  return (
    <div className="LatestTransactions md:ml-0">
      <Title text="Latest Transactions" />
      <input
        className="w-full bg-black-500 rounded-md h-8 px-5 py-5 text-white mb-2 text-sm"
        placeholder="Search"
        type="text"
      />
      {props.data && props.data.length > 0 ? (
        <table className="table-auto divide-y divide-gray-300 w-full text-left text-sm mt-5">
          <thead className="">
            <tr className="text-gray-200 bg-gray-300">
              <th className="text-sm font-normal w-52 p-2">Name</th>
              <th className="text-sm font-normal w-52 hidden sm:block py-2">Date</th>
              <th className="text-sm font-normal w-52 py-2">Type</th>
              <th className="text-sm font-normal w-52 py-2">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {props.data &&
              props.data.slice(0, MAX_ROWS).map((l, i) => {
                return (
                  <tr
                    key={i}
                    className="hover:bg-gray-300 cursor-pointer border-none text-gray-100"
                  >
                    <td className="p-2 py-5">{l.title}</td>
                    <td className="text-gray-400 hidden sm:block py-5">
                      {dateService.formatDateValue(l.date.toLocaleString())}
                    </td>
                    <td className="text-gray-50">
                      <span
                        className={`py-2 px-3 rounded-md font-medium text-xs ${
                          l.type === TypeOption.EXPENSE
                            ? `bg-red-100 text-red-400 `
                            : l.type === TypeOption.TRANSFER
                            ? `bg-purple-100 text-purple-400`
                            : `bg-green-100 text-green-400`
                        }`}
                      >
                        {l.type}
                      </span>
                    </td>
                    <td>
                      {Number(l.value).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 text-sm my-5">No data found</p>
      )}
    </div>
  );
}

export default LatestTransactions;
