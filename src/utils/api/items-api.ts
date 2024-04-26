/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getRestaurants = async (token: string) => {
  return await fetch(`${BASE_URL}/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const getRestaurant = async (token: string, id: string) => {
  return await fetch(`${BASE_URL}/rest/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
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

export const createRestaurant = async (token: string, data: any) => {
  return await fetch(`${BASE_URL}/rest/create`, {
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

export const importMenu = async (
  token: string,
  data: any,
  pathRest: string
) => {
  return await fetch(`${BASE_URL}/rest/importMenuData`, {
    method: 'POST',
    referrerPolicy: 'no-referrer-when-downgrade',
    referrer: `${document.location.origin}/${pathRest}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data
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
