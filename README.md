# Zoom AI Mock Interview Prep

An AI-powered mock interview platform designed to simulate real interview experiences, provide structured feedback, and help users improve their performance — built with the vision of integrating directly into Zoom meetings.

---

## Overview

Zoom AI Mock Interview Prep is an intelligent interview simulation tool that enables users to:

- Generate role-specific interview questions  
- Practice responses in a structured environment  
- Receive AI-driven feedback  
- Improve communication, clarity, and confidence  

This project is being developed as part of the **Zoom Fellowship at ASU**, with the goal of embedding AI-powered interview assistance directly into live Zoom sessions.

---

## Features

- **Mock Interview Simulation**  
  Interactive flow for practicing interview questions  

- **AI Question Generation**  
  Dynamically generates interview questions (currently mocked for UI testing)  

- **Response Capture & Review**  
  Users can input and review their answers  

- **Feedback System (WIP)**  
  Structured evaluation of responses (clarity, relevance, confidence)  

- **Resume Upload Flow**  
  Tailors interview experience based on user profile  

- **Multi-Step Interview Journey**  
  Upload → Interview → Review → Feedback  

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript  
- **Styling:** CSS Modules  
- **Backend (API Routes):** Next.js Server Functions  
- **AI Integration (Planned):** OpenAI / compatible APIs  
- **Deployment (Planned):** Vercel  
- **Future Integration:** Zoom Apps SDK + RTMS  

---

## Project Structure

```
ai-interview-prep/
│
├── app/
│   ├── upload/        # Resume upload flow
│   ├── interview/     # Interview simulation UI
│   ├── review/        # Review responses
│   ├── feedback/      # Feedback output
│   └── api/           # Backend routes
│
├── public/            # Static assets
├── package.json       # Dependencies
└── README.md
```

---

## 🛠️ Getting Started

### 1. Clone the repository
git clone https://github.com/akapil1/Zoom-AI-Mock-Interview-Prep.git
cd Zoom-AI-Mock-Interview-Prep

### 2. Install dependencies
npm install

### 3. Run the development server
npm run dev

### 4. Open in browser
http://localhost:3000

---

## 📌 Work in Progress

- [ ] Connect OpenAI API using API key credits  
- [ ] Replace dummy questions with real AI-generated questions  
- [ ] Add a database to store user data and responses  
- [ ] Improve resume parsing and check accuracy  
- [ ] Personalize questions based on uploaded resume  
- [ ] Embed the app into Zoom using the Zoom Apps SDK  
- [ ] Set up real-time interaction inside Zoom meetings  
- [ ] Add basic feedback scoring for answers  
- [ ] Improve overall UI/UX flow  
- [ ] Deploy the app on Vercel  

---
## Roadmap

- [ ] Full AI-powered mock interview system  
- [ ] Zoom-native interview assistant  
- [ ] Real-time coaching during live interviews  
- [ ] Accessibility-focused enhancements  

---

## Vision

This project aims to transform interview preparation into an **accessible, intelligent, and real-time experience** — especially for students and early-career professionals.

By embedding directly into Zoom, it bridges the gap between **practice and real-world interview environments**.

---
