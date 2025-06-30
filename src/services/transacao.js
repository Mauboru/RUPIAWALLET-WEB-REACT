import api from './api';

export const newTransaction = (data) => {
    return api.post("/transactions/newTransaction", data);
};

export const getTransactions = (data) => {
    return api.get("/transactions/getTransactions");
};

export const getTransactionsByMonth = (month) => {
    return api.get(`/transactions/getTransactionsByMonth/${month}`);
};