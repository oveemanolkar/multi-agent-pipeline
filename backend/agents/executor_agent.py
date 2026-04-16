from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile")

def executor_agent(state: dict) -> dict:
    print("⚙️ Executor Agent activated...")
    
    user_input = state["user_input"]
    research = state["research"]
    plan = state["plan"]
    
    messages = [
        SystemMessage(content="""You are an Executor Agent specialized in writing production-ready Python code.
        Given a problem, research, and a plan, your job is to:
        1. Write clean, working Python code that implements the plan
        2. Include all necessary imports
        3. Add comments explaining key sections
        4. Make the code modular and reusable
        Output only the Python code with comments, no extra explanation."""),
        HumanMessage(content=f"""
        Original problem: {user_input}
        
        Research findings: {research}
        
        Execution plan: {plan}
        
        Write the Python code to implement this plan.
        """)
    ]
    
    response = llm.invoke(messages)
    
    return {
        **state,
        "code": response.content,
        "current_agent": "executor"
    }