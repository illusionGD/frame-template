import { AnyObject, BaseRequestOptionsType } from '../interfaces'
import ajax from './ajax'
import fetchRequest from './fetch'
import jsonp from './jsonp'

export * from './ajax'
export * from './fetch'
export * from './jsonp'


export class Http {
    /** 是否支持fetch */
    supportFetch = true

    constructor() {
        this.supportFetch = !!window.fetch
    }

    async get<T>(url: string, params?: AnyObject) {
        const method = 'GET'
        if (this.supportFetch) {
            const { data } = await fetchRequest<T>(url, {
                method,
                params,
            })
            return data
        } else {
            const { data } = await ajax<T>(url, {
                method,
                params,
            })

            return data
        }
    }

    async post<T>(url: string, body: AnyObject, opts?: BaseRequestOptionsType) {
        const method = 'POST'
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        }
        const options = {
            method,
            headers,
            body,
        }

        if (opts) {
            Object.assign(options, opts)
        }

        if (this.supportFetch) {
            const { data } = await fetchRequest<T>(url, options)
            return data
        } else {
            const { data } = await ajax<T>(url, options)
            return data
        }
    }

    jsonp = jsonp
}

export const http = new Http()
