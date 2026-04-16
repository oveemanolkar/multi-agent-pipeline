from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile")
response = llm.invoke("You are a research agent. What approach would you recommend for detecting anomalies in sales data?")
print(response.content)