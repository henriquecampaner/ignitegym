import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import BackGroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAth";

const FormDataSchema = z
  .object({
    name: z.string().nonempty({ message: "Nome obrigatório" }),
    email: z.string().email({ message: "E-mail inválido" }).nonempty({
      message: "E-mail obrigatório",
    }),
    password: z
      .string()
      .min(6, { message: "Senha deve ter no mínimo 6 dígitos" }),
    password_confirmation: z
      .string()
      .nonempty({ message: "Confirmação de senha obrigatória" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Senhas não conferem",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof FormDataSchema>;

const SignUp = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
  });

  function handleGoBack() {
    return navigation.goBack();
  }

  async function handleSignUp(data: FormData) {
    try {
      await api.post("/users", data);

      await signIn(data.email, data.password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro na conexão";

      if (isAppError) {
        toast.show({
          title,
          placement: "top",
          bgColor: "red.500",
        });
      }
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} p={16}>
        <Image
          source={BackGroundImg}
          alt="Background"
          resizeMode="contain"
          position="absolute"
          defaultSource={BackGroundImg}
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Train your mind and body
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Create your account
          </Heading>

          <Controller
            control={control}
            name="name"
            rules={{
              required: "Nome obrigatório",
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Seu nome"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name && errors.name.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email && errors.email.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password && errors.password.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors?.password_confirmation?.message}
                placeholder="Confirmar senha"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyLabel="send"
              />
            )}
          />

          <Button
            title="Criar e acessar"
            isLoading={isSubmitting}
            onPress={handleSubmit(handleSignUp)}
          />
        </Center>

        <Button
          title="Voltar para login"
          variant="outline"
          mt={16}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
};

export { SignUp };
