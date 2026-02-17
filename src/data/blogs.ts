import blogGaneshPuja from "@/assets/blog-ganesh-puja.jpg";
import blogVastuHome from "@/assets/blog-vastu-home.jpg";
import blogNavagraha from "@/assets/blog-navagraha.jpg";
import blogChoosingIdol from "@/assets/blog-choosing-idol.jpg";

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogsData: Blog[] = [
  {
    id: "importance-of-ganesh-puja",
    title: "The Spiritual Significance of Ganesh Puja",
    excerpt: "Discover why Lord Ganesha is worshipped first before any auspicious event and how Ganesh Puja can transform your spiritual journey.",
    content: "Lord Ganesha, the elephant-headed deity, holds a unique position in Hindu mythology as the remover of obstacles and the god of beginnings. Every auspicious ceremony starts with an invocation to Lord Ganesha, making Ganesh Puja one of the most important rituals in Hinduism.\n\nThe practice of performing Ganesh Puja dates back thousands of years, rooted in ancient Vedic traditions. The ritual involves offering modaks (sweet dumplings), durva grass, and red flowers to the deity while chanting sacred mantras.\n\nBenefits of regular Ganesh Puja include removal of obstacles from your path, enhanced wisdom and intellect, success in new ventures, and spiritual growth. Whether you're starting a new business, moving into a new home, or beginning any important phase of life, Ganesh Puja sets the foundation for success.",
    category: "Rituals",
    image: blogGaneshPuja,
    author: "Pandit Sharma",
    date: "2026-02-01",
    readTime: "5 min read",
    tags: ["Ganesha", "Puja", "Rituals"],
  },
  {
    id: "vastu-tips-home",
    title: "Vastu Shastra: Essential Tips for a Harmonious Home",
    excerpt: "Learn how ancient Vastu principles can bring positive energy, prosperity, and peace to your living space.",
    content: "Vastu Shastra is an ancient Indian science of architecture that aligns your living space with natural forces and cosmic energy. By following Vastu principles, you can create an environment that promotes health, wealth, and happiness.\n\nKey Vastu tips include placing the puja room in the northeast corner, ensuring the kitchen is in the southeast, and keeping the center of the house open and clutter-free. The main entrance should ideally face north or east to welcome positive energy.\n\nA Vastu-compliant home is believed to attract prosperity and ward off negative influences. Many families perform Vastu Shanti Puja when moving into a new home to purify the space and align it with cosmic energies.",
    category: "Vastu",
    image: blogVastuHome,
    author: "Acharya Mishra",
    date: "2026-01-25",
    readTime: "7 min read",
    tags: ["Vastu", "Home", "Prosperity"],
  },
  {
    id: "navagraha-puja-benefits",
    title: "Navagraha Puja: Aligning Planetary Energies",
    excerpt: "Understanding the nine planetary deities and how Navagraha Puja can neutralize negative planetary effects in your horoscope.",
    content: "The Navagrahas, or nine celestial bodies, play a crucial role in Vedic astrology. Each planet governs specific aspects of life, from career and relationships to health and finances. When these planets are unfavorably positioned in your birth chart, they can cause challenges and obstacles.\n\nNavagraha Puja is a powerful ritual that appeases all nine planetary deities simultaneously. The ceremony involves specific mantras, offerings, and fire rituals dedicated to Surya (Sun), Chandra (Moon), Mangal (Mars), Budh (Mercury), Guru (Jupiter), Shukra (Venus), Shani (Saturn), Rahu, and Ketu.\n\nRegular Navagraha Puja can help mitigate the negative effects of planetary transits, bring balance to your life, and open pathways to success that may have been blocked by unfavorable planetary positions.",
    category: "Astrology",
    image: blogNavagraha,
    author: "Jyotish Acharya Dev",
    date: "2026-01-18",
    readTime: "6 min read",
    tags: ["Navagraha", "Astrology", "Planets"],
  },
  {
    id: "choosing-right-idol",
    title: "How to Choose the Perfect Idol for Your Home Temple",
    excerpt: "A comprehensive guide to selecting the right deity idol based on material, size, and spiritual significance for your home puja.",
    content: "Selecting an idol for your home temple is a deeply personal and spiritual decision. The right idol not only enhances the aesthetic beauty of your puja space but also serves as a powerful focal point for meditation and worship.\n\nWhen choosing an idol, consider the material first. Brass and copper idols are considered highly auspicious and are durable. Marble idols bring elegance and are ideal for larger puja rooms. Panchaloha (five-metal alloy) idols are considered the most sacred.\n\nSize matters too — the idol should be proportionate to your puja room. Traditional guidelines suggest the idol should not be taller than your sitting height during prayer. The face of the idol should be serene and well-crafted, as this is where you'll focus during meditation.\n\nAlways ensure the idol is properly consecrated (Prana Pratishtha) before placing it in your home temple for worship.",
    category: "Guides",
    image: blogChoosingIdol,
    author: "Pandit Sharma",
    date: "2026-01-10",
    readTime: "8 min read",
    tags: ["Idols", "Home Temple", "Guide"],
  },
];
