/**
 * deviceService.js
 * ----------------
 * Device listing, detail, update, delete, and scan operations.
 */

import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../constants/api'
import { normaliseError } from '../utils/apiError'

export const deviceService = {

  /**
   * getAll(params)
   * Fetch paginated device list.
   * params: { page, size, search, status, branch }
   */
  getAll: async (params = {}) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.DEVICES.LIST, { params })
      return data // { content: [], totalElements, totalPages, ... }
    } catch (err) {
      throw normaliseError(err)
    }
  },

  /**
   * getById(id)
   * Fetch a single device's full details.
   */
  getById: async (id) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.DEVICES.BY_ID(id))
      return data
    } catch (err) {
      throw normaliseError(err)
    }
  },

  /**
   * update(id, payload)
   * Update device metadata (name, branch, policy assignment, etc.)
   */
  update: async (id, payload) => {
    try {
      const { data } = await axiosInstance.put(API_ENDPOINTS.DEVICES.UPDATE(id), payload)
      return data
    } catch (err) {
      throw normaliseError(err)
    }
  },

  /**
   * delete(id)
   * Remove a device from management.
   */
  delete: async (id) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.DEVICES.DELETE(id))
    } catch (err) {
      throw normaliseError(err)
    }
  },

  /**
   * triggerScan(id)
   * Push an on-demand scan to the device agent.
   */
  triggerScan: async (id) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.DEVICES.SCAN(id))
      return data
    } catch (err) {
      throw normaliseError(err)
    }
  },
}