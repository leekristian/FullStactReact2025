// const API_BASE_URL = "https://rickandmortyapi.com/api";

// const api = axios.create({
//     baseURL: API_BASE_URL
// });

// export const getCharacters = async () => {
//     try {
//         const response = await api.get("/character");
//         return response;
//     } catch (error) {
//         return error;
//     }
// };

const api = () => {};

export const getFilterCategories = () => {
    
    const categories = {
        Species: ['Human','Alien'],
        Gender: ['Male','Female'],
        Origin: ['unknown','Earth (C-137)','Abadango','Earth (Replacement Dimension)']
    }
    return categories;
}

export default api;