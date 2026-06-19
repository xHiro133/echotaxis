export interface Api {
    selector: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    delay?: number;
}

export interface ApiOptions {
    body?: any;
    headers?: { [header: string]: string | string[] };
    params?: { [param: string]: string | string[] };
    queryParams?: { [queryParam: string]: string | string[] };
}