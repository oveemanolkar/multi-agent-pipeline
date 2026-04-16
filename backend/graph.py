from langgraph.graph import StateGraph, END
from typing import TypedDict
from agents.research_agent import research_agent
from agents.planner_agent import planner_agent
from agents.executor_agent import executor_agent
from agents.validator_agent import validator_agent

# Define the state structure that flows between agents
class AgentState(TypedDict):
    user_input: str
    research: str
    plan: str
    code: str
    validation: str
    current_agent: str

# Build the graph
def build_graph():
    graph = StateGraph(AgentState)

    # Add each agent as a node
    graph.add_node("research", research_agent)
    graph.add_node("planner", planner_agent)
    graph.add_node("executor", executor_agent)
    graph.add_node("validator", validator_agent)

    # Define the flow: research → planner → executor → validator
    graph.set_entry_point("research")
    graph.add_edge("research", "planner")
    graph.add_edge("planner", "executor")
    graph.add_edge("executor", "validator")
    graph.add_edge("validator", END)

    return graph.compile()


# Test the graph directly
if __name__ == "__main__":
    pipeline = build_graph()

    result = pipeline.invoke({
        "user_input": "I have sales data and want to detect anomalies",
        "research": "",
        "plan": "",
        "code": "",
        "validation": "",
        "current_agent": ""
    })

    print("\n" + "="*50)
    print("🔍 RESEARCH:\n", result["research"])
    print("="*50)
    print("📋 PLAN:\n", result["plan"])
    print("="*50)
    print("⚙️ CODE:\n", result["code"])
    print("="*50)
    print("✅ VALIDATION:\n", result["validation"])