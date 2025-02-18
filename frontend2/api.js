import axios from "axios";

const URL = "http://localhost:3000"

export async function verifyUser(user) {
    const response = await axios.post(`${URL}/users/login`, user)
    if (response.data.success) {
        return response.data.token
    } else {
        return
    }
}