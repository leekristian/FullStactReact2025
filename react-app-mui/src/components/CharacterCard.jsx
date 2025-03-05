import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const CharacterCard = ({ character }) => {
    return (    
        <Card sx={{ maxWidth: 250, maxHeight: 430 }}>
        <CardMedia
          component="img"
          height="200"
          image={character.image} 
          alt={character.name} 
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {character.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <ul>
                <li>ID: {character.id}</li>
                <li>Status: {character.status}</li>
                <li>Species: {character.species}</li>
                <li>{character.gender}</li>
                <li>{character.origin.name}</li>
                <li>Last Location: {character.location.name}</li>
            </ul>
        
          </Typography>
        </CardContent>
        </Card>

        // <div>
        //     <img src={character.image} alt={character.name} />
        //     <h2>{character.name}</h2>
        //     <p>ID: {character.id}</p>
        //     <p>Status: {character.status}</p>
        //     <p>Species: {character.species}</p>
        //     <p>Gender: {character.gender}</p>
        //     <p>Created: {new Date(character.created).toLocaleDateString()}</p>
        //     <p>Origin: {character.origin.name}</p>
        //     <p>Last Location: {character.location.name}</p>
        // </div>
      );
};
    
export default CharacterCard;