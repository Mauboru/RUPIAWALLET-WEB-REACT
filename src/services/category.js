import api from './api';

export const getCategory = () => {
    return api.get("/categories/getCategory");
};

export const newCategory = (data) => {
    return api.post("/categories/newCategory", data);
};