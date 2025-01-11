import React from "react";
import { LoanList } from "./LoanList";
import { useStore } from "../store/useStore";
import { UserManagement } from "./UserManagement";

export const Home: React.FC = () => {
  const { user } = useStore();
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">
        Welcome to the Loan Manager
      </h2>
      <LoanList />
      {user?.isAdmin && <UserManagement />}
    </div>
  );
};
