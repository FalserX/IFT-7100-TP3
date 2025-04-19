import { promises as fs } from "fs";
import path from "path";
import { RoleType } from "../types/role";
import {
  UserType,
  UserFieldSubset,
  ReadUsersResult,
  WriteUsersResult,
} from "../types/user";
import { v4 as uuid } from "uuid";

const USERS_PATH = path.join(process.cwd(), "db", "users.json");

export async function readUsers(
  includeDeleted = false
): Promise<ReadUsersResult> {
  try {
    const raw = await fs.readFile(USERS_PATH, "utf-8");
    const users: UserType[] | unknown = JSON.parse(raw);
    if (!Array.isArray(users)) {
      return {
        success: false,
        error: { errorStatus: 500, errorMessage: "errors.users.empty" },
      };
    }
    const filteredUsers = includeDeleted
      ? users
      : users.filter((user) => !user.deleted);
    return { success: true, data: filteredUsers };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.users.read",
        errorConsole: err,
      },
    };
  }
}
export async function writeUsers(users: UserType[]): Promise<WriteUsersResult> {
  try {
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 400,
        errorMessage: "errors.users.write",
        errorConsole: err,
      },
    };
  }
}
export async function getUserById(
  id: string,
  includeDeleted: boolean
): Promise<ReadUsersResult> {
  try {
    const users = await readUsers(includeDeleted);
    if (!users.success) {
      return users;
    }
    const usersData: UserType[] = users.data as UserType[];
    const index = usersData.findIndex((u: UserType) => u.id === id);
    if (index === -1) {
      return {
        success: false,
        error: {
          errorStatus: 404,
          errorMessage: "errors.users.user.found",
        },
      };
    }
    return { success: true, data: usersData[index] };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.users.user.read",
        errorConsole: err,
      },
    };
  }
}
export async function getUserByAddress(
  walletAddress: string
): Promise<ReadUsersResult> {
  try {
    const users = await readUsers();
    if (!users.success) {
      return users;
    }
    const usersData: UserType[] = users.data as UserType[];

    const index = usersData.findIndex(
      (u: UserType) => u.wallet === walletAddress
    );
    if (index == -1) {
      return {
        success: false,
        error: {
          errorStatus: 404,
          errorMessage: "errors.users.user.found",
        },
      };
    }
    return { success: true, data: usersData[index] };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.users.user.read",
        errorConsole: err,
      },
    };
  }
}
export async function updateUser(
  id: string,
  updateFields: Record<string, UserFieldSubset>
): Promise<WriteUsersResult> {
  try {
    const users = await readUsers();
    if (!users.success) {
      return users;
    }
    const usersData: UserType[] = users.data as UserType[];

    const index = usersData.findIndex((u: UserType) => u.id === id);
    if (index == -1) {
      return {
        success: false,
        error: {
          errorStatus: 404,
          errorMessage: "errors.users.user.found",
        },
      };
    }
    const updatedUser = {
      ...usersData[index],
      ...updateFields,
      updatedAt: new Date().toISOString(),
    };
    usersData[index] = updatedUser;
    await writeUsers(usersData);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 400,
        errorMessage: "errors.users.user.update",
        errorConsole: err,
      },
    };
  }
}

function generateRandomPseudo(): string {
  const syl: string[] = [
    "ka",
    "lo",
    "mi",
    "za",
    "ra",
    "li",
    "fu",
    "ta",
    "do",
    "pa",
  ];
  const pre: string[] = ["Neo", "Max", "Mega", "Ultra", "Dark", "Light"];
  const suf: string[] = ["tron", "zor", "ix", "ior", "lus", "ian"];

  const prefix = pre[Math.floor(Math.random() * pre.length)];
  const syllable = syl[Math.floor(Math.random() * syl.length)];
  const suffix = suf[Math.floor(Math.random() * suf.length)];
  return prefix + syllable + suffix;
}

export async function softDeleteUser(id: string): Promise<WriteUsersResult> {
  try {
    const users = await readUsers(true);
    if (!users.success) {
      return users;
    }
    const usersData: UserType[] = users.data as UserType[];

    const index = usersData.findIndex((u: UserType) => u.id === id);
    if (index === -1 || usersData[index].deleted) {
      return {
        success: false,
        error: {
          errorStatus: 404,
          errorMessage: "errors.users.user.found",
        },
      };
    }
    usersData[index].deleted = true;
    usersData[index].updatedAt = new Date().toISOString();
    await writeUsers(usersData);
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 400,
        errorMessage: "errors.users.user.delete",
        errorConsole: err,
      },
    };
  }
}

export async function createUserIfNotExist(
  address: string
): Promise<WriteUsersResult> {
  const defaultNewUser: UserType = {
    id: uuid(),
    deleted: false,
    rating: 2.5,
    ratingList: [],
    profilePicture: {
      alt: "users.user.profile.general.profile.picture.alt",
      url: "/User.svg",
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    wallet: address,
    role: [RoleType.BUYER],
    pseudo: generateRandomPseudo(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  try {
    const users = await readUsers(true);
    if (!users.success) {
      if (users.data && !Array.isArray(users.data)) {
        return {
          success: false,
          error: { errorStatus: 500, errorMessage: "errors.users.format" },
        };
      }
      let usersUpdate: UserType[];
      if (users.data && (users.data as UserType[]).length > 0) {
        const usersData: UserType[] = users.data as UserType[];
        usersUpdate = [...usersData, defaultNewUser];
      } else {
        usersUpdate = [defaultNewUser];
      }
      const usersWrite: WriteUsersResult = await writeUsers(usersUpdate);
      if (!usersWrite.success) {
        return {
          success: false,
          error: {
            errorStatus: usersWrite.error?.errorStatus ?? 500,
            errorMessage:
              usersWrite.error?.errorMessage ?? "errors.users.user.create",
          },
        };
      }
      return { success: true };
    } else if (Array.isArray(users.data) && users.data.length === 0) {
      const usersUpdate: UserType[] = [defaultNewUser];
      const usersWrite: WriteUsersResult = await writeUsers(usersUpdate);
      if (!usersWrite.success) {
        return {
          success: false,
          error: {
            errorStatus: usersWrite.error?.errorStatus ?? 500,
            errorMessage:
              usersWrite.error?.errorMessage ?? "errors.users.user.create",
          },
        };
      }
      return { success: true };
    }
    {
      return {
        success: true,
      };
    }
  } catch (err) {
    return {
      success: false,
      error: {
        errorStatus: 500,
        errorMessage: "errors.users.user.create",
        errorConsole: err,
      },
    };
  }
}
