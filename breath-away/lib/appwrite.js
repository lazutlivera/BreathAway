import { Client, Account, ID } from "react-native-appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66faab4e0003ef7eff83")
  .setPlatform("com.purplecobra.breathaway");
