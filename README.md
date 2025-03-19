# Nanofetch

![npm](https://img.shields.io/npm/v/nanofetch)
![license](https://img.shields.io/npm/l/nanofetch)
![build](https://img.shields.io/github/actions/workflow/status/seu-usuario/nanofetch/ci.yml)

Nanofetch é uma biblioteca leve para fazer requisições HTTP baseada no `fetch`, facilitando o consumo de APIs REST com um wrapper simples e intuitivo.

## Instalação

Instale o Nanofetch via npm ou yarn:

```sh
npm install nanofetch
# ou
yarn add nanofetch
```

## Uso

### Criando uma instância

```javascript
import Nanofetch from 'nanofetch'

const api = new Nanofetch({
  baseUrl: 'https://apiurl.com/'
})
```

### Realizando requisiões

#### GET
```javascript
const fetchGet = async () => {
  try {
    const response = await api.get('users')
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}
fetchGet()
```

#### POST
```javascript
const fetchPost = async () => {
  try {
    const response = await api.post('users', {
      email: "useremail@domain.com",
      password: "password1234"
    })
    return response
  } catch (error) {
    console.error(error)
  }
}
fetchPost()
```

#### PUT
```javascript
const fetchPut = async () => {
  try {
    const response = await api.put('users/1284ce1d-f69e-4287-87f4-815de61cbc22', {
      email: "useremail@domain.com",
      password: "password1234"
    })
    return response
  } catch (error) {
    console.error(error)
  }
}
fetchPut()
```

#### PATCH
```javascript
const fetchPatch = async () => {
  try {
    const response = await api.patch('users/1284ce1d-f69e-4287-87f4-815de61cbc22', {
      email: "useremail@domain.com",
      password: "password1234"
    })
    return response
  } catch (error) {
    console.error(error)
  }
}
fetchPatch()
```

#### DELETE
```javascript
const fetchDelete = async () => {
  try {
    const response = await api.delete('users/1284ce1d-f69e-4287-87f4-815de61cbc22')
    return response
  } catch (error) {
    console.error(error)
  }
}
fetchDelete()
```

## Interceptors

### Request
```javascript
api.addRequestInterceptor((config) => {
  config.headers.Authorization = "Bearer {token}"
  console.log(config)
  return config
})

```

### Response
```javascript
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

```

## Contribuição

Contribuições são bem-vindas! Para contribuir:
1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Envie para o repositório remoto (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ por [Henrique Santos](https://github.com/henriquesantosdev).
