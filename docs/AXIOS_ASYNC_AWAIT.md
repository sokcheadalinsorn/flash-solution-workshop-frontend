# Axios and async/await – Brief 15

The React front end uses **Axios** to send HTTP requests to the **Java Spring Boot REST API**.

## 1. Install Axios

```bash
npm install axios
```

## 2. Example: retrieve products

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export async function getProducts() {
  const response = await api.get('/products')
  return response.data
}
```

## 3. What do `async` and `await` mean?

- `async` marks a function as asynchronous. It allows the function to use `await` and returns a Promise.
- `await` pauses that function until the Promise settles, so the next line can use the result.
- `api.get('/products')` sends an HTTP GET request to the Spring Boot API.
- `response.data` contains the response body returned by the API.

## 4. Example: use the service in a React component

```jsx
import { useEffect, useState } from 'react'
import { productApi } from '../services/api'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productApi.getAll()
        setProducts(data)
      } catch (error) {
        setError('Could not load products. Please try again.')
      }
    }

    loadProducts()
  }, [])

  if (error) return <p>{error}</p>

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

## Important for the current project

The storefront still uses sample data and browser local storage so the website can run before the Spring Boot backend is available. The Axios service layer is prepared for the developers to study and use when they implement API integration. Do not expect these API calls to return real data until the Spring Boot endpoints are running and the API URL/CORS settings are configured.
