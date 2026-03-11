const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  { name: "Chemise Oxford No. 4",       type: "Chemise",    brand: "Verdant",       region: "France",     price: 145, collab: false, description: "Un coton oxford de premiere qualite au grammage genereux. La coupe s'inspire des archives des annees 1960, revisitee avec une aisance contemporaine." },
  { name: "Cravate Soie Vert Nuit",     type: "Cravate",    brand: "Leclaire",      region: "France",     price: 89,  collab: false, description: "Confectionnee a la main dans les ateliers historiques de Lyon. Le noeud glisse avec une facilite remarquable." },
  { name: "Veste Ceremony",             type: "Veste",      brand: "Moreau & Fils", region: "Italie",     price: 490, collab: false, description: "Construite sur une toile de lin interlignee, cette veste adopte une silhouette ajustee qui preserve sa structure au fil des heures." },
  { name: "Chemise Lin Blanc Brut",     type: "Chemise",    brand: "Archipel",      region: "Portugal",   price: 110, collab: false, description: "Le lin portugais, recolte et file dans la region de l'Alentejo, offre une texture legerement irreguliere qui constitue tout le caractere." },
  { name: "Pochette Argent Vol.1",      type: "Accessoire", brand: "Verdant",       region: "Japon",      price: 55,  collab: true,  description: "Piece de collection realisee en collaboration avec un artisan japonais specialise dans les broderies." },
  { name: "Chemise Popeline Noire",     type: "Chemise",    brand: "Verdant",       region: "France",     price: 130, collab: false, description: "La popeline egyptienne tissee en armure toile serre donne a cette chemise son tombant caracteristique." },
  { name: "Pantalon Flanelle Gris",     type: "Pantalon",   brand: "Moreau & Fils", region: "Angleterre", price: 210, collab: false, description: "Coupe en flanelle de laine peignee, ce pantalon incarne la tradition du tailleur britannique." },
  { name: "Cravate Rayee Bordeaux",     type: "Cravate",    brand: "Leclaire",      region: "Italie",     price: 75,  collab: false, description: "Les rayures sont tissees en biais selon la tradition anglaise, donnant une elegance discrète." },
  { name: "Chemise Madras x Archipel", type: "Chemise",    brand: "Archipel",      region: "Japon",      price: 175, collab: true,  description: "Edition limitee nee d'une rencontre entre l'artisanat madras et le sens du detail japonais." },
  { name: "Boutons de manchette Noirs", type: "Accessoire", brand: "Verdant",       region: "France",     price: 45,  collab: false, description: "Montures en resine noire mate serties a la main. Dimensions generales, pour les poignets forts." },
  { name: "Chemise Coton Sea Island",   type: "Chemise",    brand: "Moreau & Fils", region: "Angleterre", price: 225, collab: false, description: "Le coton Sea Island, parmi les plus fins au monde, confere a cette chemise un lustre et une douceur uniques." },
  { name: "Veste Tweed Ecossais",       type: "Veste",      brand: "Leclaire",      region: "Angleterre", price: 540, collab: false, description: "Tisse dans les Hebrides selon des methodes centenaires, ce tweed dense et robuste gagnera en caractere avec les annees." },
  { name: "Ceinture Cuir Naturel",      type: "Accessoire", brand: "Archipel",      region: "Portugal",   price: 95,  collab: false, description: "Cuir vachette tanne vegetalement pendant six mois, garni d'une boucle en laiton brut." },
  { name: "Chemise Denim Delave",       type: "Chemise",    brand: "Verdant",       region: "Japon",      price: 160, collab: false, description: "Denim selvedge japonais delave artisanalement. Chaque piece presente un vieillissement unique." },
  { name: "Pantalon Chino Ivoire",      type: "Pantalon",   brand: "Archipel",      region: "Portugal",   price: 185, collab: false, description: "Coton sergé de Porto, teint dans la masse en ivoire casse. Une base indispensable." },
  { name: "Pochette Soie x Moreau",     type: "Accessoire", brand: "Moreau & Fils", region: "Italie",     price: 65,  collab: true,  description: "Soierie de Côme imprimee en collaboration avec la maison Moreau. Tirage numerote a 50 exemplaires." },
];

async function main() {
  console.log('Seeding database...');
  await prisma.product.deleteMany();
  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`${products.length} produits inseres.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
