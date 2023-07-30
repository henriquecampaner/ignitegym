import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAth";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";

const FormDataSchema = z
  .object({
    name: z.string().nonempty({ message: "Nome obrigatório" }),
    email: z.string(),

    password: z
      .string()
      .min(6, {
        message: "A senha deve ter no mínimo 6 caracteres",
      })
      .or(z.literal(""))
      .transform((value) => value || undefined)
      .optional(),

    confirm_password: z
      .string()
      .or(z.literal(""))
      .transform((value) => value || undefined)
      .optional(),

    old_password: z
      .string()
      .transform((value) => value || undefined)
      .optional(),
  })
  .refine(
    (data) => {
      return data.password === data.confirm_password;
    },
    {
      message: "Senhas não conferem",
      path: ["confirm_password"],
    }
  );

type FormData = z.infer<typeof FormDataSchema>;

const Profile = () => {
  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: user.email,
      name: user.name,
    },
    resolver: zodResolver(FormDataSchema),
  });

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) return;

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        );

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 8) {
          return toast.show({
            title: "A imagem deve ter no máximo 5MB",
            placement: "top",
            bgColor: "red.500",
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();

        userPhotoUploadForm.append("avatar", photoFile);

        const avatarResponse = await api.patch(
          "/users/avatar",
          userPhotoUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.show({
          title: "Foto de perfil atualizada com sucesso",
          placement: "top",
          bgColor: "green.500",
        });

        const userUpdated = user;
        userUpdated.avatar = avatarResponse.data.avatar;

        await updateUserProfile(userUpdated);
      }
    } catch (error) {
      toast.show({
        title: "Erro ao atualizar foto de perfil",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function handleUpdateProfile(data: FormData) {
    try {
      const userData = user;

      userData.name = data.name;

      await api.put("/users", data);

      await updateUserProfile(userData);

      toast.show({
        title: "Perfil atualizado com sucesso",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao atualizar perfil";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 36,
        }}
      >
        <Center mt={6} px={10}>
          <UserPhoto
            source={{ uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }}
            alt="Henrique Campaner"
            size={33}
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.name?.message}
                placeholder="Nome"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.email?.message}
                placeholder="E-mail"
                bg="gray.600"
                isDisabled
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
            Alterar senha
          </Heading>

          <Controller
            name="old_password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.old_password?.message}
                placeholder="Senha antiga"
                bg="gray.600"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.password?.message}
                placeholder="Nova senha"
                bg="gray.600"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            name="confirm_password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.confirm_password?.message}
                placeholder="Confirme nova senha"
                bg="gray.600"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleUpdateProfile)}
            isLoading={isSubmitting}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export { Profile };
