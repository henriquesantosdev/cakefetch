import Nanofetch from 'nanofetch'

const api = new Nanofetch({
  baseUrl: 'http://localhost:3000/'
})

//uso do interceptor do request
api.addRequestInterceptor((config) => {
  config.headers.Authorization = "Bearer {token}"
  console.log(config)
  return config
})

// uso do interceptor do response
api.addResponseInterceptor(async response => {
  if (!response.ok) {
    return Promise.reject(new Error(`Erro na requisição: ${response.status}`));
  }
  const alterResponse = await response.json()
  alterResponse.data = {
    ...alterResponse.data,
    teste: 'teste'
  }
  return new Response(JSON.stringify(alterResponse));
});

// Requisicao get
const fetchGet = async () => {
  try {
    const response = await api.get('users')
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

// Requisicao post
const fetchPost = async () => {
  try {
    const response = await api.post('users', {
      email: "testelib14@gmail.com",
      password: "senha1234"
    })
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

// Requisicao put
const fetchPut = async () => {
  try {
    const response = await api.put('users/fb620954-1cd6-42b3-9043-b42e4c9d4849', {
      email: "testefinal2@gmail.com",
      password: "fernando1234"
    })
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

// Requisicao patch
const fetchPatch = async () => {
  try {
    const response = await api.patch('users/1dbf9800-185d-4527-a165-4c62c3fb921e', {
      email: "testefinal@gmail.com",
      password: "patch1234"
    })
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

// Requisicao delete
const fetchDelete = async () => {
  try {
    const response = await api.delete('users/1dbf9800-185d-4527-a165-4c62c3fb921e')
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

// fetchGet()
// fetchPost()
// fetchPut()
// fetchPatch()
// fetchDelete()