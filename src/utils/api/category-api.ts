/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getAdmin = async (token: string, id: string) => {
  return await fetch(`${BASE_URL}/admin/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const getAllCategories = async () => {
  return await fetch(`${BASE_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const createAdmin = async (token: string, data: any) => {
  return await fetch(`${BASE_URL}/admin/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...data
    })
  }).then(async (res) => await handleResponse(res))
}

export const deleteAdmin = async (token: string, id: string) => {
  return await fetch(`${BASE_URL}/admin/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateAdmin = async (token: string, data: any) => {
  return await fetch(`${BASE_URL}/admin/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...data
    })
  }).then(async (res) => await handleResponse(res))
}

export const updateAdminPassword = async (token: string, data: any) => {
  return await fetch(`${BASE_URL}/admin/resetPassword`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...data
    })
  }).then(async (res) => await handleResponse(res))
}
