import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type ButtonProps = IButtonProps & {
  title: string;
  variant?: "outline" | "solid";
};

const Button = ({ title, variant = "solid", ...props }: ButtonProps) => {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor={variant === "outline" ? "green.700" : "transparent"}
      bg={variant === "outline" ? "transparent" : "green.700"}
      {...props}
      rounded="sm"
      _pressed={{
        bg: variant === "outline" ? "gray.500" : "green.500",
      }}
    >
      <Text
        color={variant === "outline" ? "green.500" : "white"}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
};

export { Button };
