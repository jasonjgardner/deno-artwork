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
  reactions?: Reactions;
}

export type Reaction = "👍" | "❤️" | "🦕" | "🍕";

export type Reactions = Record<Reaction, number>;

export interface ReactionEntry {
  artworkId: Artwork["image"];
  user: GitHubUser["login"];
  reaction: Reaction;
}

export interface ArtworkEntry {
  artwork: Artwork;
  reactions: ReactionEntry[];
}
