# Maison Verdant

Site e-commerce de vetements de qualite. Derriere la facade se cache quelque chose de plus.

## Stack technique

- **Frontend** : HTML / CSS / JS vanilla
- **Backend** : Node.js + Express
- **ORM** : Prisma
- **Base de donnees** : PostgreSQL via Supabase
- **Deploiement** : Render (app) + Supabase (BDD)
- **API externe** : Open-Meteo (meteo en temps reel, sans cle)

---

## Lancer le projet en local

### Prerequis
- Node.js v18+
- Un projet Supabase cree (gratuit sur supabase.com)

### Installation

```bash
cd backend
npm install
```

### Configuration

```bash
cp .env.example .env
# Editer .env et remplir DATABASE_URL avec votre URL Supabase
```

### Base de donnees

```bash
npm run db:push    # Creer les tables
npm run db:seed    # Inserer les produits de demo
```

### Demarrer

```bash
npm run dev        # Mode developpement (nodemon)
npm start          # Mode production
```

Le site est accessible sur `http://localhost:3000`

---

## Routes API

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Etat de la connexion a la base de donnees |
| GET | `/api/products` | Liste tous les produits |
| GET | `/api/products?type=Chemise&region=France&maxPrice=200` | Filtrer les produits |
| GET | `/api/products/:id` | Recuperer un produit par ID |
| POST | `/api/products` | Creer un produit |
| PUT | `/api/products/:id` | Modifier un produit |
| DELETE | `/api/products/:id` | Supprimer un produit |
| GET | `/api/orders` | Liste toutes les commandes |
| GET | `/api/orders/:id` | Recuperer une commande |
| POST | `/api/orders` | Creer une commande |
| PUT | `/api/orders/:id` | Mettre a jour le statut d'une commande |
| DELETE | `/api/orders/:id` | Supprimer une commande |
| GET | `/api/weather/:city` | Meteo + suggestion vestimentaire |

### Exemples de requetes

```bash
# Healthcheck BDD
curl http://localhost:3000/api/health

# Tous les produits
curl http://localhost:3000/api/products

# Filtrer par type et prix max
curl "http://localhost:3000/api/products?type=Chemise&maxPrice=150"

# Meteo Paris
curl http://localhost:3000/api/weather/paris

# Creer un produit
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Chemise Test","type":"Chemise","brand":"Test","region":"France","price":99}'
```

---

## Variables d'environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DATABASE_URL` | URL de connexion PostgreSQL Supabase | Oui |
| `PORT` | Port du serveur (defaut: 3000) | Non |
| `NODE_ENV` | Environnement (development/production) | Non |

---

## Deploiement sur Render

1. Creer un nouveau **Web Service** sur render.com
2. Connecter le repo GitHub
3. Parametres :
   - **Root Directory** : `backend`
   - **Build Command** : `npm install && npx prisma generate`
   - **Start Command** : `npm start`
4. Ajouter la variable `DATABASE_URL` dans les variables d'environnement Render

---

## Structure du projet

```
maison-verdant/
├── public/
│   ├── index.html        # Page principale (catalogue)
│   ├── product.html      # Page article
│   └── images/           # Vos images produits ici
├── backend/
│   ├── server.js         # Point d'entree Express
│   ├── routes/
│   │   ├── products.js   # CRUD produits
│   │   ├── orders.js     # CRUD commandes
│   │   └── weather.js    # API meteo externe
│   ├── prisma/
│   │   ├── schema.prisma # Schema BDD
│   │   └── seed.js       # Donnees initiales
│   ├── .env.example      # Modele de variables d'environnement
│   └── package.json
└── README.md
```
