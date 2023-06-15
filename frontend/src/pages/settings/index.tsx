import { AppLoader } from "@imolla/components"
import InputWithLabel from "@imolla/components/InputBox/InputWithLabel"
import { useAppDispatch } from "@imolla/hooks"
import { network, Notification } from "@imolla/services"
import { Box, Divider, Heading, useBreakpointValue, VStack, Text, Stack, Button } from "native-base"
import { FC, Fragment, useEffect, useState } from "react"
import { TagsInput } from "react-tag-input-component"


interface SettingsPageInterface { }
const SettingsPage: FC<SettingsPageInterface> = (): JSX.Element => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [pageLoading, setPageLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<{ message?: string, path?: string }>({ message: "", path: "" })

    const [showKey, setShowKey] = useState(false)
    const [WG_PUBLIC_KEY, setWG_PUBLIC_KEY] = useState("")
    const [WG_PRIVATE_KEY, setWG_PRIVATE_KEY] = useState("")
    const [WG_ENDPOINT, setWG_ENDPOINT] = useState("")
    const [WG_PORT, setWG_PORT] = useState("")
    const [WG_DNS_IP, setWG_DNS_IP] = useState<string[]>([])
    const [WG_IPV4_NETWORK, setWG_IPV4_NETWORK] = useState<string[]>([])
    const [WG_MTU, setWG_MTU] = useState("")
    const [WG_PERSISTENT_KEEPALIVE, setWG_PERSISTENT_KEEPALIVE] = useState("")
    const [WG_POST_UP, setWG_POST_UP] = useState("")
    const [WG_POST_DOWN, setWG_POST_DOWN] = useState("")


    useEffect(() => {
        getSettingsData()
        return () => { }
    }, [])

    const getSettingsData = () => {
        setPageLoading(true)
        network.post("/settings").then(({ data: { data, status, error } }) => {
            if (status === "success") {
                setWG_PUBLIC_KEY(data?.WG_PUBLIC_KEY)
                setWG_PRIVATE_KEY(data?.WG_PRIVATE_KEY)
                setWG_IPV4_NETWORK(Array.isArray(data?.WG_IPV4_NETWORK) ? data?.WG_IPV4_NETWORK : [])
                setWG_DNS_IP(Array.isArray(data?.WG_DNS_IP) ? data?.WG_DNS_IP : [])
                setWG_PORT(data?.WG_PORT)
                setWG_MTU(data?.WG_MTU)
                setWG_ENDPOINT(data?.WG_ENDPOINT)
                setWG_PERSISTENT_KEEPALIVE(data?.WG_PERSISTENT_KEEPALIVE)
                setWG_POST_UP(data?.WG_POST_UP)
                setWG_POST_DOWN(data?.WG_POST_DOWN)
            } else {

            }
            console.log(data)
            setPageLoading(false)
        }).catch(() => {
            setError({ message: "Server Error", path: "server" })
            setPageLoading(false)
        })
    }

    const updateSettingsData = () => {
        setLoading(true)
        network.post("/settings/update", { WG_MTU, WG_POST_DOWN, WG_POST_UP, WG_IPV4_NETWORK, WG_DNS_IP, WG_PORT, WG_ENDPOINT, WG_PERSISTENT_KEEPALIVE }).then(({ data: { data, status, error } }) => {
            console.log(data)
            if (status === "success") {
                Notification.fire({ title: "Success", icon: "success" })
            } else {
                setError(error)
                Notification.fire({ title: "Error", text: error.message, icon: "error" })
            }
            setLoading(false)
        }).catch(() => {
            setLoading(false)
            setError(error)
            Notification.fire({ title: "Error", text: error.message, icon: "error" })
        })
    }

    const generateKeyPair = () => {
        network.post("/settings/generatenewkeys", {}).then(({ data: { data, status, error } }) => {
            if (status === "success") {
                setWG_PUBLIC_KEY(data?.WG_PUBLIC_KEY)
                setWG_PRIVATE_KEY(data?.WG_PRIVATE_KEY)
                setShowKey(true)
                Notification.fire({ title: "Success", icon: "success" })
            } else {
                setError(error)
                Notification.fire({ title: "Error", text: error.message, icon: "error" })
            }
        }).catch(() => {
            setError(error)
            Notification.fire({ title: "Error", text: error.message, icon: "error" })
        })
    }

    return (
        <Box m={3} height="100%">
            {pageLoading ? (
                <Fragment>
                    <AppLoader full />
                </Fragment>
            ) : (
                <Box>
                    <Box>
                        <Text>Settings</Text>
                    </Box>
                    <br />
                    {error?.path === "server" ? (
                        <Fragment>
                            {error?.message}
                        </Fragment>
                    ) : (
                        <Stack flexDirection={["column", "column", "row"]} rounded="lg">
                            <VStack space="4" divider={<Divider />} backgroundColor="white" m={2} rounded={10} flex={1}>
                                <Box px="4" pt="4">
                                    <Heading size="md">Wireguard General Config</Heading>
                                </Box>
                                <Box px="4">
                                    <Box flexDirection={["column", "column", "row"]}>
                                        <Box flex={1}>
                                            <InputWithLabel
                                                // error={error?.path === "username" ? error?.message : undefined}
                                                value={WG_ENDPOINT}
                                                label="Public Ip Address"
                                                onChangeText={setWG_ENDPOINT}
                                                style={{ paddingHorizontal: 20 }}
                                            />
                                        </Box>
                                        <Box w={2} h={5} />
                                        <Box>
                                            <InputWithLabel
                                                value={WG_PORT}
                                                label="WG Port"
                                                onChangeText={(e) => setWG_PORT(e?.toString())}
                                                style={{ paddingHorizontal: 20, maxWidth: 120 }}
                                            />
                                        </Box>
                                    </Box>

                                    <br />
                                    <div className="mb-2">
                                        <Text>Server Interface Addresses</Text>
                                        <TagsInput
                                            value={WG_IPV4_NETWORK || []}
                                            onChange={(txt) => setWG_IPV4_NETWORK(txt)}
                                            name="ipallocations"
                                            placeHolder="Server Interface Addresses"
                                        />
                                    </div>
                                    <br />

                                    <div className="mb-2">
                                        <Text>DNS addresses</Text>
                                        <TagsInput
                                            value={WG_DNS_IP || []}
                                            onChange={(txt) => setWG_DNS_IP(txt)}
                                            name="WG_DNS_IP"
                                            placeHolder="Enter default DNS"
                                        />
                                    </div>

                                    <br />
                                    <Box flexDirection={["column", "column", "row"]} flex={1}>
                                        <Box flex={1}>
                                            <InputWithLabel
                                                label="MTU"
                                                onChangeText={(e) => setWG_MTU(e.toString())}
                                                value={WG_MTU}
                                                style={{ paddingHorizontal: 20 }}
                                            />
                                        </Box>
                                        <Box w={2} h={5} />
                                        <Box>
                                            <InputWithLabel
                                                label="Keepalive"
                                                onChangeText={(e) => setWG_PERSISTENT_KEEPALIVE(e?.toString())}
                                                value={WG_PERSISTENT_KEEPALIVE}
                                                style={{ paddingHorizontal: 20 }}
                                            />
                                        </Box>
                                    </Box>
                                    <br />
                                    <Box>
                                        <InputWithLabel
                                            label="WG PostUp"
                                            onChangeText={(e) => setWG_POST_UP(e.toString())}
                                            value={WG_POST_UP}
                                            style={{ paddingHorizontal: 20 }}
                                        />
                                    </Box>
                                    <br />
                                    <Box>
                                        <InputWithLabel
                                            label="WG PostDown"
                                            onChangeText={(e) => setWG_POST_DOWN(e.toString())}
                                            value={WG_POST_DOWN}
                                            style={{ paddingHorizontal: 20 }}
                                        />
                                    </Box>
                                </Box>
                                <Box px="4" pb="4">
                                    <Box flexDirection="row">
                                        <Button isLoading={loading} disabled={loading} onPress={() => updateSettingsData()}>Update</Button>
                                    </Box>
                                </Box>
                            </VStack>

                            <VStack space="4" divider={<Divider />} backgroundColor="white" m={2} rounded={10} {...isMobile ? {} : { flex: 1 }}>
                                <Box px="4" pt="4">
                                    <Heading size="md">Key Pair</Heading>
                                </Box>
                                <Box px="4">
                                    <Box flex={1}>
                                        <InputWithLabel
                                            secureTextEntry={showKey}
                                            disabled={true}
                                            // error={error?.path === "username" ? error?.message : undefined}
                                            value={WG_PRIVATE_KEY}
                                            label="Private Key"
                                            onChangeText={(e) => setWG_PRIVATE_KEY(e.toString())}
                                            style={{ paddingHorizontal: 20 }}
                                        />
                                    </Box>
                                    <br />
                                    <Box flex={1}>
                                        <InputWithLabel
                                            // error={error?.path === "username" ? error?.message : undefined}
                                            value={WG_PUBLIC_KEY}
                                            label="Public Key"
                                            onChangeText={(e) => setWG_PUBLIC_KEY(e.toString())}
                                            style={{ paddingHorizontal: 20 }}
                                        />
                                    </Box>
                                    <br />
                                    <Box flexDir="row">
                                        <Button isLoading={loading} disabled={loading} backgroundColor="danger.400" onPress={() => generateKeyPair()}>Generate new Key</Button>
                                    </Box>
                                </Box>
                            </VStack>
                        </Stack>
                    )}
                </Box>
            )
            }
        </Box >
    )
}
export default SettingsPage