/**
 * usbApi.js
 * ---------
 * Standalone Axios instance for the USB Spring Boot service.
 * No JWT, no auth headers, no 401 refresh logic.
 *
 * Set VITE_USB_API_BASE_URL in .env:
 *   VITE_USB_API_BASE_URL=http://192.168.0.44:8080
 */

import axios from 'axios'

const usbApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.44:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

// Optional: log requests in dev for debugging
if (import.meta.env.DEV) {
  usbApi.interceptors.request.use(config => {
    console.log('[usbApi]', config.method?.toUpperCase(), config.baseURL + config.url)
    console.log('[usbApi] body:', config.data)
    return config
  })
}

export default usbApi