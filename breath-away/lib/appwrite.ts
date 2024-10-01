import { Client, Account, ID, Databases } from
"react-native-appwrite";
import dotenv from 'dotenv'

dotenv.config()

export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!
};

const client = new Client();
client

  .setEndpoint(config.endpoint)
  .setProject (config.projectId)
  .setPlatform(config.platform);

  const account = new Account(client);
  const databases = new Databases(client);

  export const createUser = async (email: string, password: string, username: string) => {
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

  export const signIn = async (email: string, password:string) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);

      return session;
    } catch (error: any) {
      throw new Error(error);
    }
  };

