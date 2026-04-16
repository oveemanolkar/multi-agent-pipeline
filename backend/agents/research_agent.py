from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile")

def research_agent(state: dict) -> dict:
    print("🔍 Research Agent activated...")
    
    user_input = state["user_input"]
    
    messages = [
        SystemMessage(content="""You are a Research Agent specialized in data engineering and analytics.
        Given a user's data problem, your job is to:
        1. Identify the best technical approach
        2. Recommend relevant algorithms or methods
        3. List the key steps needed
        Keep your response focused and technical."""),
        HumanMessage(content=f"Research this problem: {user_input}")
    ]
    
    response = llm.invoke(messages)
    
    return {
        **state,
        "research": response.content,
        "current_agent": "research"
    }