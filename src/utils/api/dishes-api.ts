/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getDishes = async () => {
  return await fetch(`${BASE_URL}/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const getDish = async (id: string) => {
  return await fetch(`${BASE_URL}/items/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateRestaurant = async (token: string, data: any) => {
  return await fetch(`${BASE_URL}/rest/update`, {
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

export const createDish = async (token: string, formData: any) => {
  return await fetch(`${BASE_URL}/items`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  }).then(async (res) => await handleResponse(res))
}

export const deleteRestaurant = async (token: string, id: string) => {
  return await fetch(`${BASE_URL}/rest/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
