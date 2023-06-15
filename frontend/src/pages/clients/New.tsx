import { AppLoader } from "@imolla/components"
import InputWithLabel from "@imolla/components/InputBox/InputWithLabel"
import { network, Notification } from "@imolla/services"
import { Box, Text, Button, Center } from "native-base"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { TagsInput } from "react-tag-input-component"

const NewClientPage = () => {
    const navigate = useNavigate()
    const [pageLoading, setPageLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({ message: "", path: "" })
    const [name, setName] = useState("")
    const [ipAllocation, setIpAllocation] = useState<string[]>([])
    const [dnsServerIps, setDnsServerIps] = useState<string[]>([])
    const [allowedIps, setAllowedIps] = useState<string[]>([])


    useEffect(() => {
        network.post("/clients/newclientdata").then(({ data: { data, status, error } }) => {
            if (status === "success") {
                setAllowedIps(data?.allowedIps || [])
                setDnsServerIps(data?.dnsServerIps || [])
                setIpAllocation(data?.ipAllocation || [])
            } else {
                setError(error)
                Notification.fire({ title: "Error", text: error.message, icon: "error" })
            }
            console.log({ data, error })
            setPageLoading(false)
        }).catch(() => {
            setPageLoading(false)
            setError({ message: "Server Error", path: "" })
            Notification.fire({ title: "Server Error", icon: "error" })
        })
        return () => { }
    }, [])



    const onIpSubmit = (type: string, ips: string[]) => {
        console.log(ips)
        if (type === "ipAllocation") {
            // network.post("/checkips", { type: "1", ips }).then(({ data }) => {
            //     console.log("DD", data)
            // })
            setIpAllocation(ips)
        }
        if (type === "allowedIps") {
            setAllowedIps(ips)
        }
        if (type === "dnsServerIps") {
            setDnsServerIps(ips)
        }
    }

    const createClient = () => {
        setLoading(true)
        network.post("/clients/create", { name, ipAllocation, dnsServerIps, allowedIps }).then(({ data: { data, status, error } }) => {
            console.log({ data, error, status })
            if (status === "success") {
                navigate("/clients/edit/" + data.client_id, { state: data?.client })
            } else {
                if (error?.path === "") {
                    Notification.fire({ title: "Error", text: error.message })
                } else setError(error)
            }
            setLoading(false)
        }).catch(() => {
            setLoading(false)
            Notification.fire({ title: "Server Error", icon: "error" })
        })
    }

    return (
        <Box m={3} minHeight="100vh" rounded={2} flex={1}>
            <Box flexDir="row" justifyContent="space-between" m={2}>
                <Text>New Client</Text>
            </Box>

            {pageLoading ? (
                <>
                    <AppLoader full />
                </>
            ) : (
                <Box flexDirection={["column", "column", "row"]} justifyContent="space-between">
                    <Box flex={1} _light={{ backgroundColor: "white" }} p={5} rounded={10}>
                        <Box flex={1}>
                            <InputWithLabel
                                error={error?.path === "name" ? error?.message : undefined}
                                value={name}
                                label="Client Name"
                                onChangeText={setName}
                                style={{ paddingHorizontal: 20 }}
                            />
                        </Box>
                        <br />
                        <div className="mb-3">
                            <Text>Ip Allocations</Text>
                            <Box {...(error?.path === "ipAllocation") ? { borderWidth: 2, borderColor: "red.800" } : {}}>
                                <TagsInput
                                    disabled={loading}
                                    value={ipAllocation || []}
                                    onChange={(txt) => onIpSubmit("ipAllocation", txt)}
                                    name="ipallocations"
                                    placeHolder="Enter Ip Allocations"
                                />
                            </Box>
                            {error?.path === "ipAllocation" && <Text color="red.800">{error?.message}</Text>}
                        </div>
                        <br />
                        <div className="mb-3">
                            <Text>Allowed IPs</Text>
                            <Box {...(error?.path === "allowedIps") ? { borderWidth: 2, borderColor: "red.800" } : {}}>
                                <TagsInput
                                    disabled={loading}
                                    value={allowedIps || []}
                                    onChange={(txt) => onIpSubmit("allowedIps", txt)}
                                    name="allowedips"
                                    placeHolder="Enter Allowed Ip's"
                                />
                            </Box>
                            {error?.path === "allowedIps" && <Text color="red.800">{error?.message}</Text>}
                        </div>
                        <br />
                        <div className="mb-3">
                            <Text>DNS Server Ip's</Text>
                            <Box {...(error?.path === "dnsServerIps") ? { borderWidth: 2, borderColor: "red.800" } : {}}>
                                <TagsInput
                                    disabled={loading}
                                    value={dnsServerIps || []}
                                    onChange={(txt) => onIpSubmit("dnsServerIps", txt)}
                                    name="extraallowedips"
                                    placeHolder="Enter DNS Ip's"
                                />
                            </Box>
                            {error?.path === "dnsServerIps" && <Text color="red.800">{error?.message}</Text>}
                        </div>
                        <br />
                        <div>
                            <Button isLoading={loading} disabled={loading} color="primary" onPress={() => createClient()}>Add Client</Button>
                        </div>



                    </Box>
                    <Box flex={1}></Box>
                </Box>
            )}

        </Box>
    )
}
export default NewClientPage