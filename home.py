from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langgraph import LangGraph, DatabaseNode, LLMSummarizationNode
from sqlalchemy import create_engine, text
import os

app = FastAPI()

DATABASE_URL = "postgresql://user:password@localhost/product_db"
engine = create_engine(DATABASE_URL)


LLM_API_KEY = os.getenv("LLM_API_KEY")  

class Query(BaseModel):
    query: str

@app.post("/api/chat")
async def chat(query: Query):
    user_query = query.query

    try:
        
        input_node = LangGraph.InputNode("QueryInput")
        
        db_node = DatabaseNode(
            database_url=DATABASE_URL,
            query_function=lambda query: {
                "query": "SELECT * FROM products WHERE category = :category",
                "params": {"category": query}
            }
        )
        
        llm_node = LLMSummarizationNode(
            model_name="gpt-3",
            api_key=LLM_API_KEY,
            summarize_function=lambda results: f"Here are summarized results: {results}"
        )

        workflow = input_node.connect(db_node).connect(llm_node)
        response = workflow.execute(user_query)

        return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))