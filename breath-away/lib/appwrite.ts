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

class AppwriteService {
  private client: Client;
  private account: Account;
  private databases: Databases;

  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(config.endpoint)
      .setProject(config.projectId)
      .setPlatform(config.platform);
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }


  async createUser(email: string, password: string, username: string) {
    try {
      const newAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        username
      );

      if (!newAccount) throw Error;

      await this.signIn(email, password);
      const newUser = await this.databases.createDocument(
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
  }

  async signIn(email: string, password: string) {
    try {
      const session = await this.account.createEmailPasswordSession(email, password);

      return session;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getCurrentUser() {
    try {
      const currentAccount = await this.account.get();

      if (!currentAccount) throw Error;

      const currentUser = await this.databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );

      if (!currentUser) throw Error;

      return currentUser.documents[0];
    } catch (error: any) {
      console.log(error);
    }
  }

  async signOut() {
    try {
      const session = await this.account.deleteSession("current");

      return session;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getRoutines() {
    try {
      const result = await this.databases.listDocuments(
        config.databaseId,
        config.routinesCollectionId
      );

      return result;
    } catch (error) {
      throw new Error();
    }
  }

  async getRoutinesById(id: string) {
    try {
      const result = await this.databases.listDocuments(
        config.databaseId,
        config.routinesCollectionId,
        [Query.equal("$id", [id])]
      );

      return result;
    } catch (error) {
      throw new Error();
    }
  }

  async saveCompletedRoutine(userId: string, routineId: string, routineName: string, completionDate: string) {
    try {
      console.log("Saving completed routine with params:", {
        userId,
        routineId,
        routineName,
        completionDate,
      });
      const result = await this.databases.createDocument(
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
  }

  async getUserCompletedRoutines() {
    try {
      const currentAccount = await this.account.get();

      if (!currentAccount) throw new Error("No account found");

      const currentUser = await this.databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );

      if (!currentUser.documents.length) throw new Error("No user found");

      const user = currentUser.documents[0];

      const completedRoutinesResult = await this.databases.listDocuments(
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
  }
}

export default new AppwriteService();
