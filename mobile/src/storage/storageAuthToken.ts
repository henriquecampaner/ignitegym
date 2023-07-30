import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_STORAGE } from "./storageConfig";

const storageAuthTokenSave = async (token: string) => {
  await AsyncStorage.setItem(AUTH_STORAGE, token);
};

const storageAuthTokenGet = async () => {
  const token = await AsyncStorage.getItem(AUTH_STORAGE);
  return token;
};

const storageAuthTokenRemove = async () => {
  await AsyncStorage.removeItem(AUTH_STORAGE);
};

export { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove };
