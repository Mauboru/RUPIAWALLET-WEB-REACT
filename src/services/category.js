import api from './api';

export const getCategory = () => {
    return api.get("/categories/getCategory");
};