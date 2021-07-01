import axios from "axios";

export const fetchPosts = () => axios('https://jsonplaceholder.typicode.com/posts')

export const fetchUser = userId => axios(`https://jsonplaceholder.typicode.com/users/${userId}`)

export const savePost = post => axios.put(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post)
