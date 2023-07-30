import { Center, Heading } from "native-base";

type ScreenHeaderProps = {
  title: string;
};

const ScreenHeader = ({ title }: ScreenHeaderProps) => {
  return (
    <Center bg="gray.600" pb={6} pt={15}>
      <Heading color="gray.100" fontSize="xl" fontFamily="heading">
        {title}
      </Heading>
    </Center>
  );
};

export { ScreenHeader };
