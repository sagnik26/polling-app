# Polling App

## Overview

This is a simple polling application built using **React** and **Supabase**. Users can:

- Create polls with a question and multiple options.
- Vote on polls.
- View real-time poll results (auto-refresh every 5 seconds) with a LinkedIn-styleed percentage bar.

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Netlify (Frontend), Supabase (Backend)

## Features

- Users can create a poll with up to four options.
- Polls are stored in a Supabase database.
- Votes are recorded and updated in real-time.
- Poll results display percentage bars for each option, similar to LinkedIn.

## Database Schema

The following schema is used in Supabase:

## Table: `polls`

| Column Name  | Data Type | Constraints                               | Description                     |
| ------------ | --------- | ----------------------------------------- | ------------------------------- |
| `id`         | UUID      | Primary Key, Default: `gen_random_uuid()` | Unique identifier for each poll |
| `question`   | Text      | Not Null                                  | The poll question               |
| `options`    | JSONB     | Not Null                                  | Array of poll options           |
| `votes`      | JSONB     | Default: `[]`                             | Array of vote counts per option |
| `created_at` | Timestamp | Default: `now()`                          | Timestamp of poll creation      |

### SQL to create the table:

```sql
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    votes JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT now()
);
```

## API Endpoints

### 1. Fetch All Polls

_Method_ : `GET`
_Endpoint_: `/polls`
_Query_ :

```
const { data, error } = await supabase.from("polls").select("*").order("created_at", { ascending: false });
```

### 2. Create a Poll

_Method_ : `POST`
_Endpoint_: `/polls`
_Payload_ :

```
{
  "question": "What's your favorite programming language?",
  "options": ["JavaScript", "Python", "Go", "Rust"],
  "votes": [0, 0, 0, 0]
}
```

_Query_ :

```
await supabase.from("polls").insert([{ question, options, votes }]);
```

### 2. Vote a Poll

_Method_ : `PATCH`
_Endpoint_: `/polls/:id`
_Payload_ :

```
{
  "votes": [5, 3, 2, 1]
}
```

_Query_ :

```
await supabase.from("polls").update({ votes: newVotes }).eq("id", pollId);
```
