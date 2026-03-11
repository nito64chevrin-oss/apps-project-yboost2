const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET tous les produits (avec filtres optionnels)
router.get('/', async (req, res) => {
  try {
    const { type, region, brand, collab, maxPrice, search } = req.query;
    const where = {};
    if (type) where.type = type;
    if (region) where.region = region;
    if (brand) where.brand = brand;
    if (collab !== undefined) where.collab = collab === 'true';
    if (maxPrice) where.price = { lte: parseFloat(maxPrice) };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
      { region: { contains: search, mode: 'insensitive' } },
    ];
    const products = await prisma.product.findMany({ where, orderBy: { id: 'asc' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la recuperation des produits', details: error.message });
  }
});

// GET un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Produit introuvable' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// POST creer un produit
router.post('/', async (req, res) => {
  try {
    const { name, type, brand, region, price, collab, image, description, stock } = req.body;
    if (!name || !type || !brand || !region || !price) {
      return res.status(400).json({ error: 'Champs obligatoires manquants: name, type, brand, region, price' });
    }
    const product = await prisma.product.create({
      data: { name, type, brand, region, price: parseFloat(price), collab: collab || false, image, description, stock: stock || 10 }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la creation', details: error.message });
  }
});

// PUT modifier un produit
router.put('/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(product);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Produit introuvable' });
    res.status(500).json({ error: 'Erreur lors de la mise a jour', details: error.message });
  }
});

// DELETE supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Produit supprime avec succes' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Produit introuvable' });
    res.status(500).json({ error: 'Erreur lors de la suppression', details: error.message });
  }
});

module.exports = router;
