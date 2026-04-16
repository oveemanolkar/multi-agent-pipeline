from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile")

def validator_agent(state: dict) -> dict:
    print("✅ Validator Agent activated...")
    
    user_input = state["user_input"]
    plan = state["plan"]
    code = state["code"]
    
    messages = [
        SystemMessage(content="""You are a Validator Agent specialized in code review and quality assurance.
        Given a problem, plan, and generated code, your job is to:
        1. Check if the code correctly implements the plan
        2. Identify any bugs, errors, or missing pieces
        3. Suggest specific improvements
        4. Give an overall quality score out of 10
        Be thorough but concise in your feedback."""),
        HumanMessage(content=f"""
        Original problem: {user_input}
        
        Execution plan: {plan}
        
        Generated code: {code}
        
        Review this code and provide your validation report.
        """)
    ]
    
    response = llm.invoke(messages)
    
    return {
        **state,
        "validation": response.content,
        "current_agent": "validator"
    }