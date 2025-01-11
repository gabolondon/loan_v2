import React from "react";
import { LoanList } from "./LoanList";

export const Home: React.FC = () => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">
        Welcome to the Loan Manager
      </h2>
      <LoanList />
    </div>
  );
};
