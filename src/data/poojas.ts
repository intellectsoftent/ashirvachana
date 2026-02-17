import poojaHomam from "@/assets/pooja-homam.jpg";
import poojaNavagraha from "@/assets/pooja-navagraha.jpg";
import poojaRudrabhishek from "@/assets/pooja-rudrabhishek.jpg";
import poojaVastu from "@/assets/pooja-vastu.jpg";
import poojaGanesh from "@/assets/pooja-ganesh.jpg";
import poojaLakshmi from "@/assets/pooja-lakshmi.jpg";
import poojaSatyanarayan from "@/assets/pooja-satyanarayan.jpg";

export interface Pooja {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  duration: string;
  description: string;
  benefits: string[];
  includes: string[];
  rating: number;
  reviews: number;
  priestName: string;
  priestExperience: string;
}

export const poojaImageMap: Record<string, string> = {
  "pooja-homam": poojaHomam,
  "pooja-navagraha": poojaNavagraha,
  "pooja-rudrabhishek": poojaRudrabhishek,
  "pooja-vastu": poojaVastu,
  "pooja-ganesh": poojaGanesh,
  "pooja-lakshmi": poojaLakshmi,
  "pooja-satyanarayan": poojaSatyanarayan,
};

// Map by pooja ID for image re-mapping from localStorage
export const poojaIdImageMap: Record<string, string> = {
  "aghora-pasupatha-homam": poojaHomam,
  "pratyangira-devi-homam": poojaNavagraha,
  "shani-shanti-homam": poojaRudrabhishek,
  "vastu-shanti-pooja": poojaVastu,
  "ganesh-chaturthi-pooja": poojaGanesh,
  "shatru-samhara-pooja": poojaLakshmi,
  "satyanarayan-pooja": poojaSatyanarayan,
};

