import api from './api';

export const getCategory = () => {
    return api.get("/categories/getCategory");
}; 

export const getCategoryById = (id) => {
    return api.get(`/categories/getCategoryById/${id}`);
};

export const newCategory = (data) => {
    return api.post("/categories/newCategory", data);
};

export const deleteCategory = (id) => {
    return api.delete(`/categories/deleteCategory/${id}`)
}

export const updateCategory = (id, data) => {
    return api.put(`/categories/updateCategory/${id}`, data);
};