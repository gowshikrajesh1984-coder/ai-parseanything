import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from PIL import Image, ImageDraw

def generate_sample_documents(samples_dir: str):
    os.makedirs(samples_dir, exist_ok=True)
    
    invoice_path = os.path.join(samples_dir, "Invoice_2025.pdf")
    app_form_path = os.path.join(samples_dir, "Application_Form.pdf")
    proof_path = os.path.join(samples_dir, "Address_Proof.png")

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontSize=16, leading=20, textColor=colors.HexColor('#29452B'))
    h2_style = ParagraphStyle('Heading2', parent=styles['Heading2'], fontSize=12, leading=16, textColor=colors.HexColor('#4D9857'))
    body_style = ParagraphStyle('DocBody', parent=styles['Normal'], fontSize=10, leading=14, textColor=colors.HexColor('#29452B'))
    mono_style = ParagraphStyle('DocMono', parent=styles['Normal'], fontName='Courier', fontSize=9, leading=12)

    # 1. Invoice_2025.pdf (5 pages)
    doc = SimpleDocTemplate(invoice_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    story = []

    # --- Page 1: Main Tax Invoice Header & Primary Table ---
    story.append(Paragraph("ACME ENTERPRISES - CORPORATE TAX INVOICE", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Invoice Number: INV-2025-001 | Date: April 26, 2025 | Due Date: May 26, 2025", body_style))
    story.append(Paragraph("Billed To: Global Logistics Inc. • 100 Mission St, San Francisco, CA", body_style))
    story.append(Spacer(1, 15))

    invoice_table_data = [
        ["Description", "Qty", "Unit Price", "Subtotal"],
        ["Dedicated Server Infrastructure v4", "2", "$1,200.00", "$2,400.00"],
        ["Network Gateway Firewall Setup", "1", "$850.00", "$850.00"],
        ["Managed Cloud Database Licenses", "5", "$120.00", "$600.00"],
        ["24/7 Enterprise Support SMR", "1", "$450.00", "$450.00"],
        ["Subtotal Before Tax", "", "", "$4,300.00"],
        ["State Tax (8.25%)", "", "", "$354.75"],
        ["Invoice Total Balance Due", "", "", "$4,654.75"],
    ]
    t1 = Table(invoice_table_data, colWidths=[240, 60, 100, 100])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EAF4E2')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#29452B')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DCE8D4')),
    ]))
    story.append(t1)
    story.append(Spacer(1, 15))
    story.append(Paragraph("Note: This invoice is generated electronically under isolated audit sandbox standards.", body_style))
    story.append(PageBreak())

    # --- Page 2: Department Allocation Breakdown ---
    story.append(Paragraph("SECTION 2: COST CENTER & DEPARTMENTAL ALLOCATION", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("The billing amounts have been apportioned based on consumption metrics:", body_style))
    story.append(Spacer(1, 10))

    dept_table_data = [
        ["Department", "Cost Center", "Allocation %", "Allocated Sum"],
        ["Engineering Infrastructure", "CC-101", "55%", "$2,560.11"],
        ["Operations & Telemetry", "CC-104", "30%", "$1,396.43"],
        ["Administration & Legal", "CC-109", "15%", "$698.21"],
    ]
    t2 = Table(dept_table_data, colWidths=[200, 100, 100, 100])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F0F6E9')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DCE8D4')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t2)
    story.append(Spacer(1, 20))
    story.append(Paragraph("Amortization Formula: A = P * (1 + r/n)^(n*t)", mono_style))
    story.append(Paragraph("Net Present Value Formula: NPV = sum(CF_t / (1 + r)^t)", mono_style))
    story.append(PageBreak())

    # --- Page 3: Compliance & Authorizations ---
    story.append(Paragraph("SECTION 3: COMPLIANCE, AUDIT & VENDOR AUTHORIZATIONS", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("• Vendor Registration Identifier: VR-99214-US", body_style))
    story.append(Paragraph("• ISO/IEC 27001 Certified Information Security Management", body_style))
    story.append(Paragraph("• SOC-2 Type II Independent Service Auditor Verification Confirmed", body_style))
    story.append(Paragraph("• Anti-Money Laundering (AML) Compliance Verification Passed", body_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph("Compliance Attestation Signature: [AUTHORIZED OFFICER ACME SEC]", mono_style))
    story.append(PageBreak())

    # --- Page 4: Wire Transfer & Banking Instructions ---
    story.append(Paragraph("SECTION 4: PAYMENT RAILS & WIRE INSTRUCTIONS", title_style))
    story.append(Spacer(1, 10))
    bank_data = [
        ["Field", "Value"],
        ["Beneficiary Name", "ACME Enterprises Global LLC"],
        ["Bank Name", "Silicon Commercial Bank NA"],
        ["Routing ABA Number", "021000089"],
        ["Account Number", "987654321045"],
        ["SWIFT / BIC Code", "SCBKUS33XXX"],
        ["Currency", "USD (United States Dollar)"],
    ]
    t4 = Table(bank_data, colWidths=[180, 320])
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EAF4E2')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DCE8D4')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t4)
    story.append(PageBreak())

    # --- Page 5: Terms & Governing Conditions ---
    story.append(Paragraph("SECTION 5: GENERAL TERMS AND CONDITIONS", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("1. Payment Terms: Strictly Net 30 days from invoice issue date.", body_style))
    story.append(Paragraph("2. Late Penalty: Invoices overdue past 30 days accrue interest at 1.5% per month.", body_style))
    story.append(Paragraph("3. Dispute Window: Any invoice dispute must be filed in writing within 10 business days.", body_style))
    story.append(Paragraph("4. Governing Jurisdiction: This agreement is governed by the laws of California, USA.", body_style))
    story.append(Spacer(1, 25))
    story.append(Paragraph("Authorized Signatory: CFO John A. Doe • Certified via Digital Token #99824", body_style))
    
    doc.build(story)

    # 2. Application_Form.pdf (4 pages)
    doc_app = SimpleDocTemplate(app_form_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    story_app = []

    # Page 1
    story_app.append(Paragraph("CORPORATE CREDIT APPLICATION FORM", title_style))
    story_app.append(Spacer(1, 10))
    story_app.append(Paragraph("Applicant: Pacific Rim Supply Co. | Established: 2018 | Tax ID: 88-1294821", body_style))
    story_app.append(Spacer(1, 15))
    app_t1 = [
        ["Field", "Applicant Information"],
        ["Legal Entity Name", "Pacific Rim Supply Co. Ltd."],
        ["Principal Address", "450 Broadway, Seattle, WA 98122"],
        ["Operating Revenue (2024)", "$14,850,000.00 USD"],
        ["Requested Credit Limit", "$2,000,000.00 USD"],
    ]
    t_app1 = Table(app_t1, colWidths=[180, 320])
    t_app1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EAF4E2')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DCE8D4')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story_app.append(t_app1)
    story_app.append(PageBreak())

    # Page 2
    story_app.append(Paragraph("PAGE 2: PRINCIPAL OFFICERS & DIRECTORS", title_style))
    story_app.append(Spacer(1, 10))
    app_t2 = [
        ["Officer Name", "Title", "Ownership %", "Years with Firm"],
        ["Elena Rostova", "Chief Executive Officer", "52%", "7 years"],
        ["Marcus Vance", "Chief Financial Officer", "28%", "5 years"],
        ["Diane Chen", "Chief Technology Officer", "20%", "4 years"],
    ]
    t_app2 = Table(app_t2, colWidths=[150, 150, 100, 100])
    t_app2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F0F6E9')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#DCE8D4')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story_app.append(t_app2)
    story_app.append(PageBreak())

    # Page 3
    story_app.append(Paragraph("PAGE 3: TRADE REFERENCES & CREDIT HISTORY", title_style))
    story_app.append(Spacer(1, 10))
    story_app.append(Paragraph("• Reference 1: Northwest Shipping Logistics (Contact: trade@nwshipping.com)", body_style))
    story_app.append(Paragraph("• Reference 2: Seattle Wholesale Hardware Inc. (Credit Line: $500,000)", body_style))
    story_app.append(Paragraph("• Reference 3: Columbia River Materials (Terms: Net 45 days, Prompt pay)", body_style))
    story_app.append(PageBreak())

    # Page 4
    story_app.append(Paragraph("PAGE 4: APPLICANT DECLARATION & CONSENT", title_style))
    story_app.append(Spacer(1, 10))
    story_app.append(Paragraph("The applicant hereby certifies that all statements and financial disclosures are true, complete, and accurate. The applicant authorizes the credit provider to obtain commercial credit reports and verify all banking details.", body_style))
    story_app.append(Spacer(1, 20))
    story_app.append(Paragraph("Executed by: Elena Rostova (CEO) • Date: 2025-04-26", body_style))

    doc_app.build(story_app)

    # 3. Address_Proof.png (High quality Image)
    img = Image.new("RGB", (900, 1200), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.rectangle([30, 30, 870, 1170], outline=(100, 160, 90), width=4)
    draw.text((60, 70), "CITY UTILITIES DEPARTMENT - OFFICIAL RESIDENCE STATEMENT", fill=(40, 70, 40))
    draw.text((60, 120), "Account Number: UTL-9921-88402 | Issue Date: March 15, 2025", fill=(60, 60, 60))
    draw.text((60, 160), "Customer Name: Sarah Connor", fill=(30, 30, 30))
    draw.text((60, 200), "Service Address: 742 Evergreen Terrace, Springfield, OR 97477", fill=(30, 30, 30))
    draw.rectangle([60, 260, 840, 480], outline=(180, 200, 180), width=1)
    draw.text((80, 280), "Billing Period       Units (kWh)     Rate ($)     Total ($)", fill=(0, 0, 0))
    draw.text((80, 320), "January 2025         450             0.14         $63.00", fill=(0, 0, 0))
    draw.text((80, 360), "February 2025        420             0.14         $58.80", fill=(0, 0, 0))
    draw.text((80, 400), "Total Balance Due                                 $121.80", fill=(0, 0, 0))
    draw.text((60, 540), "Status: PAID IN FULL - ACTIVE SERVICE VERIFIED", fill=(0, 120, 0))
    draw.text((60, 600), "Certification: Document valid for residential verification purposes.", fill=(80, 80, 80))
    img.save(proof_path)

if __name__ == "__main__":
    import sys
    dest = sys.argv[1] if len(sys.argv) > 1 else "backend/samples"
    generate_sample_documents(dest)
