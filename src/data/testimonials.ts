export interface Testimonial {
  id: string;
  name: string;
  location: string;
  language: string;
  title: string;
  text: string;
  rating: number;
}

export const testimonialsData: Testimonial[] = [
  {
    id: "t1",
    name: "Paritosh Parate",
    location: "Mumbai",
    language: "Hindi",
    title: "Hassle free Puja",
    text: "The experience was amazing... Pandit ji was in no rush, everything was well organised, no hassle, it was zero effort from our end... Truly what we needed from our busy schedule.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Amrita Patole",
    location: "Hyderabad",
    language: "Hindi",
    title: "Time Punctuality",
    text: "We are extremely happy with the service. Guruji reached 30 mins before time and also finished Pooja in time. He was humble, prompt and adjusted with available resources. We felt pleased.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Mangesh Hagargi",
    location: "Chennai",
    language: "Marathi",
    title: "Way Of Chanting Mantras",
    text: "The pujari performed an outstanding pooja, showcasing deep knowledge and reverence. His meticulous attention to detail, rhythmic chanting, and graceful rituals created a spiritually enriching experience.",
    rating: 5,
  },
];
