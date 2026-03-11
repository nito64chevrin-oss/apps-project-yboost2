const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const outfits = [
  { outfit_name: "Chemise Oxford No. 4",       type: "Chemise",    brand: "Verdant",       origine: "France",     price: 145, collab: false },
  { outfit_name: "Cravate Soie Vert Nuit",     type: "Cravate",    brand: "Leclaire",      origine: "France",     price: 89,  collab: false },
  { outfit_name: "Veste Ceremony",             type: "Veste",      brand: "Moreau & Fils", origine: "Italie",     price: 490, collab: false },
  { outfit_name: "Chemise Lin Blanc Brut",     type: "Chemise",    brand: "Archipel",      origine: "Portugal",   price: 110, collab: false },
  { outfit_name: "Pochette Argent Vol.1",      type: "Accessoire", brand: "Verdant",       origine: "Japon",      price: 55,  collab: true  },
  { outfit_name: "Chemise Popeline Noire",     type: "Chemise",    brand: "Verdant",       origine: "France",     price: 130, collab: false },
  { outfit_name: "Pantalon Flanelle Gris",     type: "Pantalon",   brand: "Moreau & Fils", origine: "Angleterre", price: 210, collab: false },
  { outfit_name: "Cravate Rayee Bordeaux",     type: "Cravate",    brand: "Leclaire",      origine: "Italie",     price: 75,  collab: false },
  { outfit_name: "Chemise Madras x Archipel", type: "Chemise",    brand: "Archipel",      origine: "Japon",      price: 175, collab: true  },
  { outfit_name: "Boutons de manchette Noirs", type: "Accessoire", brand: "Verdant",       origine: "France",     price: 45,  collab: false },
  { outfit_name: "Chemise Coton Sea Island",   type: "Chemise",    brand: "Moreau & Fils", origine: "Angleterre", price: 225, collab: false },
  { outfit_name: "Veste Tweed Ecossais",       type: "Veste",      brand: "Leclaire",      origine: "Angleterre", price: 540, collab: false },
  { outfit_name: "Ceinture Cuir Naturel",      type: "Accessoire", brand: "Archipel",      origine: "Portugal",   price: 95,  collab: false },
  { outfit_name: "Chemise Denim Delave",       type: "Chemise",    brand: "Verdant",       origine: "Japon",      price: 160, collab: false },
  { outfit_name: "Pantalon Chino Ivoire",      type: "Pantalon",   brand: "Archipel",      origine: "Portugal",   price: 185, collab: false },
  { outfit_name: "Pochette Soie x Moreau",     type: "Accessoire", brand: "Moreau & Fils", origine: "Italie",     price: 65,  collab: true  },
];

async function main() {
  console.log('Seeding...');
  await prisma.outfit.deleteMany();
  for (const o of outfits) {
    await prisma.outfit.create({ data: o });
  }
  console.log(`${outfits.length} produits inseres.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());