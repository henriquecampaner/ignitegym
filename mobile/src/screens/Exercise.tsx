import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import {
  Box,
  HStack,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
  ScrollView,
  useToast,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { AppRoutesNavigationProps } from "@routes/app.routes";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

type RouteParams = {
  exerciseId: string;
};

const Exercise = () => {
  const navigation = useNavigation<AppRoutesNavigationProps>();
  const route = useRoute();
  const toast = useToast();
  const { exerciseId } = route?.params as RouteParams;

  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sendingRegister, setSendingRegister] = useState<boolean>(false);

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExercise() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/exercises/${exerciseId}`);

      setExercise(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao buscar exercício";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseDone() {
    try {
      setSendingRegister(true);
      await api.post("/history", {
        exercise_id: exerciseId,
      });

      toast.show({
        title: "Exercício registrado com sucesso",
        placement: "top",
        bgColor: "green.700",
      });

      navigation.navigate("Home");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao registrar exercício";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExercise();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading
            color="gray.100"
            fontSize="lg"
            flexShrink={1}
            fontFamily="heading"
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView>
          <VStack p={8}>
            <Image
              w="full"
              h={80}
              mb={3}
              resizeMode="cover"
              rounded="lg"
              alt="Nome do exercício"
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
              }}
            />

            <Box bg="gray.600" rounded="md" pb={4} px={4}>
              <HStack
                alignItems="center"
                justifyContent="space-around"
                mb={6}
                mt={5}
              >
                <HStack>
                  <SeriesSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.series} series
                  </Text>
                </HStack>
                <HStack>
                  <RepsSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.repetitions} repetiçōes
                  </Text>
                </HStack>
              </HStack>

              <Button
                onPress={handleExerciseDone}
                title="Marcar como realizado"
                isLoading={sendingRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
};

export { Exercise };
