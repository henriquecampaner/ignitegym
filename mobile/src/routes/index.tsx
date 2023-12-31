import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@hooks/useAth";
import { Loading } from "@components/Loading";

const Routes = () => {
  const { colors } = useTheme();
  const theme = DefaultTheme;

  const { user, isLoadingUserData } = useAuth();

  theme.colors.background = colors.gray[700];

  if (isLoadingUserData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
};

export { Routes };
