from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from graph import build_graph
from database import setup_database, save_run
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup database on startup
setup_database()

pipeline = build_graph()

@app.get("/")
def root():
    return {"status": "Multi-Agent Pipeline is running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            user_input = json.loads(data)["user_input"]
            
            await websocket.send_text(json.dumps({
                "agent": "research",
                "status": "starting",
                "message": "🔍 Research Agent is analyzing your problem..."
            }))

            result = pipeline.invoke({
                "user_input": user_input,
                "research": "",
                "plan": "",
                "code": "",
                "validation": "",
                "current_agent": ""
            })

            await websocket.send_text(json.dumps({
                "agent": "research",
                "status": "done",
                "message": result["research"]
            }))

            await websocket.send_text(json.dumps({
                "agent": "planner",
                "status": "done",
                "message": result["plan"]
            }))

            await websocket.send_text(json.dumps({
                "agent": "executor",
                "status": "done",
                "message": result["code"]
            }))

            await websocket.send_text(json.dumps({
                "agent": "validator",
                "status": "done",
                "message": result["validation"]
            }))

            # Save the run to PostgreSQL
            save_run(
                user_input=user_input,
                research=result["research"],
                plan=result["plan"],
                code=result["code"],
                validation=result["validation"]
            )

            await websocket.send_text(json.dumps({
                "agent": "complete",
                "status": "done",
                "message": "Pipeline complete!"
            }))

    except Exception as e:
        await websocket.send_text(json.dumps({
            "agent": "error",
            "status": "error",
            "message": str(e)
        }))