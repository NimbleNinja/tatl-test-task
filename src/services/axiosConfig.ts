import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL
const CLASS_KEY = process.env.REACT_APP_CLASS_KEY

const lang = navigator.language

export const instance = axios.create({
  baseURL: `${BASE_URL}v1/${CLASS_KEY}/`,
  headers: {
    Authorization: 'Bearer MY_CUSTOM_BEARER_TOKEN',
    'Accept-Language': lang,
    'Content-Type': 'application/json'
  }
})
