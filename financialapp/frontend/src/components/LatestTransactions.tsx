import { useState } from "react";
import Title from "./Title";

function LatestTransactions() {
  const [latestTransactions, setLatestTransactions] = useState([
    {
      description: "McDonalds",
      date: new Date(),
      type: "EXPENSE",
      value: 20.0,
    },
    {
      description: "Spotify",
      date: new Date(),
      type: "EXPENSE",
      value: 30.0,
    },
    {
      description: "Spotify",
      date: new Date(),
      type: "EXPENSE",
      value: 30.0,
    },
    {
      description: "Spotify",
      date: new Date(),
      type: "EXPENSE",
      value: 30.0,
    },
  ]);

  return (
    <div className="LatestTransactions mt-10 ml-20 md:ml-0">
      <Title text="Latest Transactions" />
      <input
        className="border w-full rounded-md h-8 px-4 mb-2"
        placeholder="Search"
        type="text"
      />
      {latestTransactions.map((l, i) => {
        return (
          <div className="text-left hover:bg-gray-300 p-3 rounded-md" key={i}>
            <div className="flex flex-row justify-between items-center">
              <div>
                <p>{l.description}</p>
                <span className="text-gray-500">{l.date.toLocaleString()}</span>
              </div>
              <div>
                <span>${l.value.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LatestTransactions;
