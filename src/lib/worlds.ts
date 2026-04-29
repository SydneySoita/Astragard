import voiceover from "@/assets/worlds/voiceover.jpg";
import authors from "@/assets/worlds/authors.jpg";
import visual from "@/assets/worlds/visual.jpg";
import gameAudio from "@/assets/worlds/game-audio.jpg";
import product from "@/assets/worlds/product.jpg";
import musicians from "@/assets/worlds/musicians.jpg";
import fashion from "@/assets/worlds/fashion.jpg";
import paranormalogy from "@/assets/worlds/paranormalogy.jpg";
import science from "@/assets/worlds/science.jpg";

export type ArtistCategory =
  | "voiceover"
  | "authors"
  | "visual"
  | "game_audio"
  | "product"
  | "musicians"
  | "fashion"
  | "paranormalogy"
  | "science";

export interface WorldTheme {
  id: ArtistCategory;
  label: string;
  themeName: string;
  greetingPlace: string;
  tagline: string;
  backdrop: string;
  /** HSL accent color overrides for this world */
  accent: string; // hsl triplet
}

export const WORLDS: Record<ArtistCategory, WorldTheme> = {
  voiceover: {
    id: "voiceover",
    label: "Voiceover Artist",
    themeName: "Recording Studio",
    greetingPlace: "studio",
    tagline: "Your voice carries meaning — and we protect it.",
    backdrop: voiceover,
    accent: "28 90% 55%",
  },
  authors: {
    id: "authors",
    label: "Author / Writer",
    themeName: "Writing Library",
    greetingPlace: "writing room",
    tagline: "Your words shape stories — and we protect them.",
    backdrop: authors,
    accent: "42 60% 55%",
  },
  visual: {
    id: "visual",
    label: "Visual / Motion / Spatial Artist",
    themeName: "Studio Gallery",
    greetingPlace: "studio",
    tagline: "Your vision builds worlds — and we protect it.",
    backdrop: visual,
    accent: "30 50% 60%",
  },
  game_audio: {
    id: "game_audio",
    label: "Game & Interactive Audio Creator",
    themeName: "Development Lab",
    greetingPlace: "development lab",
    tagline: "Your imagination creates experiences — and we protect them.",
    backdrop: gameAudio,
    accent: "4 75% 55%",
  },
  product: {
    id: "product",
    label: "Concept & Product Designer",
    themeName: "Design Workshop",
    greetingPlace: "workshop",
    tagline: "Your ideas shape the future — and we protect them.",
    backdrop: product,
    accent: "200 40% 60%",
  },
  musicians: {
    id: "musicians",
    label: "Musician / Live Performer",
    themeName: "Performance Stage",
    greetingPlace: "stage",
    tagline: "Your sound moves people — and we protect it.",
    backdrop: musicians,
    accent: "12 70% 55%",
  },
  fashion: {
    id: "fashion",
    label: "Fashion / Wearable Designer",
    themeName: "Atelier",
    greetingPlace: "atelier",
    tagline: "Your style defines identity — and we protect it.",
    backdrop: fashion,
    accent: "38 65% 60%",
  },
  paranormalogy: {
    id: "paranormalogy",
    label: "Paranormalogy / Cryptology",
    themeName: "Research Archive",
    greetingPlace: "archive",
    tagline: "Your discoveries challenge the unknown — and we protect them.",
    backdrop: paranormalogy,
    accent: "45 55% 50%",
  },
  science: {
    id: "science",
    label: "Science / Energy / Metaphysics",
    themeName: "Research Laboratory",
    greetingPlace: "laboratory",
    tagline: "Your discoveries expand knowledge — and we protect them.",
    backdrop: science,
    accent: "200 80% 55%",
  },
};

export const WORLD_LIST = Object.values(WORLDS);
