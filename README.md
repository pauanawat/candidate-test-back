# Candidate Test Back

This project is hosted at [https://candidate-test-backend-3aaa43f87169.herokuapp.com](https://candidate-test-backend-3aaa43f87169.herokuapp.com)

You can test api path [/checkHealth](https://candidate-test-backend-3aaa43f87169.herokuapp.com/checkHealth)

## Getting Started with the App Locally

### Prerequisites

Before you begin, ensure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/pauanawat/candidate-test-back.git

2. Navigate to the project directory:

   ```bash
   cd candidate-test-backend
   
3. Install the project dependencies:

   ```bash
   npm install
   
4. Build the App:

   ```bash
   npx tsc

### Running the App

- Running the App using npm command:

   ```bash
   node .\dist\src\app.js

- Running the App using docker:

   - Build docker image:
      ```bash
      docker build -t backend .

   - Run docker container:
      ```bash
      docker run -p 3001:3001 --name backend backend


This project will be running in local at [http://localhost:3001](http://localhost:3001)

You can test api path [/checkHealth](http:localhost:3001/checkHealth)

You can use swagger at path [/api-docs](http://localhost:3001/api-docs)
