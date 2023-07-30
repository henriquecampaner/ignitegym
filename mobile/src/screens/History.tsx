import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Heading, VStack, SectionList, Text, useToast } from "native-base";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { HistoryByDayDTO } from "@dtos/HistoryDTO";
import { Loading } from "@components/Loading";

const History = () => {
  const toast = useToast();
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/history`);

      setExercises(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao carregar histórico";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Historico de exercicios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Heading
            fontFamily="heading"
            color="gray.200"
            fontSize="md"
            mt={10}
            mb={3}
          >
            {title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Nenhum exercicio encontrado.
            {"\n"}
            Vamos começar a treinar?
          </Text>
        )}
      />
    </VStack>
  );
};

export { History };
