import io
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from app.models.schemas import AudioAnalysisResponse

def generate_pdf_report(data: AudioAnalysisResponse) -> bytes:
    """Generates a professional VIVA Security Incident Analysis PDF Report."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    PRIMARY_BLUE = colors.HexColor("#2563EB")
    DARK_TEXT = colors.HexColor("#1E293B")
    LIGHT_BG = colors.HexColor("#F8FAFC")
    BORDER_COLOR = colors.HexColor("#E2E8F0")
    CRITICAL_RED = colors.HexColor("#DC2626")
    GREEN_ACCENT = colors.HexColor("#16A34A")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=PRIMARY_BLUE,
        fontName='Helvetica-Bold'
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor("#64748B"),
        fontName='Helvetica'
    )
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=DARK_TEXT,
        fontName='Helvetica-Bold',
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT,
        fontName='Helvetica'
    )
    
    story = []

    # Header section
    story.append(Paragraph("VIVA – VOICE INTEGRITY & VERIFICATION ARCHITECTURE", title_style))
    story.append(Paragraph("ENTERPRISE FORENSIC VOICE SECURITY INCIDENT REPORT", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_BLUE, spaceBefore=0, spaceAfter=10))

    # Session metadata table
    session_info = [
        [Paragraph("<b>Session ID:</b>", body_style), Paragraph(data.session_id, body_style), Paragraph("<b>Date/Time:</b>", body_style), Paragraph(data.timestamp, body_style)],
        [Paragraph("<b>Audio Duration:</b>", body_style), Paragraph(f"{data.duration_seconds} sec", body_style), Paragraph("<b>Sample Rate:</b>", body_style), Paragraph(f"{data.preprocessing.sample_rate_hz} Hz", body_style)],
        [Paragraph("<b>Risk Status:</b>", body_style), Paragraph(f"<font color='{data.risk.risk_level}'><b>{data.risk.risk_level} RISK</b></font>", body_style), Paragraph("<b>Final Risk Score:</b>", body_style), Paragraph(f"<b>{data.risk.risk_score} / 100</b>", body_style)]
    ]
    t_session = Table(session_info, colWidths=[100, 160, 100, 180])
    t_session.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_session)
    story.append(Spacer(1, 12))

    # Decision Banner
    banner_bg = colors.HexColor("#FEE2E2") if data.risk.risk_level == "HIGH" else colors.HexColor("#DCFCE7")
    banner_text_color = CRITICAL_RED if data.risk.risk_level == "HIGH" else GREEN_ACCENT
    decision_style = ParagraphStyle(
        'DecisionText',
        parent=styles['Normal'],
        fontSize=11,
        leading=15,
        textColor=banner_text_color,
        fontName='Helvetica-Bold',
        alignment=1
    )
    decision_table = Table([[Paragraph(f"AUTOMATED VERDICT: {data.risk.final_decision}", decision_style)]], colWidths=[540])
    decision_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), banner_bg),
        ('BOX', (0,0), (-1,-1), 1, banner_text_color),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(decision_table)
    story.append(Spacer(1, 14))

    # Section 1: Parallel Analysis Engine Results
    story.append(Paragraph("1. PARALLEL ANALYSIS MODULE BREAKDOWN", heading_style))
    story.append(Spacer(1, 4))

    analysis_data = [
        [Paragraph("<b>Engine Module</b>", body_style), Paragraph("<b>Primary Metric</b>", body_style), Paragraph("<b>Status / Finding</b>", body_style), Paragraph("<b>Risk Rating</b>", body_style)],
        [Paragraph("🎵 Spectral Analysis", body_style), Paragraph(f"Score: {data.spectral.spectral_score}/100", body_style), Paragraph(f"Mel: {data.spectral.mel_pattern} | MFCC: {data.spectral.mfcc_status}", body_style), Paragraph(data.spectral.risk_level, body_style)],
        [Paragraph("🗣️ Prosodic Analysis", body_style), Paragraph(f"Score: {data.prosodic.prosody_score}/100", body_style), Paragraph(f"F0: {data.prosodic.avg_f0_hz}Hz | Jitter: {data.prosodic.jitter_status}", body_style), Paragraph(data.prosodic.risk_level, body_style)],
        [Paragraph("🤖 AI Deepfake Detection", body_style), Paragraph(f"Synthetic: {data.deepfake.synthetic_probability}%", body_style), Paragraph(f"Verdict: {data.deepfake.classification}", body_style), Paragraph(f"Conf: {data.deepfake.confidence}%", body_style)],
        [Paragraph("👤 Speaker Verification", body_style), Paragraph(f"Similarity: {data.speaker.speaker_similarity}%", body_style), Paragraph(f"Identity: {data.speaker.identity_match}", body_style), Paragraph("COSINE MATCH", body_style)]
    ]
    t_analysis = Table(analysis_data, colWidths=[130, 120, 200, 90])
    t_analysis.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_analysis)
    story.append(Spacer(1, 14))

    # Section 2: AI Security Rationale & Evidence
    story.append(Paragraph("2. AI EXPLANATION & THREAT RATIONALE", heading_style))
    story.append(Paragraph(data.risk.ai_explanation, body_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Itemized Evidence Signals:</b>", body_style))
    for point in data.risk.why_flagged:
        story.append(Paragraph(f"• {point}", body_style))
    story.append(Spacer(1, 14))

    # Section 3: Recommended Security Prevention Actions
    story.append(Paragraph("3. RECOMMENDED SECURITY PREVENTION ACTIONS", heading_style))
    for action in data.risk.recommended_actions:
        story.append(Paragraph(f"✓ <b>{action}</b>", body_style))
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=10, spaceAfter=8))
    story.append(Paragraph("Generated by VIVA Production Cyber Defense Platform", subtitle_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

def generate_json_report(data: AudioAnalysisResponse) -> str:
    """Exports structured JSON report for SOC integration."""
    return data.model_dump_json(indent=2)
