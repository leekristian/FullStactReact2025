import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Filter from "./components/Filter";
import { fetchCharacters } from "./redux/dataSlice";
import CharacterCard from "./components/CharacterCard";

import './assets/app.css';
import Grid from '@mui/joy/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const App = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('asc');
  const characters = useSelector((state) => state.data.characters.results);
  const isLoading = useSelector((state) => state.data.isLoading);
  const error = useSelector((state) => state.data.error);
  const filters = useSelector((state) => state.data.filters);

  useEffect(() => {
    dispatch(fetchCharacters());
  },[dispatch]);

  const filteredCharacters = characters ? characters.filter((character) => {
    return (
      (filters.Species.length === 0 || filters.Species.includes(character.species)) &&
      (filters.Gender.length === 0 || filters.Gender.includes(character.gender)) &&
      (filters.Origin.length === 0 || filters.Origin.includes(character.origin.name)) &&
      (query === '' || character.name.toLowerCase().includes(query.toLowerCase()))
    );
  }) : [];

  const sortedCharacters = filteredCharacters.sort((a, b) => {
      if (sort === 'asc') {
         return a.id - b.id;
       } else {
         return b.id - a.id;
       }
  });

  return (
    <div className="App">
      <p>Rick and Morty Api</p>
      {/* sort section */}
      <Grid container spacing={2}>
        {/* Search Bar */}
        <Grid item xs={12}>
          <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField 
                id="outlined-basic" 
                label="Search" 
                variant="outlined" 
                value={query}             
                onChange={e => setQuery(e.target.value)}  e                
                />
          </Box>
          Sort By:
          <br />
          <select name="sort" id="sort" onChange={e => setSort(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>        
        </Grid>

        {/* Filter Column */}
        <Grid item xs={3}>
          <Filter/>
        </Grid>

        {/* Product List Column */}
        <Grid item xs={9}>
          
          {/* character list section */}
          <Grid container spacing={2} columns={16} sx={{ flexGrow: 1 }} display="flex" justifyContent="center" alignItems="center">
            {isLoading && <p>Loading data...</p>}
            {error && <p>Error: {error}</p>}
            {/* Check if characters is defined and is an array before mapping */}
            {sortedCharacters && Array.isArray(sortedCharacters) ? (
                sortedCharacters.map((character) => (
                  <Grid size={8}>
                    <CharacterCard key={character.id} character={character} />
                    </Grid>
                ))
              ) : (
                <p>Loading or no data available...</p>
              )}
          </Grid>


        </Grid>
          
      </Grid>
    </div>
  )
}

export default App
