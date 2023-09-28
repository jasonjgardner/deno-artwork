export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

export interface Artist {
  id: string;
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

export type ReactionDetails = Record<Reaction, Array<GitHubUser["login"]>>;

export interface ReactionEntry {
  artworkId: Artwork["image"];
  user: GitHubUser["login"];
  reaction: Reaction;
}

export interface ArtworkEntry {
  artwork: Artwork;
  reactions: ReactionEntry[];
}

export interface ArtworkResponse {
  artwork: Artwork;
  reactions: Reactions;
}

export interface ReactionResponse {
  details: ReactionDetails;
  reactions: Reactions;
}

/**
 * KV store of admin logins
 * @param user.id - GitHub user ID
 * @param user.login - GitHub username
 * @param lastLogin - Last login date as ISO string
 */
export interface AdminLogin {
  user: {
    id: string;
    login: string;
  };
  lastLogin: string;
}
