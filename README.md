# FlashMind 🧠

A flashcard and quiz app built with Spring Boot (Java) and React.

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.5, REST API
- **Frontend:** React, JavaScript, Tailwind CSS
- **Data Structure:** Stack-based card engine

## Features
- Create, view, and delete flashcard decks
- Stack-based card shuffling algorithm
- Quiz mode with score tracking
- Clean, responsive UI

## Getting Started

### Backend
```bash
cd flashmind
./mvnw spring-boot:run
```
Server runs on `http://localhost:8080`

### Frontend
```bash
cd flashmind-client
npm install
npm start
```
App runs on `http://localhost:3000`

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards` | Get all flashcards |
| POST | `/api/cards` | Create a flashcard |
| DELETE | `/api/cards/{id}` | Delete a flashcard |