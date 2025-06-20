import api from './api';

export const newTransaction = (data) => {
    return api.post("/transactions/newTransaction", data);
};