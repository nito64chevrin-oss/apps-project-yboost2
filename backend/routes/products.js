const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const outfits = await prisma.outfit.findMany({ orderBy: { id: 'asc' } });
    // Renommer outfit_name en name pour le frontend
    const formatted = outfits.map(o => ({ ...o, name: o.outfit_name }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const outfit = await prisma.outfit.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!outfit) return res.status(404).json({ error: 'Produit introuvable' });
    res.json({ ...outfit, name: outfit.outfit_name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { outfit_name, type, brand, origine, price, collab, image, description, stock } = req.body;
    if (!outfit_name || !type || !brand || !origine || !price)
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    const outfit = await prisma.outfit.create({
      data: { outfit_name, type, brand, origine, price: parseFloat(price), collab: collab || false, image, description, stock: stock || 10 }
    });
    res.status(201).json(outfit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const outfit = await prisma.outfit.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(outfit);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Produit introuvable' });
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.outfit.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Produit supprime' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Produit introuvable' });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;