import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import BackGroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigatorRouterProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAth";
import { AppError } from "@utils/AppError";

const FormDataSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }).nonempty({
    message: "E-mail obrigatório",
  }),
  password: z.string().nonempty({ message: "Senha obrigatória" }),
});

type FormData = z.infer<typeof FormDataSchema>;

const SignIn = () => {
  const toast = useToast();
  const { signIn } = useAuth();

  const navigation = useNavigation<AuthNavigatorRouterProps>();
  const {
    control,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
  });

  function handleGoToSignUp() {
    return navigation.navigate("SignUp");
  }

  async function handleSignIn(data: FormData) {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : "Erro na autenticação";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
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
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.email?.message}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.password?.message}
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isSubmitting}
          />
        </Center>

        <Center mt={16}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Não tem uma conta?
          </Text>
          <Button
            title="Criar Conta"
            variant="outline"
            onPress={handleGoToSignUp}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
};

export { SignIn };
