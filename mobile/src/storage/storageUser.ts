import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "@dtos/UserDTO";
import { USER_STORAGE } from "./storageConfig";

const storageUserSave = async (user: UserDTO) => {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
};

const storageUserGet = async () => {
  const storage = await AsyncStorage.getItem(USER_STORAGE);

  const user: UserDTO = JSON.parse(storage || "{}");

  return user;
};

const storageUserRemove = async () => {
  await AsyncStorage.removeItem(USER_STORAGE);
};

export { storageUserSave, storageUserGet, storageUserRemove };
