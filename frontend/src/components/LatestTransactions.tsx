import { useState } from "react";
import { Transaction } from "../models/Transaction";
import Title from "./Title";

const MAX_ROWS = 5;
interface Props {
  data: Transaction[];
}
function LatestTransactions(props: Props) {
  return (
    <div className="LatestTransactions ml-20 mt-10 md:ml-0">
      <Title text="Latest Transactions" />
      <input
        className="border w-full rounded-md h-8 px-4 mb-2 text-sm"
        placeholder="Search"
        type="text"
      />
      {props.data.slice(0, MAX_ROWS).map((l, i) => {
        return (
          <div className="text-left hover:bg-gray-300 py-3 rounded-md" key={i}>
            <div className="flex flex-row justify-between items-center text-sm">
              <div>
                <p>{l.title}</p>
                <span className="text-gray-500">{l.date.toLocaleString()}</span>
              </div>
              <div>
                <span>${Number(l.value).toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LatestTransactions;
