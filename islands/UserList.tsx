import type { JSX } from "preact";
import type { GitHubUser, ReactionDetails } from "🛠️/types.ts";
import { cx } from "@twind/core";

export interface UserListProps extends JSX.HTMLAttributes<HTMLDivElement> {
  users: ReactionDetails[keyof ReactionDetails];
  user: GitHubUser | null;
}

/**
 * Maximum number of users to list in the dropdown.
 */
const MAX_LENGTH = 10;

export default function UserList(props: UserListProps) {
  const total = props.users.length;
  // Show the most recent users
  const users = total > MAX_LENGTH
    ? props.users.slice(-1 * MAX_LENGTH)
    : props.users;

  return (
    <div
      class={cx(
        "bg(black opacity-90) backdrop-blur-sm shadow-md flex(col nowrap)",
        "absolute z-10 pointer-events-none",
        "p-2 rounded-md border border(gray-300) outline outline(1 gray-800)",
        "w-32 max-h-1/2 overflow-y-auto",
        "bottom-full -translate-y-1",
        props.class?.toString(),
      )}
    >
      <ul class="text(xs white left) font(sans medium) select-none whitespace-nowrap">
        {users.map((user) => (
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
        {total > MAX_LENGTH && (
          <li class="text(gray-400) font(sans normal) leading-tight truncate">
            and {total - MAX_LENGTH} more...
          </li>
        )}
      </ul>
    </div>
  );
}
