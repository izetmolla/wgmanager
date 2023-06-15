import { Box, Button, Switch, Text } from "native-base"
import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UserTypes } from "."
import InputWithLabel from "@imolla/components/InputBox/InputWithLabel"
import { network } from "@imolla/services"


interface EditClientPageInterface { }
const EditClientPage: FC<EditClientPageInterface> = (): JSX.Element => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({ message: "", path: "" })
    const [fields, setFields] = useState<UserTypes>({ password: "", username: "", isAdmin: false, roles: [{ value: "admin", text: "admin" }, { value: "user", text: "user" }], fullname: "", connections: 0, email: "", status: 0 })



    useEffect(() => {
        network.post("/users/single", { id }).then(({ data: { status, data, error } }) => {
            console.log(data)
        }).catch((err) => {
            console.log(err)
        })
    }, [id])

    
    const updateUser = () => { }

    return (
        <Box m={3} _light={{ backgroundColor: "white" }} minHeight="100vh" rounded={2}>
            <Box flexDir="row" justifyContent="space-between" m={2}>
                <Text>Edit User</Text>
                <Button onPress={() => navigate("/users/add")}>Add New</Button>
            </Box>
            <Box flexDirection={["column", "column", "row"]} justifyContent="space-between">
                <Box flex={1} _light={{ backgroundColor: "white" }} p={5} rounded={10}>
                    <Box flex={1} mb={3}>
                        <InputWithLabel
                            error={error?.path === "fullname" ? error?.message : undefined}
                            value={fields.fullname}
                            label="User Fullname"
                            onChangeText={(fullname) => setFields({ ...fields, fullname })}
                            style={{ paddingHorizontal: 20 }}
                        />
                    </Box>
                    <br />
                    <Box flex={1} mb={3}>
                        <InputWithLabel
                            error={error?.path === "email" ? error?.message : undefined}
                            value={fields.email}
                            label="Email address"
                            onChangeText={(email) => setFields({ ...fields, email })}
                            style={{ paddingHorizontal: 20 }}
                        />
                    </Box>
                    <br />
                    <Box flex={1} mb={3}>
                        <InputWithLabel
                            error={error?.path === "username" ? error?.message : undefined}
                            value={fields.username}
                            label="Username"
                            onChangeText={(username) => setFields({ ...fields, username })}
                            style={{ paddingHorizontal: 20 }}
                        />
                    </Box>
                    <br />
                    <Box flex={1} mb={3}>
                        <InputWithLabel
                            secureTextEntry
                            error={error?.path === "password" ? error?.message : undefined}
                            value={fields.password}
                            label="Password"
                            onChangeText={(password) => setFields({ ...fields, password })}
                            style={{ paddingHorizontal: 20 }}
                        />
                    </Box>
                    <br />

                    <Box flex={1} flexDirection="row" mt={2} mb={3}>
                        <b>Is Administrator</b> <Switch ml={2} offTrackColor="indigo.100" onTrackColor="indigo.200" onThumbColor="indigo.500" offThumbColor="indigo.50" defaultIsChecked={fields?.isAdmin} onValueChange={() => setFields({ ...fields, isAdmin: !fields.isAdmin })} />
                    </Box>
                    <div>
                        <Button isLoading={loading} disabled={loading} color="primary" onPress={() => updateUser()}>Add Client</Button>
                    </div>



                </Box>
                <Box flex={1}></Box>
            </Box>


        </Box >
    )
}


export default EditClientPage