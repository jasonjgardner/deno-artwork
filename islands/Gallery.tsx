import type { ArtworkEntry, GitHubUser } from "🛠️/types.ts";
import { UserContext } from "🛠️/user.ts";
import Item from "🏝️/Item.tsx";
export interface GalleryProps {
  artworks: ArtworkEntry[];
  user: GitHubUser | null;
}

export default function Gallery({ user, artworks }: GalleryProps) {
  return (
    <UserContext.Provider value={user}>
      {artworks.map((entry) => <Item key={entry.artwork.id} {...{ entry }} />)}
    </UserContext.Provider>
  );
}
