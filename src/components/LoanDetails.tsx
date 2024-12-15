import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { useStore } from '../store/useStore';
    import { Loan, Payment } from '../types';
    import { differenceInMonths, format } from "date-fns";
    import { ArrowLeft } from 'lucide-react';

    export const LoanDetails: React.FC = () => {
			//some comment to check
      const { loanId } = useParams();
      const { loans } = useStore();
      const [loan, setLoan] = useState<Loan | undefined>(undefined);
      const navigate = useNavigate();

      useEffect(() => {
        if (loanId) {
          const foundLoan = loans.find((loan) => loan.id === loanId);
          setLoan(foundLoan);
        }
      }, [loanId, loans]);

      const handleGoBack = () => {
        navigate('/');
      };

      if (!loan) {
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-semibold">Loan not found</h2>
              <button
                onClick={handleGoBack}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        );
      }

      const totalPaid = loan?.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const monthsSinceStart = differenceInMonths(new Date(), new Date(loan?.startDate)) + 1;
      const monthlyInterestRate = loan?.interestRate / 100;
      const totalInterest = loan?.amount * monthlyInterestRate * monthsSinceStart;
      const totalWithInterest = loan?.amount + totalInterest;
      const remaining = totalWithInterest - totalPaid;
      const progress = (totalPaid / totalWithInterest) * 100;

      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl px-4 py-8 mx-auto">
            <div className="mb-8">
              <button
                onClick={handleGoBack}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
              </button>
            </div>
            <div className="p-6 space-y-6 bg-white shadow-lg rounded-xl">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Loan Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {loan?.description}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-green-600">
                      ${loan?.amount && loan?.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 transition-all bg-green-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Remaining</span>
                    <p className="font-semibold text-red-500">
                      ${remaining.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Interest Rate</span>
                    <p className="font-semibold">{loan?.interestRate}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Interest Generated</span>
                    <p className="font-semibold text-orange-500">
                      ${totalInterest.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total with Interest</span>
                    <p className="font-semibold">
                      ${totalWithInterest.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">
                      Start Date: {loan?.startDate && format(
                        new Date(loan?.startDate),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-6 border-t">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Payments
                </h3>
                {loan?.payments && loan?.payments.length > 0 ? (
                  <ul className="space-y-2">
                    {loan.payments.map((payment) => (
                      <li
                        key={payment.id}
                        className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md"
                      >
                        <span className="text-sm text-gray-700">
                          ${payment.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(payment.date), "MMM d, yyyy")}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    No payments have been made for this loan.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };
