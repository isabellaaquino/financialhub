function QuickAccess() {
  return (
    <div className="QuickCards flex flex-row mt-10 overflow-x-scroll w-full text-md">
      <div className="border h-20 flex flex-row justify-between p-3 mr-3 items-center rounded-md shadow-md">
        <h3 className="text-left mr-10">My Wallet</h3>
        <span className="material-symbols-rounded">wallet</span>
      </div>
      <div className="border w-48 h-20 flex flex-row justify-between p-3 mr-3 items-center rounded-md shadow-md">
        <h3 className="text-left mr-10">My Dashboard</h3>
        <span className="material-symbols-rounded">wallet</span>
      </div>
      <div className="border w-48 h-20 flex flex-row justify-between p-3 mr-3 items-center rounded-md shadow-md">
        <h3 className="text-left mr-10">Import Expense</h3>
        <span className="material-symbols-rounded">wallet</span>
      </div>
    </div>
  );
}

export default QuickAccess;
