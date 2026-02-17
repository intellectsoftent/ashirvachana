export interface Idol {
  id: string;
  name: string;
  deity: string;
  price: number;
  originalPrice: number;
  image: string;
  material: string;
  height: string;
  weight: string;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
}

// We'll use dynamic imports via image map
export const idolsData: Omit<Idol, 'image'>[] = [
  {
    id: "ganesha-brass",
    name: "Lord Ganesha Brass Idol",
    deity: "Ganesha",
    price: 2499,
    originalPrice: 3999,
    material: "Pure Brass",
    height: "8 inches",
    weight: "1.2 kg",
    description: "Exquisitely crafted Lord Ganesha idol in pure brass with intricate detailing. This sacred murti brings blessings of wisdom, prosperity, and removal of obstacles to your home temple.",
    features: ["Handcrafted by artisans", "Pure brass construction", "Antique gold finish", "Ideal for home temple", "Gift-ready packaging"],
    rating: 4.8,
    reviews: 245,
    inStock: true,
  },
  {
    id: "lakshmi-brass",
    name: "Goddess Lakshmi Brass Idol",
    deity: "Lakshmi",
    price: 2999,
    originalPrice: 4499,
    material: "Pure Brass",
    height: "10 inches",
    weight: "1.5 kg",
    description: "Beautiful Goddess Lakshmi idol standing on a lotus, symbolizing wealth, fortune, and prosperity. Perfect for Diwali puja and daily worship.",
    features: ["Standing on lotus base", "Four-armed depiction", "Gold-tone finish", "Detailed ornamentation", "Blessed before shipping"],
    rating: 4.9,
    reviews: 189,
    inStock: true,
  },
  {
    id: "shiva-nataraja",
    name: "Lord Shiva Nataraja Idol",
    deity: "Shiva",
    price: 3499,
    originalPrice: 5499,
    material: "Pure Brass",
    height: "12 inches",
    weight: "2.1 kg",
    description: "Majestic Nataraja statue depicting Lord Shiva's cosmic dance. The ring of fire symbolizes the cycle of creation and destruction.",
    features: ["Cosmic dance pose", "Ring of fire detail", "Heavy brass construction", "Museum-quality finish", "Certificate of authenticity"],
    rating: 4.7,
    reviews: 132,
    inStock: true,
  },
  {
    id: "krishna-flute",
    name: "Lord Krishna with Flute",
    deity: "Krishna",
    price: 1999,
    originalPrice: 2999,
    material: "Pure Brass",
    height: "7 inches",
    weight: "0.9 kg",
    description: "Enchanting Lord Krishna idol in the tribhanga pose playing the divine flute. Radiates peace, love, and devotion.",
    features: ["Tribhanga pose", "Flute in hand", "Peacock feather crown", "Polished brass finish", "Perfect for gifting"],
    rating: 4.8,
    reviews: 298,
    inStock: true,
  },
  {
    id: "hanuman-devotional",
    name: "Lord Hanuman Devotional Idol",
    deity: "Hanuman",
    price: 1799,
    originalPrice: 2499,
    material: "Pure Brass",
    height: "9 inches",
    weight: "1.3 kg",
    description: "Powerful Lord Hanuman idol in devotional pose. Symbolizes strength, courage, and unwavering devotion.",
    features: ["Devotional pose", "Mace in hand", "Detailed musculature", "Antique finish", "Energy-cleansed"],
    rating: 4.6,
    reviews: 167,
    inStock: true,
  },
  {
    id: "saraswati-veena",
    name: "Goddess Saraswati with Veena",
    deity: "Saraswati",
    price: 2799,
    originalPrice: 3999,
    material: "Pure Brass",
    height: "10 inches",
    weight: "1.4 kg",
    description: "Graceful Goddess Saraswati idol seated on a lotus with veena. Bestows knowledge, wisdom, and artistic excellence.",
    features: ["Seated on lotus", "Veena in hands", "Swan companion", "Fine detailing", "Ideal for students"],
    rating: 4.9,
    reviews: 203,
    inStock: true,
  },
  {
    id: "durga-lion",
    name: "Goddess Durga on Lion",
    deity: "Durga",
    price: 3999,
    originalPrice: 5999,
    material: "Pure Brass",
    height: "11 inches",
    weight: "2.5 kg",
    description: "Magnificent Goddess Durga idol riding a lion with multiple arms wielding divine weapons. Symbol of feminine power and protection.",
    features: ["Multi-armed depiction", "Lion mount", "Divine weapons", "Heavy brass piece", "Navaratri special"],
    rating: 4.8,
    reviews: 156,
    inStock: true,
  },
  {
    id: "vishnu-standing",
    name: "Lord Vishnu Standing Idol",
    deity: "Vishnu",
    price: 3299,
    originalPrice: 4999,
    material: "Pure Brass",
    height: "11 inches",
    weight: "1.8 kg",
    description: "Regal Lord Vishnu idol with four arms holding conch, discus, mace, and lotus. The preserver of the universe.",
    features: ["Four divine attributes", "Standing pose", "Crown and ornaments", "Premium brass", "Collector's item"],
    rating: 4.7,
    reviews: 98,
    inStock: false,
  },
];
