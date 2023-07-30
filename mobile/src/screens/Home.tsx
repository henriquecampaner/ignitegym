import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { HStack, VStack, FlatList, Heading, Text, useToast } from "native-base";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppRoutesNavigationProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

const Home = () => {
  const toast = useToast();
  const navigation = useNavigation<AppRoutesNavigationProps>();
  const [selectedGroup, setSelectedGroup] = useState<string>("antebraço");
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

  function handleOpenExerciseDetails(exerciseId: string) {
    return navigation.navigate("Exercise", {
      exerciseId,
    });
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const response = await api.get("/groups");

      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao buscar grupos";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${selectedGroup}`);

      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao buscar exercícios";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [selectedGroup])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={groups}
        keyExtractor={(item) => item}
        _contentContainerStyle={{
          px: 8,
        }}
        my={10}
        maxH={10}
        minH={10}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={selectedGroup === item}
            onPress={() => setSelectedGroup(item)}
          />
        )}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading fontFamily="heading" color="gray.200" fontSize="md">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            _contentContainerStyle={{
              paddingBottom: 20,
            }}
            showsHorizontalScrollIndicator={false}
            data={exercises}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleOpenExerciseDetails(item.id)}
              />
            )}
          />
        </VStack>
      )}
    </VStack>
  );
};

export { Home };