export const poojasData: Pooja[] = [
  {
    id: "aghora-pasupatha-homam",
    title: "Aghora Pasupatha Homam",
    category: "Protection",
    price: 3000,
    originalPrice: 5000,
    image: poojaHomam,
    duration: "3-4 Hours",
    description: "A powerful homam invoking Lord Shiva's Aghora form for ultimate protection against evil forces, black magic, and negative energies. This ancient Vedic fire ritual creates a divine shield around you and your family.",
    benefits: ["Protection from evil eye & black magic", "Removes negative energies from home", "Brings mental peace and clarity", "Strengthens spiritual aura", "Blesses family with divine protection"],
    includes: ["All pooja samagri", "Experienced Vedic priest", "Homam fire setup", "Prasadam distribution", "Post-pooja guidance"],
    rating: 4.9,
    reviews: 187,
    priestName: "Pandit Raghunath Sharma",
    priestExperience: "25+ years",
  },
  {
    id: "pratyangira-devi-homam",
    title: "Pratyangira Devi Homam",
    category: "Shanti",
    price: 4000,
    originalPrice: 6500,
    image: poojaNavagraha,
    duration: "4-5 Hours",
    description: "A highly powerful homam dedicated to Goddess Pratyangira Devi, known for reversing curses, removing enemies' ill intentions, and providing fierce divine protection. One of the most potent rituals in Vedic tradition.",
    benefits: ["Reverses curses and black magic", "Destroys enemies' evil intentions", "Grants fierce divine protection", "Removes court case obstacles", "Brings victory in legal matters"],
    includes: ["Special yantra energization", "All homam materials", "Senior priest with expertise", "Video recording of ritual", "Blessed talisman"],
    rating: 4.8,
    reviews: 143,
    priestName: "Pandit Vishwanath Dikshit",
    priestExperience: "30+ years",
  },
  {
    id: "shani-shanti-homam",
    title: "Shani Shanti Homam",
    category: "Graha",
    price: 10000,
    originalPrice: 15000,
    image: poojaRudrabhishek,
    duration: "5-6 Hours",
    description: "A comprehensive graha shanti homam to pacify the effects of Shani (Saturn) in your horoscope. Essential during Sade Sati, Shani Mahadasha, or Shani transit for career growth and obstacle removal.",
    benefits: ["Pacifies Shani dosha effects", "Career growth & stability", "Removes delays in success", "Health improvement", "Financial prosperity"],
    includes: ["Navagraha shanti pooja", "Shani mantra japa (19,000 times)", "Homam with specific herbs", "Donation to needy (til, oil)", "Astrological consultation"],
    rating: 4.7,
    reviews: 210,
    priestName: "Pandit Keshav Joshi",
    priestExperience: "20+ years",
  },
  {
    id: "vastu-shanti-pooja",
    title: "Vastu Shanti Pooja",
    category: "Home",
    price: 5000,
    originalPrice: 8000,
    image: poojaVastu,
    duration: "3-4 Hours",
    description: "Performed to neutralize vastu doshas in your home or office. This pooja invokes positive cosmic energies, balances the five elements, and brings harmony, prosperity, and peace to your living space.",
    benefits: ["Neutralizes vastu doshas", "Brings harmony to home", "Improves relationships", "Enhances prosperity flow", "Creates positive energy field"],
    includes: ["Vastu analysis consultation", "All pooja materials", "Kalash sthapana", "Havan/homam", "Vastu remedies guidance"],
    rating: 4.9,
    reviews: 178,
    priestName: "Pandit Suresh Shastri",
    priestExperience: "22+ years",
  },
  {
    id: "ganesh-chaturthi-pooja",
    title: "Ganesh Chaturthi Pooja",
    category: "Festival",
    price: 2500,
    originalPrice: 4000,
    image: poojaGanesh,
    duration: "2-3 Hours",
    description: "A traditional Ganesh Chaturthi celebration pooja invoking Lord Ganesha's blessings for wisdom, prosperity, and removal of all obstacles. Perfect for home celebrations and new beginnings.",
    benefits: ["Removal of obstacles", "Wisdom & intelligence boost", "Success in new ventures", "Academic excellence", "Family harmony"],
    includes: ["Ganesh idol (eco-friendly)", "Complete pooja samagri", "Modak prasadam", "Aarti and bhajan", "Visarjan guidance"],
    rating: 4.8,
    reviews: 312,
    priestName: "Pandit Ganesh Bhatt",
    priestExperience: "18+ years",
  },
  {
    id: "shatru-samhara-pooja",
    title: "Shatru Samhara Pooja",
    category: "Protection",
    price: 2000,
    originalPrice: 3500,
    image: poojaLakshmi,
    duration: "2-3 Hours",
    description: "A powerful pooja to overcome enemies, competitors, and obstacles in your path. This ritual invokes divine blessings to protect you from hidden enemies and ensure victory in all endeavors.",
    benefits: ["Victory over enemies", "Protection from competitors", "Success in business", "Legal case protection", "Confidence boost"],
    includes: ["Specialized yantra", "All pooja materials", "Mantra japa", "Protective talisman", "Follow-up guidance"],
    rating: 4.6,
    reviews: 98,
    priestName: "Pandit Dharmanand Tripathi",
    priestExperience: "15+ years",
  },
  {
    id: "satyanarayan-pooja",
    title: "Satyanarayan Pooja",
    category: "Prosperity",
    price: 3500,
    originalPrice: 5500,
    image: poojaSatyanarayan,
    duration: "2-3 Hours",
    description: "One of the most auspicious poojas dedicated to Lord Vishnu in the form of Satyanarayan. Performed on Purnima or special occasions for fulfillment of wishes, prosperity, and divine grace.",
    benefits: ["Fulfillment of wishes", "Prosperity & abundance", "Family well-being", "Removal of past sins", "Divine grace & blessings"],
    includes: ["Complete pooja samagri", "Katha recitation", "Prasad (sheera/panchamrit)", "Aarti", "Family participation guide"],
    rating: 4.9,
    reviews: 425,
    priestName: "Pandit Narayana Rao",
    priestExperience: "28+ years",
  },
];
