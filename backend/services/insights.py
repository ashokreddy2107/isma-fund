import os
from typing import Dict, Any, List
from openai import OpenAI
import json

def generate_insights(fundamentals: Dict[str, Any], news: List[Dict[str, Any]]) -> Dict[str, str]:
    """
    Takes stock fundamentals and recent news to generate AI-driven insights.
    Returns short-term and long-term insights.
    """
    ticker = fundamentals.get("symbol", "Unknown")
    company_name = fundamentals.get("company_name", ticker)
    
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key) if api_key else None
    
    if not client:
        return fallback_insights(fundamentals, news)

    try:
        prompt = (
            f"You are an expert financial analyst. Analyze the following data for {company_name} ({ticker}):\n"
            f"Fundamentals: {fundamentals}\n"
            f"Recent News: {news}\n\n"
            "Return the insights in ONLY raw JSON format (do not use markdown blocks). The JSON must have exactly two string properties: "
            "'short_term' (focus on momentum/catalysts from news, 2-3 sentences) and "
            "'long_term' (focus on fundamental trajectory, valuation, 2-3 sentences)."
        )
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        content = response.choices[0].message.content
        if content:
            content = content.replace('```json', '').replace('```', '')
            insights = json.loads(content)
            return {
                "short_term": insights.get("short_term", "Analysis unavailable."),
                "long_term": insights.get("long_term", "Analysis unavailable.")
            }
        else:
            return fallback_insights(fundamentals, news)
    except Exception as e:
        print(f"Error generating AI insights: {e}")
        return fallback_insights(fundamentals, news)

def fallback_insights(fundamentals: Dict[str, Any], news: List[Dict[str, Any]]) -> Dict[str, str]:
    ticker = fundamentals.get("symbol", "Unknown")
    company_name = fundamentals.get("company_name", ticker)

    pe = fundamentals.get("pe_ratio")
    valuation_comment = "is fairly valued"
    if pe:
        if pe > 30:
            valuation_comment = "appears overvalued based on current P/E"
        elif pe < 15:
            valuation_comment = "appears undervalued based on current P/E"

    news_titles = [n.get("title") for n in news]
    news_summary = "No recent news."
    if news_titles:
        news_summary = f"Recent news focuses on: {', '.join(news_titles[:2])}."

    short_term_insight = (
        f"AI Insight disabled (No API Key). {news_summary} Watch out for volatility."
    )

    long_term_insight = (
        f"AI Insight disabled. The company {valuation_comment}. EPS is {fundamentals.get('eps', 'N/A')}."
    )

    return {
        "short_term": short_term_insight,
        "long_term": long_term_insight
    }
