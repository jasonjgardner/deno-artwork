export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

export interface Artist {
  name: string;
  github: GitHubUser["login"];
  profile_image?: string;
  twitter?: string;
  instagram?: string;
  web?: string;
}

export interface Artwork {
  id: string;
  date: Date;
  image: string;
  title: string;
  link?: string;
  alt: string;
  artist: Artist;
  license: string;
}
export type Reaction = "👍" | "👎" | "❤️" | "🦕" | "🍕";
