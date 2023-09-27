import type { ArtworkEntry, GitHubUser } from "🛠️/types.ts";
import { UserContext } from "🛠️/user.ts";
import ArtworkItem from "🏝️/ArtworkItem.tsx";

export interface GalleryProps {
  artworks: ArtworkEntry[];
  user: GitHubUser | null;
}

export default function Gallery({ user, artworks }: GalleryProps) {
  return (
    <UserContext.Provider value={user}>
      {artworks.map((entry) => (
        <ArtworkItem key={entry.artwork.id} {...{ entry }} />
      ))}
    </UserContext.Provider>
  );
}
