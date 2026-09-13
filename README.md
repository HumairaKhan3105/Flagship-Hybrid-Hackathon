# 🏛️ ANVESHAM

### *Explore • Experience • Discover

> An Interactive Digital Platform for Exploring Indian History, Culture & Heritage

---

## 📌 Project Overview

**Anvesham** is a digital heritage platform that represents India's rich history, culture and heritage through modern and interactive experiences.

Instead of relying only on traditional text-based learning, Anvesham presents historical content through:

* 📝 Quizzes
* 🧩 Puzzles
* 🎙️ Podcasts
* 📱 Short-form content
* 🎥 3D Videos
* 🌐 Interactive exploration

The goal is to make Indian history more **visual, interactive and accessible**.

---

## 🎯 Problem Statement

Indian history and heritage are often presented through textbooks and static content. This can make it difficult for modern audiences to explore and connect with historical stories.

Anvesham addresses this by bringing history and culture into a single digital platform using interactive and multimedia experiences.

---

## 💡 Key Features

### 🌍 Six Exploration Worlds

Users can explore:

1. 🎉 **Festivals**
2. 👗 **Traditional Clothes**
3. 🎨 **Art & Craft**
4. 🎵 **Musical Instruments**
5. 🏛️ **Famous Places**
6. 📜 **History of India**

Each world contains its own historical and cultural content.

---

### 📝 Quizzes & 🧩 Puzzles

Historical topics can be explored through quizzes and puzzles such as:

* Historical timelines
* Monument identification
* Artifact identification
* Personality-based questions
* Cultural clues
* Festival-based questions

Different difficulty levels can be used to make the experience more engaging.

---

### 🎙️ Podcasts & 📱 Shorts

Users can learn through short and accessible content covering:

* Historical stories
* Important personalities
* Monuments
* Festivals
* Cultural traditions
* Interesting historical facts

---

### 🎥 3D Historical Experiences

Important historical places and stories can be represented using **3D videos and visual experiences**, helping users understand history beyond static text.

---

## 📅 Dynamic Events & Festivals

Anvesham contains an Indian Event Calendar for important national days and festivals.

Examples:

* Republic Day
* Independence Day
* Gandhi Jayanti
* Diwali
* Holi
* Dussehra
* Navratri
* Janmashtami
* Eid
* Christmas
* Onam
* Pongal

When an event arrives, the platform can automatically showcase event-specific content.

### 🇮🇳 Example — Independence Day

```text
Current Date
     ↓
Independence Day Detected
     ↓
Special Theme Activated
     ↓
Historical Content
     ↓
Quiz + Puzzle
     ↓
Special Event Achievement
```

After the event period, the website returns to its normal interface.

---

## 🔥 Daily Case & Streak

### Daily Case

Users receive a regular history or heritage-based challenge such as:

* Historical mystery
* Artifact identification
* Monument clue
* Timeline challenge
* Cultural question

### Streak

Continuous participation increases the user's learning streak.

```text
Day 1 🔥
Day 2 🔥🔥
Day 3 🔥🔥🔥
```

Streak data is stored in MongoDB.

---

## 🏅 Badges, Medals & Leaderboard

Users can earn badges and medals by:

* Completing quizzes
* Solving puzzles
* Exploring worlds
* Maintaining streaks
* Completing special events

The leaderboard displays **real registered users**, their points, ranks and achievements.

---

# 👤 User & Admin

## User

Users can:

* Signup / Login
* Explore six worlds
* Watch 3D videos
* Watch shorts
* Listen to podcasts
* Solve quizzes
* Solve puzzles
* Complete Daily Cases
* Maintain streaks
* Earn badges and medals
* Participate in events
* View leaderboard

## Admin

Admins can:

* Manage historical content
* Add/update quizzes
* Add puzzles
* Add podcasts and shorts
* Add 3D content
* Manage Daily Cases
* Create events
* Add festival-specific content
* Manage badges and achievements

Role-based login redirects users and admins to their respective interfaces.

---

# 🖼️ Website Preview

> Add your actual website screenshots inside the `screenshots/` folder.

### 🏠 Landing Page

### 🌍 Explore Worlds

### 📝 Daily Case

### 📅 Event Calendar

### 🏆 Leaderboard

### 👨‍💼 Admin Dashboard

---

# 🏗️ System Architecture

```text
                  ┌─────────────────┐
                  │      USER       │
                  └────────┬────────┘
                           ↓
                ┌─────────────────────┐
                │  React + TypeScript │
                │      Frontend       │
                │       Vercel        │
                └──────────┬──────────┘
                           ↓
                     REST APIs
                           ↓
                ┌─────────────────────┐
                │   Node.js + Express │
                │       Backend       │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │      MongoDB        │
                │                     │
                │ Users               │
                │ Content             │
                │ Quizzes             │
                │ Puzzles             │
                │ Events              │
                │ Streaks             │
                │ Badges / Medals     │
                └─────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Frontend        | React.js, TypeScript, JavaScript |
| Backend         | Node.js, Express.js              |
| Database        | MongoDB                          |
| Deployment      | Vercel                           |
| Version Control | Git & GitHub                     |

---

# 🚀 Local Setup

### 1. Clone Repository

```bash
git clone YOUR_PUBLIC_GITHUB_REPOSITORY_URL
cd ANVESHAM
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

### 4. Environment Variables

Create `.env` in the backend:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not upload `.env` to GitHub.

---

# 🌐 Deployment

The project is deployed using **Vercel**.

```text
GitHub
   ↓
Push Code
   ↓
Vercel
   ↓
Build
   ↓
Live Anvesham Website
```

**Live Website:** `YOUR_VERCEL_URL`

**GitHub Repository:** `YOUR_GITHUB_URL`

---

# 📜 Hardware Requirement

Anvesham is a software-based web platform and does not use embedded hardware.

```text
Hardware Pinout: Not Applicable
Bill of Materials (BOM): Not Applicable
Circuit Diagram: Not Applicable
System Architecture: Included Above
```

---

# 🌟 Innovation

Anvesham brings together multiple digital formats for historical and cultural exploration:

```text
                INDIAN HISTORY
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
     Quiz           Puzzle         Podcast
       │              │              │
       └──────────────┼──────────────┘
                      ↓
                 Short Content
                      ↓
                   3D Video
                      ↓
             Interactive Exploration
```

This creates a single digital space where users can **discover, experience and understand India's heritage**.

---

# 🔮 Future Scope

* AI-powered historical guide
* Multilingual content
* AI-generated quizzes
* AR/VR heritage experiences
* More 3D historical environments
* Personalized content recommendations
* School and college integration

---

# 👥 Team

| Member          | Role          |
| --------------- | ------------- |
| **Janvi Gupta** | [Team Leader] |
| Humaira khan    | [Member]      |
| Abhinav Sharma  | [Member]      |
| Achintya kumar  | [Member]      |

---

# ❤️ Conclusion

**Anvesham is not a gaming platform.**

It is an **interactive digital heritage platform** that represents Indian history, culture and heritage through **quizzes, puzzles, podcasts, shorts, 3D videos and interactive exploration**.

> **Explore History. Experience Heritage. Discover India Digitally.**

### 🏛️ ANVESHAM

**Explore • Experience • Discover**
