from fastapi import APIRouter, HTTPException, Response
from app.api.audio import SESSION_STORE
from app.services.report_service import generate_pdf_report, generate_json_report

router = APIRouter(tags=["Reports"])

@router.get("/report/{session_id}")
async def get_report_pdf(session_id: str, format: str = "pdf"):
    """Downloads official VIVA Security Incident Analysis Report as PDF or JSON."""
    session_data = SESSION_STORE.get(session_id, None)
    if not session_data:
        raise HTTPException(status_code=404, detail="Analysis session report not found.")
        
    if format.lower() == "json":
        json_str = generate_json_report(session_data)
        return Response(content=json_str, media_type="application/json")
        
    pdf_bytes = generate_pdf_report(session_data)
    filename = f"VIVA_Security_Report_{session_id}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.post("/generate-report")
async def generate_custom_report(session_id: str):
    """Triggers report generation for an active session."""
    session_data = SESSION_STORE.get(session_id, None)
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {
        "session_id": session_id,
        "status": "ready",
        "pdf_url": f"/api/report/{session_id}?format=pdf",
        "json_url": f"/api/report/{session_id}?format=json"
    }
