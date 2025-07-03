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

export const getTransactionById = (id) => {
    return api.get(`/transactions/getTransactionById/${id}`);
};

export const updateTransaction = (id, data) => {
    return api.put(`/transactions/updateTransaction/${id}`, data);
};

export const deleteTransaction = (id) => {
    return api.delete(`/transactions/deleteTransaction/${id}`)
}