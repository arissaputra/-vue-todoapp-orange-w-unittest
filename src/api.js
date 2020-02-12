import axios from "axios";
const baseUrl = "https://cdc-todo-be.herokuapp.com"

function extractData(response) {  
  return response.data;
}

function handleErr(err) {
  return err.response.data;
}

export function getTodos() {
  return axios.get(`${baseUrl}/tasks/`).then(extractData).catch(handleErr);
}

export function storeTodo(form) {
  return axios.post(`${baseUrl}/tasks/`, form).then(extractData).catch(handleErr);
}

export function updateTodo(todo_id, form) {
  return axios.patch(`${baseUrl}/tasks/${todo_id}`, form).then(extractData).catch(handleErr);
}

export function deleteTodo(todo_id) {
  return axios.delete(`${baseUrl}/tasks/${todo_id}`).then(extractData).catch(handleErr);
}

export function uploadSnapshot(todo_id, formData) {
  return axios.post(`${baseUrl}/tasks/${todo_id}/complete`, formData).then(extractData).catch(handleErr);
}

export function login(credentials) {
  return axios.post(`${baseUrl}/auth/signin`, credentials).then(extractData).catch(handleErr);
}

export function signup(credentials) {
  return axios.post(`${baseUrl}/auth/signup`, credentials).then(extractData).catch(handleErr);
}

export function parseJWT(token) {
  const userJSON = atob(token.split(".")[1]);
  return JSON.parse(userJSON);
}

export function setToken(newToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
}