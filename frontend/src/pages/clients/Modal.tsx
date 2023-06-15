import { AppLoader } from "@imolla/components"
import { network } from "@imolla/services"
import { Modal, Box, Text, Button } from "native-base"
import { FC, useEffect, useState } from "react"


interface ClientModalInterface {
    closeModal: () => void
    isOpen: boolean
    onClose: () => void
    title: string
    type?: string
    item?: any
    removeClient: (id: string) => void
}
const ClientModal: FC<ClientModalInterface> = ({ removeClient, closeModal, isOpen, onClose, title, type, item }) => {
    const [error, setError] = useState({ message: "", path: "" })
    const [loading, setLoading] = useState(false)
    const [qrcode, setQrcode] = useState("")

    const deleteClient = (id: string) => {
        setLoading(true)
        network.post("/clients/delete", { id }).then(({ data: { status, data, error } }) => {
            if (status === "success") {
                removeClient(data?.id?.toString())
                closeModal()
                setLoading(false)
            } else {
                setError(error)
                setLoading(false)
            }
        }).catch((err) => {
            setError({ message: err?.message || "server error", path: "" })
            setLoading(false)
        })
    }

    useEffect(() => {
        if (type === "qrcode") {
            setLoading(true)
            network.post("/clients/getqrcode", { id: item?.id?.toString() || "0" }).then(({ data: { status, data, error } }) => {
                if (status === "success") {
                    setQrcode(data?.qrcode || "")
                    setLoading(false)
                } else {
                    setError(error)
                    setLoading(false)
                }
            }).catch((err) => {
                setError({ message: err?.message || "server error", path: "" })
                setLoading(false)
            })
        }
    }, [closeModal, item?.id, type])



    return (
        <Modal isOpen={isOpen} onClose={onClose} avoidKeyboard size="md">
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                    {type === "qrcode" && (<Box alignItems="center" flex={1}>
                        {loading && qrcode === "" ? (<AppLoader />) : (
                            <img alt={item?.name + " QrCode"} src={qrcode} style={{ maxWidth: 300, maxHeight: 300, borderWidth: 0.7, borderColor: "black" }} height={"100%"} width={"100%"} />
                        )}
                    </Box>)}
                    {type === "delete" && (<Box>
                        <Text><b>Are you sure you want to delete the WireGuard peer?</b></Text><br />

                        <Text><b>Yes</b> - Clicking "Yes" will permanently remove the selected WireGuard peer from the configuration. This means that the peer's access to the VPN network will be revoked, and any connections established with this peer will be terminated. Please ensure that you have reviewed the implications of this action and have confirmed that it is indeed the desired course of action.</Text>
                    </Box>)}
                </Modal.Body>
                {type === "delete" && (<Modal.Footer>
                    <Button colorScheme="red" mr={3} onPress={() => deleteClient(item?.id?.toString() || "")}>Yes Delete</Button>
                    <Button onPress={() => closeModal()}>Cancel</Button>
                </Modal.Footer>)}

            </Modal.Content>
        </Modal >
    )
}
export default ClientModal