import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LoanCard } from './LoanCard';
import { Loan } from '../types';
import { Modal } from './Modal';

export const LoanList: React.FC = () => {
  const { user, loans, addLoan, requestLoan, fetchLoans, fetchLoansByUser } =
    useStore();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'request'>('add');

  useEffect(() => {
    if (user && !user?.isAdmin) {
      fetchLoansByUser(user.uid);
    } else if (user) {
      fetchLoans();
    }
  }, [user, fetchLoansByUser, fetchLoans]);

  const handleAddLoan = (data: any) => {
    if (!user?.isAdmin) return;

    const loan: Loan = {
      id: crypto.randomUUID(),
      description: data.description,
      amount: parseFloat(data.amount),
      interestRate: parseFloat(data.interestRate),
      assignedTo: data.assignedTo,
      startDate: new Date().toISOString(),
      payments: [],
      status: 'approved',
    };
    addLoan(loan);
  };

  const handleRequestLoan = (data: any) => {
    if (!user?.email) return;

    requestLoan({
      description: data.description,
      amount: parseFloat(data.amount),
      interestRate: parseFloat(data.interestRate),
      assignedTo: user.email,
      startDate: new Date().toISOString(),
    });
  };

  const openModal = (type: 'add' | 'request') => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
        </div>
        <div className="flex gap-4">
          {user?.isAdmin ? (
            <button
              onClick={() => openModal('add')}
              className="flex items-center px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              New Loan
            </button>
          ) : (
            <button
              onClick={() => openModal('request')}
              className="flex items-center px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              Request Loan
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={modalType === 'add' ? handleAddLoan : handleRequestLoan}
        title={modalType === 'add' ? 'Add New Loan' : 'Request New Loan'}
      >
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Loan Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="1"
            step="0.01"
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="interestRate"
            className="block text-sm font-medium text-gray-700"
          >
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interestRate"
            name="interestRate"
            min="0.1"
            step="0.1"
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {user?.isAdmin && (
          <div>
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium text-gray-700"
            >
              Assigned To (Email)
            </label>
            <input
              type="email"
              id="assignedTo"
              name="assignedTo"
              required
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </Modal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>
    </div>
  );
};
