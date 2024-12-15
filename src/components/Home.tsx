import React from 'react';
    import { LoanList } from './LoanList';

    export const Home: React.FC = () => {
      return (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Welcome to the Loan Manager</h2>
          <LoanList />
        </div>
      );
    };
