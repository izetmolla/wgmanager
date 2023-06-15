import {
  View,
  Center,
  Text,
  Flex,
  Box,
  VStack,
  FormControl,
  useBreakpointValue,
  Button,
} from "native-base";
import React, { FC, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import InputWithLabel from "@spazfeed/components/InputBox/InputWithLabel";
import { useAppDispatch, useAppSelector } from "@spazfeed/hooks";
import { loginAction } from "@spazfeed/redux/actions/Authorization";
import { useNavigate } from "react-router-dom";

interface LoginPageTypes { }
const LoginPage: FC<LoginPageTypes> = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoggedin, isLoading, error } = useAppSelector(
    (state) => state.authorization
  );
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const isMobile = useBreakpointValue({ sm: true });

  useEffect(() => {
    if (isLoggedin) navigate("/dashboard");
  }, [isLoggedin, navigate]);

  return (
    <View flex={1} style={{ minHeight: "100vh" }}>
      <Flex flex={1} alignItems="center" justifyContent="center">
        <Box
          {...(isMobile && {
            borderWidth: 0.2,
            shadow: 1,
            borderRadius: 10,
            borderColor: "gray.300",
          })}
          padding="6"
        >
          <VStack
            width="100%"
            minWidth={isMobile ? "380px" : Dimensions.get("window").width * 0.9}
          >
            <FormControl isRequired>
              <Center>
                <Text
                  alignContent="center"
                  flex="1"
                  fontSize="2xl"
                  fontWeight="medium"
                >
                  Sign in
                </Text>
              </Center>
              <br />

              <InputWithLabel
                error={error?.path === "username" ? error?.message : undefined}
                value={username}
                label="Email or Phone"
                onChangeText={setUsername}
                style={{ paddingHorizontal: 20 }}
              />
              <br />

              <InputWithLabel
                error={error?.path === "password" ? error?.message : undefined}
                style={{ paddingHorizontal: 20 }}
                value={password}
                secureTextEntry={true}
                label="Password"
                onChangeText={setPassword}
              />
              <br />
              <Box flex={1}>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  isLoading={isLoading}
                  disabled={isLoading}
                  onPress={() => dispatch(loginAction({ username, password }))}
                >
                  Login
                </Button>
              </Box>
            </FormControl>
          </VStack>
        </Box>
      </Flex>
    </View>
  );
};

const EmailInput = () => {
  return <Box></Box>;
};

const PasswordInput = () => {
  return <Box></Box>;
};

const OtherAccountsInput = () => {
  return <Box></Box>;
};

export default LoginPage;
