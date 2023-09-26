import type { JSX } from "preact";
import type { GitHubUser, ReactionDetails } from "🛠️/types.ts";
import { cx } from "@twind/core";

export interface UserListProps extends JSX.HTMLAttributes<HTMLDivElement> {
  users: ReactionDetails[keyof ReactionDetails];
  user: GitHubUser | null;
}

export default function UserList(props: UserListProps) {
  return (
    <div
      class={cx(
        "bg(black opacity-90) backdrop-blur-sm shadow-md flex(col nowrap)",
        "absolute",
        "p-2 rounded-md border border(gray-300) outline outline(1 gray-800)",
        "w-32 max-h-1/2 overflow-y-auto",
        "bottom-full -translate-y-1",
        props.class?.toString(),
      )}
    >
      <ul class="text(xs white left) font(sans medium) select-none whitespace-nowrap">
        {props.users.map((user) => (
          <li
            key={user}
            class={cx(
              user === props.user?.login && "font-semibold text(blue-50)",
              "leading-tight truncate",
            )}
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}
