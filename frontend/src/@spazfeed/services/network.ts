import axios from "axios";
export const socketUrl = (window.location.protocol === "http:" ? "ws:" : "wss:") + "//" + window.location.host
// const LAYOUT_CONFIG_KEY = process.env.REACT_APP_BASE_LAYOUT_CONFIG_KEY || 'LayoutConfig'
const network = axios.create({
    baseURL: (process.env.REST_API || window.location.origin + "/api") + "",
    headers: {
        "Content-Type": "application/json",
    },
});

export const setAuthToken = (token: string | undefined) => {
    if (token) {
        network.defaults.headers.common["authorization"] = "Bearer " + token;
    } else {
        delete network.defaults.headers.common["authorization"];
    }
};








export function refreshAccessToken(token: string | undefined) {
    return network.post((process.env.REST_API || window.location.origin + "/api") + '/refresh_token', {}, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })

}







export default network;