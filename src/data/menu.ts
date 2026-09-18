import { MenuItem, MenuCategory } from "@/types";

export interface MenuCategoryMeta {
  id: MenuCategory;
  name: string;
  description: string;
  icon?: string;
}

export const menuCategories: MenuCategoryMeta[] = [
  { id: "coffee", name: "Coffee", description: "Biji Nusantara yang kami sangrai sendiri, plus espresso yang diracik pelan", icon: "☕" },
  { id: "non-coffee", name: "Non-Coffee", description: "Teh, matcha Uji, dan mocktail — buat hari-hari yang nggak ngopi", icon: "🍵" },
  { id: "food", name: "Food", description: "Makanan berat dengan bumbu yang nggak malu-malu", icon: "🍳" },
  { id: "snack", name: "Snack", description: "Camilan gurih yang bikin ngobrol makin lama", icon: "🍟" },
  { id: "dessert", name: "Dessert", description: "Penutup yang susah ditolak. Serius.", icon: "🥐" },
];

// TODO: ganti dengan data asli client setelah form CONTENT_QUESTIONNAIRE.md §3 diisi
export const menuItems: MenuItem[] = [
  // --- Kategori: Coffee ---
  {
    id: "c-01",
    name: "Americano", // TODO: ganti dengan data asli client
    description: "Espresso single origin Sumatra. Panas atau dingin, dua-duanya enak.",
    price: 22000,
    category: "coffee",
    image: "/images/menu/coffee-americano.jpg",
    tags: ["Single Origin", "Sugar Free"],
    isFeatured: false,
  },
  {
    id: "c-02",
    name: "Caramel Macchiato",
    description: "Espresso, susu, dan saus caramel yang nggak pelit. Rata-rata yang pertama kali ke sini pesen ini.",
    price: 28000,
    category: "coffee",
    image: "/Image/Menu/C_Macchiato.png",
    tags: ["Best Seller", "Sweet"],
    isFeatured: true,
  },
  {
    id: "c-03",
    name: "Manual Brew V60",
    description: "Single origin yang diseduh manual. Aciditynya kelihatan, floral, sedikit fruity.",
    price: 30000,
    category: "coffee",
    image: "/Image/Menu/V60.png",
    tags: ["Signature", "Artisanal"],
    isFeatured: true,
  },

  // --- Kategori: Non-Coffee ---
  {
    id: "nc-01",
    name: "Matcha Latte",
    description: "Matcha Uji asli, susunya bikin creamy. Nggak pait-pait amat.",
    price: 26000,
    category: "non-coffee",
    image: "/Image/Menu/Macha_latte.png",
    tags: ["Best Seller", "Japanese"],
    isFeatured: true,
  },
  {
    id: "nc-02",
    name: "Artisan Berry Tea", // TODO: ganti dengan data asli client
    description: "Teh hitam beraroma berry. Asem manis yang bikin nggak bosen.",
    price: 24000,
    category: "non-coffee",
    image: "/images/menu/noncoffee-berry-tea.jpg",
    tags: ["Refreshing", "Iced"],
    isFeatured: false,
  },
  {
    id: "nc-03",
    name: "Sparkling Lychee Mint", // TODO: ganti dengan data asli client
    description: "Soda dengan leci utuh dan mint yang diremas. Coba deh pas siang panas.",
    price: 28000,
    category: "non-coffee",
    image: "/images/menu/noncoffee-lychee.jpg",
    tags: ["Mocktail", "Citrus"],
    isFeatured: false,
  },

  // --- Kategori: Food ---
  {
    id: "f-01",
    name: "Nasi Goreng Kampung", // TODO: ganti dengan data asli client
    description: "Nasgor rempah dengan ayam suwir, acar, dan telor ceplok. Pulang malem wajib ini.",
    price: 35000,
    category: "food",
    image: "/images/menu/food-nasgor.jpg",
    tags: ["Signature", "Hearty"],
    isFeatured: true,
  },
  {
    id: "f-02",
    name: "Creamy Chicken Carbonara", // TODO: ganti dengan data asli client
    description: "Fettuccine creamy, parmesan, smoked chicken. Cocok pas lagi laper parah.",
    price: 42000,
    category: "food",
    image: "/images/menu/food-carbonara.jpg",
    tags: ["Pasta", "Creamy"],
    isFeatured: false,
  },

  // --- Kategori: Snack ---
  {
    id: "s-01",
    name: "Truffle Fries", // TODO: ganti dengan data asli client
    description: "Kentang goreng minyak truffle, parmesannya nggak tanggung. Buat berdua pas.",
    price: 25000,
    category: "snack",
    image: "/images/menu/snack-truffle-fries.jpg",
    tags: ["Favorit Tamu", "Sharing"],
    isFeatured: true,
  },
  {
    id: "s-02",
    name: "Cireng Bumbu Rujak", // TODO: ganti dengan data asli client
    description: "Aci renyah di luar, kenyal di dalam. Sambalnya asem nendang.",
    price: 20000,
    category: "snack",
    image: "/images/menu/snack-cireng.jpg",
    tags: ["Tradisional", "Spicy"],
    isFeatured: false,
  },

  // --- Kategori: Dessert ---
  {
    id: "d-01",
    name: "Classic Butter Croissant", // TODO: ganti dengan data asli client
    description: "Lapisannya renyah, wangi butter, dalemnya lembut. Dibakar dikit makin enak.",
    price: 24000,
    category: "dessert",
    image: "/images/menu/dessert-croissant.jpg",
    tags: ["Fresh Baked", "French"],
    isFeatured: true,
  },
  {
    id: "d-02",
    name: "Basque Burnt Cheesecake", // TODO: ganti dengan data asli client
    description: "Dalemnya lumer, atasnya karamel khas basque. Simpel tapi nagih.",
    price: 32000,
    category: "dessert",
    image: "/images/menu/dessert-cheesecake.jpg",
    tags: ["Sweet", "Rich"],
    isFeatured: false,
  },
];
