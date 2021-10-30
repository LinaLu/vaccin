
interface RequestOptions {
    method: string,
    headers: Record<string, any>,
    body?: string
}

export function useFetchWrapper() {

    return {
        get: request('GET'),
        post: request('POST'),
        delete: request('DELETE')
    };

    function request(method: string) {
        return (url: any, body?: any) => {
            const requestOptions: RequestOptions = {
                method,
                headers: { "Account-ID": localStorage.getItem("ACCOUNT_ID") || "" }
            };

            if (body) {
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = JSON.stringify(body);
            }

            return fetch(url, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        return Promise.reject("incorrect response code");
                    }
                    return response
                })
                .then(response => response.json());
        }
    }
}