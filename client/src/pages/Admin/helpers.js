import { api_token } from "../../config/index.json"
import { server_root_path } from "../../config/index.json"
export const fetchData = async (endpoint, params = null) => {
    const queryParams = params ? `?api_token=${api_token}&${params}` : `?api_token=${api_token}`;
    return await fetch(server_root_path + endpoint + queryParams).then((data) => data.json());
}