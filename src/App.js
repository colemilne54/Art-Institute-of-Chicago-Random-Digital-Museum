import React from 'react';
import { useState } from 'react';
import {
  Button,
  Card,
  Typography,
  CardMedia,
  CardContent,
  Grid,
} from '@mui/material';
import './style.css';

export default function App() {
  const [art, setArt] = useState([]);

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
        setArt(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  function ArtCard() {
    console.log(
      `https://www.artic.edu/iiif/2/${art.data[0].image_id}/full/843,/0/default.jpg`
    );
    return (
      <Card sx={{ mb: '50px' }}>
        <CardMedia
          sx={{ minHeight: 250 }}
          image={`https://www.artic.edu/iiif/2/${art.data[0].image_id}/full/843,/0/default.jpg`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {`Title: ${art.data[0].title}`}
          </Typography>
          <Typography gutterBottom variant="body2" component="text.secondary">
            {`Artsist: ${art.data[0].artist_display}`}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <h1>Art Institute of Chicago Random Digital Museum</h1>
      {art.length !== 0 && <ArtCard />}
      <form onSubmit={handleSubmit}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: 5 }}
        >
          Submit
        </Button>
      </form>
    </Grid>
  );
}
