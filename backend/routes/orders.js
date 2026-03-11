const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET toutes les commandes
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// GET une commande
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: { include: { product: true } } }
    });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// POST creer une commande
router.post('/', async (req, res) => {
  try {
    const { email, items } = req.body;
    if (!email || !items || !items.length) {
      return res.status(400).json({ error: 'Email et articles requis' });
    }

    // Verifier les produits et calculer le total
    let total = 0;
    const resolvedItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(404).json({ error: `Produit ${item.productId} introuvable` });
      total += product.price * (item.quantity || 1);
      resolvedItems.push({ productId: product.id, quantity: item.quantity || 1, price: product.price });
    }

    const order = await prisma.order.create({
      data: { email, total, items: { create: resolvedItems } },
      include: { items: { include: { product: true } } }
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la commande', details: error.message });
  }
});

// PUT mettre a jour le statut
router.put('/:id', async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status }
    });
    res.json(order);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Commande introuvable' });
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// DELETE supprimer une commande
router.delete('/:id', async (req, res) => {
  try {
    await prisma.orderItem.deleteMany({ where: { orderId: parseInt(req.params.id) } });
    await prisma.order.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Commande supprimee' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Commande introuvable' });
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

module.exports = router;
