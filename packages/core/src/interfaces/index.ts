export interface BaseRequestOptionsType {
    method: string
    headers: HeadersInit
    responseType: ResponseType
    params?: AnyObject
    body?: AnyObject
    cache?: RequestCache
    credentials?: RequestCredentials
    timeout?: number
}

export interface BaseResponseType<T> {
    code: string
    data?: T
    message?: string
}

export interface ResponseResultType<T> {
    data: T
    status: number
    headers: AnyObject
    statusText: string
}

export enum ResponseType {
    JSON = 'JSON',
    TEXT = 'TEXT',
    BLOB = 'BLOB',
    ARRAYBUFFER = 'ARRAYBUFFER',
}
export interface AnyObject {
    [key: string]: any
}

export interface LocalStorageWithExpireValType {
    value: any
    expire: number
}
