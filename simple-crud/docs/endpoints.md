# Simple CRUD API Endpoints

This document describes the basic endpoints available in the `simple-crud` application.

## Endpoints

### 1. `GET /items`
Retrieves all items.
- **Method:** `GET`
- **Response:** `200 OK`
- **Body:** `Array<Item>`
  ```json
  [
    {
      "id": "1635790000000",
      "name": "Apple",
      "description": "A fresh apple",
      "price": 10
    }
  ]
  ```

### 2. `GET /items/:id`
Retrieves a single item by its ID.
- **Method:** `GET`
- **Parameters:** `id` (string)
- **Response:** `200 OK` | `404 Not Found`
- **Body:** `Item`
  ```json
  {
    "id": "1635790000000",
    "name": "Apple",
    "description": "A fresh apple",
    "price": 10
  }
  ```

### 3. `POST /items`
Creates a new item.
- **Method:** `POST`
- **Body:** `Omit<Item, 'id'>`
  ```json
  {
    "name": "Banana",
    "description": "A ripe banana",
    "price": 5
  }
  ```
- **Response:** `201 Created`
- **Body:** `Item` (the created item including generated ID)

### 4. `PUT /items/:id`
Updates an existing item completely or partially.
- **Method:** `PUT`
- **Parameters:** `id` (string)
- **Body:** `Partial<Item>`
  ```json
  {
    "price": 8
  }
  ```
- **Response:** `200 OK` | `404 Not Found`
- **Body:** `Item` (the updated item)

### 5. `DELETE /items/:id`
Deletes an item by its ID.
- **Method:** `DELETE`
- **Parameters:** `id` (string)
- **Response:** `200 OK` | `404 Not Found`
