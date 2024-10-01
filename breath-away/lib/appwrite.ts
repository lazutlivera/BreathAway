import { Client, Account, ID, Databases } from
"react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.purplecobra.breathaway",
  projectId: "66faab4e0003ef7eff83",
  databaseId: "66faacc10005471edc42",
  userCollectionId: "66faad4a000039ea291e"
};

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66faab4e0003ef7eff83")
  .setPlatform("com.purplecobra.breathaway");

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

