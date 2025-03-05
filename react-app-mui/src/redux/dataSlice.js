import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "https://rickandmortyapi.com/api";

const api = axios.create({
    baseURL: API_BASE_URL
});

export const fetchCharacters = createAsyncThunk('data/fetchCharacters', async () => {
    try {
        const response = await api.get('/character');
        return response.data;
    } catch (error) {
        return error.message;
    }
});

const initialState = {
    characters: [],
    isLoading: false,
    error: null,
    filters: { Species: [], Gender: [], Origin: [] }
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        updateFilter: (state, action) => {   
            state.filters = action.payload;
        },
        resetFilter: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCharacters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCharacters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.characters = action.payload;              
            })
            .addCase(fetchCharacters.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { updateFilter, resetFilter } = dataSlice.actions;
export default dataSlice.reducer;