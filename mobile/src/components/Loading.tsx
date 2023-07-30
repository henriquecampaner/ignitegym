import { Spinner, Center } from "native-base";

const Loading = () => {
  return (
    <Center flex={1} bg="gray.700">
      <Spinner color="green.700" />
    </Center>
  );
};

export { Loading };
