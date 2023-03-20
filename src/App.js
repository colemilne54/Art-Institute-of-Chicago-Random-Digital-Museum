import React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
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
      })
      .catch((err) => {
        console.log(err.message);
        console.log(ageUrl);
      });
  };

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
    </div>
  );
}
