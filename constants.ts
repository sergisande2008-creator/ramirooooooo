import { MenuCategory, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // ENTRANTES
  {
    id: 'e1',
    name: 'Jamón Ibérico de Bellota',
    description: 'Ración de jamón 100% ibérico de bellota cortado a cuchillo, servido con picos artesanos.',
    price: 26.00,
    category: MenuCategory.STARTERS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1541FQL2AE_ba8vaGn6oR45sbEb2PETZkc9YaUlDVbgRYdFDtTN0n_cTYNnS6OPFU6_1FMdddLkVuKkn8kbp5MuAiKmoTzu7KqzwIP97EQw&s=10',
    allergens: ['gluten']
  },
  {
    id: 'e2',
    name: 'Croquetas Caseras',
    description: '8 unidades. Cremosas de jamón ibérico y boletus, fritas al momento.',
    price: 12.50,
    category: MenuCategory.STARTERS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxwf5If-mobXRg1hlKhhPJYOLYfp12Yeg3tNJ6VjpsLLGDtCrAY3YazMos2HWJkGnXZiwBdsTKl8kGxGjQHN9j7D8HMg69H9HTgGwrGSj1&s=10',
    allergens: ['gluten', 'lactosa', 'huevo']
  },
  {
    id: 'e3',
    name: 'Patatas Bravas',
    description: 'Patatas cortadas a mano con nuestra salsa brava picante secreta y un toque de alioli.',
    price: 9.00,
    category: MenuCategory.STARTERS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuls-ey6_hf0ZPx_e-ilT5Z6otxIrLNjALVt5mqKrAeKn34gmwRSkMsEtZU5ueXExM1Lddb1jjhorx8SdYbfqmrTih5XsotD1mqN4vM8eu&s=10',
    allergens: ['huevo']
  },
  {
    id: 'e4',
    name: 'Pulpo a la Gallega',
    description: 'Pulpo cocido sobre cama de patatas, pimentón de la Vera y aceite de oliva virgen extra.',
    price: 22.00,
    category: MenuCategory.STARTERS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI5bpsA4vXjXYQBEs_hJd6oqrXVWg3diojDL2DNyEyZ4hGYOgvxIVxRcAduKy7cqBMP0ifj8c9mCCl0gEvrIgBfXVtiIRhLxXUblSi3oXK&s=10',
    allergens: ['pescado', 'marisco']
  },
  {
    id: 'e5',
    name: 'Gambas al Ajillo',
    description: 'Gambas frescas salteadas en cazuela de barro con ajo, guindilla y perejil.',
    price: 16.50,
    category: MenuCategory.STARTERS,
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
    allergens: ['marisco']
  },

  // PRIMEROS
  {
    id: 'p1',
    name: 'Gazpacho Andaluz',
    description: 'Sopa fría tradicional de tomate, pepino y pimiento, con guarnición de picadillo.',
    price: 9.50,
    category: MenuCategory.MAINS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK_F-kFQqwEGxMhg93gac6FzDE_mzK3oF6uHyscNOqQqZi0lxcxCr8zR1IQFMCblpVdnCfm9NoHequhRShkFDYsM4DyqlnjTss4E_URvU1aQ&s=10',
    allergens: ['gluten']
  },
  {
    id: 'p2',
    name: 'Salmorejo Cordobés',
    description: 'Crema fría de tomate y pan, terminada con virutas de jamón y huevo duro.',
    price: 10.00,
    category: MenuCategory.MAINS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStpQU9RuEH3_yGq1XsgGOWSpmU-YWqwyGaXqhKDt3lPAsR0T5ciiMuX9cqLzRk1Ih_yuQM3EryXokxYtVF15Fej5FB1mgHJBKk24CKsCSu&s=10',
    allergens: ['gluten', 'huevo']
  },
  {
    id: 'p3',
    name: 'Paella Valenciana',
    description: 'Arroz con pollo, conejo, judía verde y garrofón. (Precio por ración individual).',
    price: 18.00,
    category: MenuCategory.MAINS,
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80',
    allergens: []
  },
  {
    id: 'p4',
    name: 'Ensalada de la Casa',
    description: 'Mezclum de lechugas, tomate rosa, ventresca de atún, cebolla morada y aceitunas.',
    price: 11.50,
    category: MenuCategory.MAINS,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    allergens: ['pescado']
  },

  // SEGUNDOS
  {
    id: 's1',
    name: 'Entrecot de Ternera',
    description: '350g de lomo bajo a la parrilla, servido con pimientos del padrón y patatas fritas.',
    price: 24.50,
    category: MenuCategory.SECONDS,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
    allergens: []
  },
  {
    id: 's2',
    name: 'Merluza a la Vasca',
    description: 'Lomo de merluza fresca en salsa verde con almejas, gambas y espárragos.',
    price: 21.00,
    category: MenuCategory.SECONDS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJlfSYA28twL0ngwj1tbzqikfum8v6crmG-CVbdgwlVYku0_ZsRHiJ8BO65GWSubqbpeyX2xrhbV2T45U7BstFdoGJeZ_NpFDPdBDT8Vz&s=10',
    allergens: ['pescado', 'marisco']
  },
  {
    id: 's3',
    name: 'Solomillo al Whisky',
    description: 'Medallones de solomillo de cerdo ibérico en su tradicional salsa al whisky.',
    price: 18.50,
    category: MenuCategory.SECONDS,
    image: 'https://img.juanideanasevilla.com/archivos/recetas/def4bade8f97e9ba272a4acd57a6cff0e2a2bc28.jpg',
    allergens: ['sulfitos']
  },
  {
    id: 's4',
    name: 'Chuletillas de Cordero',
    description: 'Chuletillas de cordero lechal a la brasa con patatas a lo pobre.',
    price: 23.00,
    category: MenuCategory.SECONDS,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    allergens: []
  },

  // POSTRES
  {
    id: 'po1',
    name: 'Tarta de Queso',
    description: 'Nuestra famosa tarta de queso al horno, cremosa y suave.',
    price: 6.50,
    category: MenuCategory.DESSERTS,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    allergens: ['lactosa', 'huevo', 'gluten']
  },
  {
    id: 'po2',
    name: 'Arroz con Leche',
    description: 'Receta de la abuela, con canela y limón, caramelizado al momento.',
    price: 5.50,
    category: MenuCategory.DESSERTS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOqmf2jEcSc3QRQmAx7sPJys5l4Zp1qSnmBubS_REQ0G1pKwu0D1AfYNPmzlupJY2XrCaGHjJl8zoYza6v4OuFy5JruDIAxXQvzmPiGzd&s=10',
    allergens: ['lactosa']
  },
  {
    id: 'po3',
    name: 'Flan de Huevo',
    description: 'Flan casero de huevo con nata montada.',
    price: 5.00,
    category: MenuCategory.DESSERTS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ20Kk3Xe2vnW-lBjNvavZHtTYTcg7B7-52y1ZjwQRuKQuBFzn2qJ-eQphChV0UtrXa2WJFoi3hAeMHJJIwMblU5FB3gmQmFWFgHBdwQL_f&s=10',
    allergens: ['huevo', 'lactosa']
  },

  // BEBIDAS
  {
    id: 'b1',
    name: 'Vino Tinto Rioja',
    description: 'Copa de vino tinto Crianza D.O. Rioja.',
    price: 3.50,
    category: MenuCategory.DRINKS,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    allergens: ['sulfitos']
  },
  {
    id: 'b2',
    name: 'Cerveza de Barril',
    description: 'Caña de cerveza Mahou bien fría.',
    price: 2.80,
    category: MenuCategory.DRINKS,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
    allergens: ['gluten']
  },
  {
    id: 'b3',
    name: 'Sangría Casera',
    description: 'Jarra de 1 litro de nuestra sangría con fruta fresca.',
    price: 14.00,
    category: MenuCategory.DRINKS,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvRHzYTCCg5QFp2nnD5thHTMpOcy017iLitBLPS9dN1Uu2Xjao3Gbg11CjJyK9NhHwkh9pZUbLL3wH789jkbftU3f3hzAxwiL4JxQSqzQj&s=10',
    allergens: ['sulfitos']
  },
  {
    id: 'b4',
    name: 'Agua Mineral',
    description: 'Botella de vidrio 500ml.',
    price: 2.50,
    category: MenuCategory.DRINKS,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80',
    allergens: []
  }
];;

export const TABLES = ['01', '02', '03', '04'];