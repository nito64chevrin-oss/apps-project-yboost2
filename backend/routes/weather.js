const express = require('express');
const router = express.Router();

// GET meteo pour une ville (API externe : Open-Meteo, gratuite, sans cle)
// Utilisee pour suggerer des vetements selon la meteo
router.get('/:city', async (req, res) => {
  const cities = {
    paris:    { lat: 48.8566, lon: 2.3522 },
    lyon:     { lat: 45.7640, lon: 4.8357 },
    bordeaux: { lat: 44.8378, lon: -0.5792 },
    marseille:{ lat: 43.2965, lon: 5.3698 },
    london:   { lat: 51.5074, lon: -0.1278 },
    milan:    { lat: 45.4642, lon: 9.1900 },
  };

  const city = req.params.city.toLowerCase();
  const coords = cities[city];

  if (!coords) {
    return res.status(404).json({ error: `Ville '${req.params.city}' non supportee. Villes disponibles: ${Object.keys(cities).join(', ')}` });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weathercode&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`API Open-Meteo erreur: ${response.status}`);

    const data = await response.json();
    const temp = data.current.temperature_2m;
    const code = data.current.weathercode;

    // Suggestion de vetements selon la temperature
    let suggestion = '';
    if (temp < 5)       suggestion = "Tres froid — manteau lourd, echarpe, gants recommandes";
    else if (temp < 12) suggestion = "Froid — veste en laine ou tweed, couches multiples";
    else if (temp < 18) suggestion = "Frais — veste legere ou cardigan";
    else if (temp < 24) suggestion = "Agreable — chemise seule ou avec veste legere";
    else                suggestion = "Chaud — chemise en lin ou coton leger";

    res.json({
      city: req.params.city,
      temperature: temp,
      unit: 'C',
      weatherCode: code,
      suggestion,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Gestion d'erreur API externe
    if (error.name === 'FetchError' || error.cause?.code === 'ENOTFOUND') {
      return res.status(503).json({ error: 'Service meteo indisponible', details: 'Impossible de joindre Open-Meteo' });
    }
    res.status(500).json({ error: 'Erreur lors de la recuperation meteo', details: error.message });
  }
});

module.exports = router;
