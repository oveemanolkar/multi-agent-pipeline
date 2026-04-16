from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile")

def planner_agent(state: dict) -> dict:
    print("📋 Planner Agent activated...")
    
    user_input = state["user_input"]
    research = state["research"]
    
    messages = [
        SystemMessage(content="""You are a Planner Agent specialized in breaking down data engineering tasks.
        Given a problem and research findings, your job is to:
        1. Create a clear step-by-step execution plan
        2. Define what each step produces
        3. Keep steps concrete and implementable
        Output your plan as a numbered list of clear steps."""),
        HumanMessage(content=f"""
        Original problem: {user_input}
        
        Research findings: {research}
        
        Create a detailed execution plan.
        """)
    ]
    
    response = llm.invoke(messages)
    
    return {
        **state,
        "plan": response.content,
        "current_agent": "planner"
    }