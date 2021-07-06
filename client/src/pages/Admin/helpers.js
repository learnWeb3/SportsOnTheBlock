import { api_token } from "../../config/index.json"
export const fetchData = async (url, params) => await fetch(url + `?api_token=${api_token}&${params}`).then((data) => data.json());