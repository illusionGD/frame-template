import { isInvalidVal } from './index'
import { LocalStorageWithExpireValType } from '../interfaces'
import { getCurrentTimeStamp, getFormatDate } from './date'

/**
 * 根据key获取localStorage
 * @param key
 * @returns
 */
export function getLocalStorage<T>(key: string): T {
    const val = localStorage.getItem(key) || ''
    return val ? JSON.parse(val) : val
}

/**
 * 设置localStorage
 * @param key
 * @param json
 */
export function setLocalStorage(
    key: string,
    json: Record<string, any> | string | number
): void {
    localStorage.setItem(key, JSON.stringify(json))
}

/**
 * 根据key清除对应的localStorage
 * @param key
 */
export function removeLocalStorage(key: string): void {
    localStorage.removeItem(key)
}

/**
 * 清除全部localStorage
 */
export function clearLocalStorage(): void {
    localStorage.clear()
}

/**
 * 设置localStorage（自带命名空间+自动过期时间）
 * @param key
 * @param value
 * @param expireTime 过期时间，单位ms
 */
export function setLocalItemWithExpire(
    key: string,
    value: string,
    expireTime: number
) {
    const currentTime = new Date().getTime()
    const expire = currentTime + expireTime
    const data = {
        value,
        expire,
        date: getFormatDate(expire),
    }
    setLocalStorage(key, data)
}

/**
 * 获取localStorage（自带命名空间+自动过期时间）
 * @param key
 */
export function getLocalItemWithExpire<T>(key: string): T | string {
    const data = getLocalStorage<any>(key)
    if (!data) {
        return ''
    }

    if (isWidthExpireVal(key)) {
        const currentTime = getCurrentTimeStamp()

        if (currentTime > data.expire) {
            removeLocalStorage(key)
            return ''
        }

        return data.value as T
    } else {
        return data
    }
}

/**
 * 清除已到过期时间的localStorage
 */
export function clearExpiredLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || ''
        console.log('🚀 ~ key:', key)
        if (isWidthExpireVal(key)) {
            const currentTime = getCurrentTimeStamp()
            const { expire } =
                getLocalStorage<LocalStorageWithExpireValType>(key)
            if (expire && currentTime > expire) {
                removeLocalStorage(key)
            }
        }
    }
}

/**是否有超时设置的val */
export function isWidthExpireVal(key: string) {
    const data = getLocalStorage<any>(key)
    if (!data) {
        return false
    }
    if (data instanceof Object && !isInvalidVal(data.expire)) {
        return true
    }
    return false
}
