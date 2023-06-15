import { AppLoader } from "@spazfeed/components"
import InputWithLabel from "@spazfeed/components/InputBox/InputWithLabel"
import { network } from "@spazfeed/services"
import { Box, Text, Button } from "native-base"
import { FC, useEffect, useState } from "react"
import { useLocation, useNavigation, useParams } from "react-router-dom"
import { TagsInput } from "react-tag-input-component"


interface EditClientPageInterface { }
const EditClientPage: FC<EditClientPageInterface> = (): JSX.Element => {
    const { state } = useLocation()
    const { id } = useParams()
    const [pageLoading, setPageLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({ message: "", path: "" })
    const [name, setName] = useState("")
    const [ipAllocation, setIpAllocation] = useState<string[]>([])
    const [dnsServerIps, setDnsServerIps] = useState<string[]>([])
    const [allowedIps, setAllowedIps] = useState<string[]>([])
    const [qrCode, setQrCode] = useState<string>("")


    useEffect(() => {
        setPageLoading(true)
        network.post("/clients/single", { id }).then(({ data: { data, status, error } }) => {
            setName(data?.client?.name)
            setIpAllocation(data?.client?.ipAllocation)
            setDnsServerIps(data?.client?.dnsServerIps)
            setAllowedIps(data?.client?.allowedIps)
            setQrCode(data.client.qrcode)
            setLoading(false)
            setPageLoading(false)
        }).catch((error) => {
            setError({ message: "Server Error", path: "" })
            setPageLoading(false)
        })
        return () => { }
    }, [id])



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

    const updateClient = () => {
        setLoading(true)
        network.post("/clients/update", { id, name, ipAllocation, dnsServerIps, allowedIps }).then(({ data: { data, status, error } }) => {
            if (status === "success") {

            } else {

            }
            console.log(data)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(true)
        })
    }



    return (
        <Box m={3} _light={{ backgroundColor: "white" }} minHeight="100vh" rounded={2} flex={1}>
            <Box flexDir="row" justifyContent="space-between" m={2}>
                <Text>Edit Client {state?.name}</Text>
                <Button>Add new</Button>
            </Box>
            {pageLoading ? (
                <AppLoader full />
            ) : (
                <Box m={3} height="100%">
                    <Box flexDirection={["column", "column", "row"]}>
                        <Box flex={1}>
                            <Box flex={1} _light={{ backgroundColor: "white" }} >
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
                                    <TagsInput
                                        disabled={loading}
                                        value={ipAllocation || []}
                                        onChange={(txt) => onIpSubmit("ipAllocation", txt)}
                                        name="ipallocations"
                                        placeHolder="Enter Ip Allocations"
                                    />
                                </div>
                                <br />
                                <div className="mb-3">
                                    <Text>Allowed IPs</Text>
                                    <TagsInput
                                        disabled={loading}
                                        value={allowedIps || []}
                                        onChange={(txt) => onIpSubmit("allowedIps", txt)}
                                        name="allowedips"
                                        placeHolder="Enter Allowed Ip's"
                                    />
                                </div>
                                <br />
                                <div className="mb-3">
                                    <Text>DNS Server Ip's</Text>
                                    <TagsInput
                                        disabled={loading}
                                        value={dnsServerIps || []}
                                        onChange={(txt) => onIpSubmit("dnsServerIps", txt)}
                                        name="extraallowedips"
                                        placeHolder="Enter DNS Ip's"
                                    />
                                </div>
                                <br />
                                <div>
                                    <Button isLoading={loading} disabled={loading} color="primary" onPress={() => updateClient()}>Update Client</Button>
                                </div>
                            </Box>
                        </Box>
                        <Box flex={1}>
                            <Box p={3} m={3} backgroundColor="white">
                                {qrCode && <img alt={name + " QrCode"} src={qrCode} height={250} width={250} style={{ borderWidth: 0.7, borderColor: "black" }} />}
                            </Box>
                        </Box>
                    </Box>

                </Box>
            )}

        </Box>
    )
}
export default EditClientPage