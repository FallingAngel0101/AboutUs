import { User, UserType } from "../types/types";

export const createUser = (
  type: UserType,
  baseProps: Omit<User, "type">
): User => {
  switch (type) {
    case "moderator":
      return {
        ...baseProps,
        type,
        isVerified: true,
      };
    case "anonymous":
      return {
        ...baseProps,
        type,
        anonymousId: `anon-${Math.random().toString(36).substr(2, 9)}`,
      };
    default:
      return { ...baseProps, type: "default" };
  }
};
