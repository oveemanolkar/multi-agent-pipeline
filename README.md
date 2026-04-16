# 🤖 Multi-Agent AI Pipeline

An AI-powered data pipeline builder where 4 specialized agents collaborate in real-time to research, plan, generate, and validate solutions to data engineering problems.

![Pipeline Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![LangGraph](https://img.shields.io/badge/LangGraph-Agent_Orchestration-blue) ![Groq](https://img.shields.io/badge/Groq-LLM_Inference-orange) ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-teal) ![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)

---

## 🧠 How It Works

A user describes a data problem in natural language. Four AI agents then collaborate sequentially, each passing their output to the next:

🔍 Research Agent → 📋 Planner Agent → ⚙️ Executor Agent → ✅ Validator Agent

| Agent | Role |
|-------|------|
| 🔍 Research Agent | Identifies the best technical approach and algorithms |
| 📋 Planner Agent | Breaks the problem into a concrete step-by-step execution plan |
| ⚙️ Executor Agent | Writes production-ready Python code implementing the plan |
| ✅ Validator Agent | Reviews the code, identifies issues, and gives a quality score |

Results stream to the UI in real-time via WebSockets as each agent completes.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 + TypeScript
- Tailwind CSS
- WebSockets for real-time agent streaming
- React Markdown for formatted output

**Backend**
- FastAPI (REST API + WebSocket server)
- LangGraph (multi-agent orchestration)
- LangChain + Groq API (LLM inference — Llama 3.3 70B)
- PostgreSQL (run history logging)

**Infrastructure**
- Docker (PostgreSQL container)
- Uvicorn (ASGI server)

---

## ✨ Features

- Real-time agent timeline — watch each agent activate live in the browser
- Live step indicators — Research → Plan → Execute → Validate highlights as pipeline runs
- Markdown rendering — formatted output with syntax-highlighted code blocks
- PostgreSQL logging — every pipeline run is saved to the database
- New Pipeline button — clear and re-run with a single click

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker Desktop
- Groq API key (free at https://console.groq.com)

### 1. Clone the repo

    git clone https://github.com/oveemanolkar/multi-agent-pipeline.git
    cd multi-agent-pipeline

### 2. Backend setup

    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install fastapi uvicorn langgraph langchain-groq langchain python-dotenv websockets psycopg2-binary

Create a .env file in the backend folder:

    GROQ_API_KEY=your_groq_api_key_here
    DATABASE_URL=postgresql://user:password@127.0.0.1:5433/multiagent

### 3. Start PostgreSQL

    docker compose up -d

### 4. Start the backend

    cd backend
    uvicorn main:app --reload

### 5. Frontend setup

    cd ../frontend
    npm install
    npm run dev

Visit http://localhost:3000 and describe a data problem to run the pipeline.

---

## 📸 Example

**Input:** I have sales data and want to detect anomalies

**Output:**
- Research Agent recommends Isolation Forest, LOF, and Z-Score methods
- Planner Agent creates a 15-step execution plan
- Executor Agent writes full Python code with sklearn and pandas
- Validator Agent reviews the code and gives a quality score out of 10

---

## 👤 Author

**Ovee Manolkar**

- LinkedIn: https://www.linkedin.com/in/ovee-manolkar/
- GitHub: https://github.com/oveemanolkar