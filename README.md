# Split App - Expense Sharing API

A RESTful API for expense sharing between groups of people, similar to Splitwise. Built with Node.js, Express, and MongoDB.

## Features

- Track shared expenses
- Support for different types of splits (equal, exact, percentage)
- Calculate balances and optimal settlements
- RESTful API design
- Input validation
- Error handling

## Prerequisites

- Node.js v14+
- MongoDB Atlas account
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `src` directory with the following content:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

4. Seed the database with test data:

```bash
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Expenses

#### GET /api/expenses

- Description: Get all expenses
- Response: List of all expenses

```json
{
  "success": true,
  "data": [
    {
      "_id": "expense_id",
      "amount": 600,
      "description": "Dinner",
      "paid_by": "Shantanu",
      "split_type": "equal",
      "splits": [...],
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "message": "Expenses retrieved successfully"
}
```

#### POST /api/expenses

- Description: Create a new expense
- Body:

```json
{
  "amount": 600,
  "description": "Dinner",
  "paid_by": "Shantanu",
  "split_type": "equal",
  "splits": [
    { "person": "Shantanu" },
    { "person": "Sanket" },
    { "person": "Om" }
  ]
}
```

#### PUT /api/expenses/:id

- Description: Update an existing expense
- Parameters: id (expense ID)
- Body: Same as POST /api/expenses

#### DELETE /api/expenses/:id

- Description: Delete an expense
- Parameters: id (expense ID)

### People and Balances

#### GET /api/people

- Description: Get list of all people involved in expenses
- Response: Array of person names

#### GET /api/balances

- Description: Get everyone's current balance
- Response:

```json
{
  "success": true,
  "data": [
    {
      "person": "Shantanu",
      "amount": 100.5
    }
  ],
  "message": "Balances calculated successfully"
}
```

#### GET /api/settlements

- Description: Get optimized settlement plan
- Response:

```json
{
  "success": true,
  "data": [
    {
      "from": "Om",
      "to": "Shantanu",
      "amount": 50.25
    }
  ],
  "message": "Settlements calculated successfully"
}
```

## Split Types

1. **Equal Split**

   - Divides expense equally among participants
   - Default if split_type not specified

2. **Exact Split**
   - Each participant pays an exact amount
   - Sum of splits must equal total amount

```json
{
  "amount": 15000,
  "description": "Room rent",
  "paid_by": "Shantanu",
  "split_type": "exact",
  "splits": [
    { "person": "Shantanu", "amount": 6000 },
    { "person": "Sanket", "amount": 6000 },
    { "person": "Om", "amount": 3000 }
  ]
}
```

3. **Percentage Split**
   - Each participant pays a percentage of total
   - Percentages must sum to 100

```json
{
  "amount": 1000,
  "split_type": "percentage",
  "splits": [
    { "person": "Shantanu", "percentage": 50 },
    { "person": "Sanket", "percentage": 30 },
    { "person": "Om", "percentage": 20 }
  ]
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Validation errors if applicable
}
```

Common HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 404: Not Found
- 500: Server Error

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run seed` - Seed database with test data

## Test Data

The seed script includes test data with:

- Dinner (₹600) paid by Shantanu
- Groceries (₹450) paid by Sanket
- Petrol (₹300) paid by Om
- Movie (₹500) paid by Shantanu
- Pizza (₹280) paid by Sanket

## Deployment

Link:- https://yelpcamp-izx5.onrender.com

Postman Collection link :- https://.postman.co/workspace/My-Workspace~67faf694-0fe6-4c22-857f-67f4ae830565/collection/35577019-8dcb8dc6-82c9-4c07-bf2e-6a04c914ac16?action=share&creator=35577019&active-environment=35577019-c33aa7f4-643e-4040-baea-1d644d4b279a

## Contributing

Feel free to open issues and submit pull requests.
