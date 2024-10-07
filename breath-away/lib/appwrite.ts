import { Client, Account, ID, Databases, Query } from "react-native-appwrite";

export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "",
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? "",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? "",
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID ?? "",
  routinesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_ROUTINES_COLLECTION_ID ?? "",
  completedRoutines: "6703c9a4002e7d5042c6",
};

export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const databases = new Databases(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    await signIn(email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
      }
    );

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error: any) {
    console.log(error);
  }
};

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

// export interface Routine {
//   title: string;
//   img: string;
//   instructions: string;
//   description: string,

// }

export const getRoutines = async () => {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.routinesCollectionId
    );

    return result;
  } catch (error) {
    throw new Error();
  }
};

export const getRoutinesById = async (id: string) => {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.routinesCollectionId,
      [Query.equal("$id", [id])]
    );

    return result;
  } catch (error) {
    throw new Error();
  }
};

export const saveCompletedRoutine = async (
  userId: string,
  routineId: string,
  routineName: string,
  completionDate: string
) => {
  try {
    console.log("Saving completed routine with params:", {
      userId,
      routineId,
      routineName,
      completionDate,
    });
    const result = await databases.createDocument(
      config.databaseId,
      config.completedRoutines,
      ID.unique(),
      {
        userId,
        routineId,
        routineName,
        completionDate,
      }
    );
    return result;
  } catch (error: any) {
    console.log("Error saving completed routine:", error);
    throw new Error(error);
  }
};

export const getUserCompletedRoutines = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error("No account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser.documents.length) throw new Error("No user found");

    const user = currentUser.documents[0];

    const completedRoutinesResult = await databases.listDocuments(
      config.databaseId,
      config.completedRoutines,
      [Query.equal("userId", user.accountId)]
    );

    console.log("User's completed routines:", completedRoutinesResult);

    return {
      user,
      completedRoutines: completedRoutinesResult.documents,
    };
  } catch (error: any) {
    console.log("Error fetching user and completed routines:", error);
    throw new Error(error);
  }
};
