import React from 'react';
import { useState } from 'react';
import {
  Button,
  Card,
  CardActionArea,
  Typography,
  CardMedia,
  CardContent,
} from '@mui/material';
import './style.css';

export default function App() {
  const [art, getArt] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let timeStamp = Math.floor(Date.now() / 1000);
    let artworkRequest = {
      resources: 'artworks',
      fields: [
        'id',
        'title',
        'artist_display',
        'image_id',
        'date_display',
        'medium_display',
      ],
      boost: false,
      limit: 1,
      query: {
        function_score: {
          query: {
            constant_score: {
              filter: {
                exists: {
                  field: 'image_id',
                },
              },
            },
          },
          boost_mode: 'replace',
          random_score: {
            field: 'id',
            seed: timeStamp,
          },
        },
      },
    };
    fetch('https://api.artic.edu/api/v1/search', {
      method: 'POST',
      body: JSON.stringify(artworkRequest),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getArt(data);
        // console.log(art.data[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  function ArtCard() {
    // if (art.data[0]) {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            image={`https://www.artic.edu/iiif/2/' + ${art.data[0].image_id} + '/full/843,/0/default.jpg`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
    // }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: 15 }}
        >
          Submit
        </Button>
      </form>
      {art && <ArtCard />}
    </div>
  );
}
