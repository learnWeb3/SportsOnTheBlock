import { api_token } from "../../config/index.json"
export const fetchData = async (url) => await fetch(url + `?api_token=${api_token}`).then((data) => data.json());