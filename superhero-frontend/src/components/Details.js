import React from 'react';
import { useParams } from 'react-router-dom';

const Details = ({ superheroes }) => {
  const { id } = useParams();
  const character = superheroes.find((hero) => hero.id === parseInt(id));

  if (!character) {
    return <div>Character not found</div>;
  }

  return (
    <div>
      <h1>{character.name}</h1>
      <p><strong>Alias:</strong> {character.biography["full-name"]}</p>
      <p><strong>Powers:</strong> {character.powerstats.strength}, {character.powerstats.speed}</p>
      <p><strong>Biography:</strong> {character.biography["place-of-birth"]}</p>
      <img src={character.image.url} alt={character.name} />
    </div>
  );
};

export default Details;