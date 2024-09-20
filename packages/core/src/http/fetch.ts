/*
 * @Author: IT-hollow
 * @Date: 2024-05-10 22:14:01
 * @LastEditors: hollow
 * @LastEditTime: 2024-09-12 15:54:56
 * @Description: fetch请求封装
 *
 * Copyright (c) 2024 by efun, All Rights Reserved.
 */
import { BASE_REQUEST_OPTIONS } from '../constants'
import {
    BaseRequestOptionsType,
    ResponseResultType,
    ResponseType,
} from '../interfaces'
import { deepCloneObj, formatPostBody, isPlainObject, qsString } from '../utils'

const inital = BASE_REQUEST_OPTIONS

export default async function fetchRequest<T>(
    url: string,
    config?: Partial<BaseRequestOptionsType>
): Promise<ResponseResultType<T>> {
    if (typeof url !== 'string')
        throw new TypeError('url must be required and of string type')
    const options = deepCloneObj<BaseRequestOptionsType>(inital)

    Object.assign(options, config || {})

    const { method, params, body, headers, cache, credentials, responseType } =
        options

    if (params != null) {
        const paramsStr = qsString(params)
        url += `${url.includes('?') ? '' : '?'}${paramsStr}`
    }

    const bodyInit = {
        method: method?.toUpperCase(),
        headers,
        credentials,
        cache,
    }

    if (/^(POST|PUT|PATCH)$/i.test(method) && body != null) {
        if (isPlainObject(body)) {
            bodyInit['body'] = formatPostBody(
                body,
                headers['Content-Type']
            ) as BodyInit
        }
    }

    try {
        const req = await fetch(url, bodyInit)
        const { status, statusText } = req
        const result = {
            data: null,
            status,
            statusText,
            headers: {},
        }

        if (status >= 200 && status < 400) {
            switch (responseType.toUpperCase()) {
                case ResponseType.JSON:
                    result.data = await req.json()
                    break
                case ResponseType.TEXT:
                    result.data = await req.text()
                    break
                case ResponseType.BLOB:
                    result.data = await req.blob()
                    break
                case ResponseType.ARRAYBUFFER:
                    result.data = await req.arrayBuffer()
                    break
            }
        }
        return result
    } catch (error) {
        console.log('fetch请求错误:', error)
        // return error as any
    }
}
