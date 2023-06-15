import { AppLoader } from "@spazfeed/components"
import { network } from "@spazfeed/services"
import { Modal, Box, Text, Button } from "native-base"
import { FC, useEffect, useState } from "react"


interface UserModalInterface {
    closeModal: () => void
    isOpen: boolean
    onClose: () => void
    title: string
    type?: string
    item?: any
    removeUser: (id: string) => void
}
const UserModal: FC<UserModalInterface> = ({ removeUser, closeModal, isOpen, onClose, title, type, item }) => {
    const [error, setError] = useState({ message: "", path: "" })
    const [loading, setLoading] = useState(false)

    const deleteUser = (id: string) => {
        setLoading(true)
        network.post("/users/delete", { id }).then(({ data: { status, data, error } }) => {
            if (status === "success") {
                removeUser(data?.id?.toString())
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} avoidKeyboard size="md">
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                    {type === "delete" && (<Box>
                        <Text><b>Are you sure you want to delete the user?</b></Text><br />

                        <Text><b>Yes</b> - Clicking "Yes" will permanently remove the selected user and clients created by this user.</Text>
                    </Box>)}
                </Modal.Body>
                {type === "delete" && (<Modal.Footer>
                    <Button isLoading={loading} disabled={loading} colorScheme="red" mr={3} onPress={() => deleteUser(item?.id?.toString() || "")}>Yes Delete</Button>
                    <Button onPress={() => closeModal()}>Cancel</Button>
                </Modal.Footer>)}

            </Modal.Content>
        </Modal >
    )
}
export default UserModal