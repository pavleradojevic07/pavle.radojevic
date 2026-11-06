#!/usr/bin/env python3
"""Generate files/pavle-radojevic-player-sheet.pdf, the one-page player sheet linked from the Basketball page.
Usage (from the repo root):  python tools/make_player_sheet.py
Needs:  pip install reportlab      Fonts are read from tools/fonts/.
Edit the DATA block below when something changes (new club, new highs...) and run it again."""
import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, FrameBreak, KeepTogether, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "files" / "pavle-radojevic-player-sheet.pdf"
SITE = "https://pavleradojevic07.github.io/pavle.radojevic"

# ───────────────────────────── DATA (edit here) ─────────────────────────────
NAME = "Pavle Radojević"
SUBTITLE = "Basketball player profile"
FACTS = [("Height", "205 cm / 6'9\""), ("Weight", "101 kg / 222 lb"), ("Position", "PF / C"), ("Nationality", "Serbia"),
         ("Born", "2007")]
PROFILE = ("A versatile forward/center with a strong international background. Known for defensive versatility, "
           "high basketball IQ, a strong presence in the paint, and the ability to stretch the floor with reliable "
           "outside shooting.")
CURRENT = ("<b>KK Portorož</b>, Portorož, Slovenia &#8211; Slovenian 2. SKL (senior) and 1. B SKL (U20), 2026&#8211;present. "
           "Open to conversations about future arrangements.")
HISTORY = [
    ("2026 – now", "KK Portorož, Slovenia", "2. SKL (senior) and 1. B SKL (U20)"),
    ("2025 – 2026", "KK Borac Zemun, Serbia", "Belgrade Quality League (U19)"),
    ("2021 – 2025", "Honvéd Academy, Hungary", "Hungarian NB II (senior league) and EYBL"),
    ("2014 – 2021", "KK Borac Zemun (youth), Serbia", "Youth development U12–U17"),
]
ACHIEVEMENTS = [
    "Serbian National Team Training Camp (Top 40), 2007-born players, 2021",
    "Hungarian NB II 2023/24 senior league champion",
    "EYBL U21 Superfinal, 3rd place (Levice, Slovakia, May 2023)",
    "ZBK International Tournament, 3rd place (Alicante, Spain, April 2023)",
    "Winter Tournament U18, 3rd place (Belgrade, January 2023)",
    "EYBL appearances at U16, U18 and U20 level",
]
HIGHS = [("28", "Points", "vs Óbudai Egyetem, 25 Mar 2025"), ("25", "Rebounds", "vs VESC, 11 Nov 2024"),
         ("6", "Assists", "vs SMAFC, 24 Mar 2025"), ("6", "Blocks", "vs Óbudai Egyetem, 25 Mar 2025")]
EDUCATION = [
    ("University of Primorska, FAMNIT (Koper, Slovenia)", "Mathematics, 1st year, 2026 – now"),
    ("University of Belgrade, Faculty of Mathematics", "Applied Mathematics, 1st year, 2025 – 2026"),
    ("High School “Nikola Tesla”, Budapest", "Graduated 2025 with highest honors, Matura 5.0/5.0"),
]
EXTRA = "Expected university graduation: summer 2029. Winner of the Financial Mathematics Competition of the Mathematical Society of Serbia (June 2024)."
LANGUAGES = "Serbian (native) · English (C1, IELTS 7.5) · Hungarian (B2)"
LINKS = [
    ("Highlights 2025/26", "https://youtu.be/clxgFeRJaLQ"),
    ("Eurobasket", "https://basketball.eurobasket.com/player/Pavle-Radojevic/686578"),
    ("KZS", "https://www.kzs.si/igralec/108821"),
    ("SofaScore", "https://www.sofascore.com/basketball/player/pavle-radojevic/2786761"),
    ("Proballers", "https://www.proballers.com/basketball/player/317115/pavle-radojevic"),
]
CONTACT = [("Email", "mailto:pavle.radojevic07@gmail.com", "pavle.radojevic07@gmail.com"),
           ("Website", SITE + "/basketball.html", "pavleradojevic07.github.io/pavle.radojevic"),
           ("Instagram", "https://instagram.com/pavle.radojevic", "@pavle.radojevic"),
           ("LinkedIn", "https://linkedin.com/in/pavle-radojevic-3677b4255/", "pavle-radojevic")]
# ────────────────────────────────────────────────────────────────────────────

for key, f in (("Inter", "Inter-Regular"), ("Inter-SemiBold", "Inter-SemiBold"), ("Inter-Bold", "Inter-Bold"),
               ("Playfair", "PlayfairDisplay-Bold")):
    pdfmetrics.registerFont(TTFont(key, str(HERE / "fonts" / (f + ".ttf"))))
pdfmetrics.registerFontFamily("Inter", normal="Inter", bold="Inter-Bold", italic="Inter", boldItalic="Inter-Bold")

INK, INK2, MUTED = colors.HexColor("#1a1a2e"), colors.HexColor("#4a4a60"), colors.HexColor("#666680")
ACCENT, LINE, TILE, LINK = (colors.HexColor("#c2410c"), colors.HexColor("#e0e0ea"), colors.HexColor("#f5f5f8"),
                            colors.HexColor("#1a6fc4"))

body = ParagraphStyle("body", fontName="Inter", fontSize=8.6, leading=12.2, textColor=INK2, alignment=TA_LEFT)
small = ParagraphStyle("small", parent=body, fontSize=7.8, leading=10.8, textColor=MUTED)
h2 = ParagraphStyle("h2", fontName="Playfair", fontSize=13, leading=16, textColor=INK, spaceBefore=11, spaceAfter=4)
item = ParagraphStyle("item", parent=body, leftIndent=9, bulletIndent=0, spaceAfter=2.2)
strong = ParagraphStyle("strong", parent=body, fontName="Inter-SemiBold", textColor=INK)


def link(text, url):
    return f'<link href="{url}" color="#1a6fc4"><u>{text}</u></link>'


def heading(text):
    return [Paragraph(text, h2), Table([[""]], colWidths=[34], rowHeights=[2],
                                       style=[("BACKGROUND", (0, 0), (-1, -1), ACCENT)], hAlign="LEFT"), Spacer(1, 5)]


def build():
    PW, PH = A4
    M = 40
    doc = BaseDocTemplate(str(OUT), pagesize=A4, leftMargin=M, rightMargin=M, topMargin=M, bottomMargin=M,
                          title=f"{NAME} - player sheet", author=NAME,
                          subject="Basketball player profile", keywords="basketball, PF, C, Serbia, Slovenia")
    gap = 22
    colw = (PW - 2 * M - gap) / 2
    head_h = 212
    col_h = PH - M - head_h - 6 - 94
    frames = [
        Frame(M, PH - M - head_h, PW - 2 * M, head_h, id="head", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0),
        Frame(M, 94, colw, col_h, id="left", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0),
        Frame(M + colw + gap, 94, colw, col_h, id="right", leftPadding=0, rightPadding=0, topPadding=0,
              bottomPadding=0),
        Frame(M, M, PW - 2 * M, 50, id="foot", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0),
    ]

    def page_deco(c, d):
        c.saveState()
        c.setFillColor(ACCENT)
        c.rect(0, PH - 10, PW, 10, stroke=0, fill=1)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.7)
        c.line(M, 92, PW - M, 92)
        c.restoreState()

    doc.addPageTemplates([PageTemplate(id="p", frames=frames, onPage=page_deco)])

    s = []
    # ── header ──
    s.append(Spacer(1, 6))
    s.append(Paragraph(NAME, ParagraphStyle("name", fontName="Playfair", fontSize=34, leading=38, textColor=INK)))
    s.append(Paragraph(SUBTITLE, ParagraphStyle("sub", parent=body, fontSize=10.5, leading=14, textColor=ACCENT,
                                                fontName="Inter-SemiBold", spaceBefore=1, spaceAfter=10)))
    cw = (PW - 2 * M) / len(FACTS)
    facts = Table([[Paragraph(v, ParagraphStyle("fv", fontName="Playfair", fontSize=12.5, leading=16, textColor=INK))
                    for _, v in FACTS],
                   [Paragraph(k, ParagraphStyle("fk", parent=small, textColor=MUTED)) for k, _ in FACTS]],
                  colWidths=[cw] * len(FACTS))
    facts.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), TILE), ("LINEAFTER", (0, 0), (-2, -1), 0.7, colors.white),
                               ("TOPPADDING", (0, 0), (-1, 0), 8), ("BOTTOMPADDING", (0, 0), (-1, 0), 0),
                               ("TOPPADDING", (0, 1), (-1, 1), 1), ("BOTTOMPADDING", (0, 1), (-1, 1), 8),
                               ("LEFTPADDING", (0, 0), (-1, -1), 10)]))
    s += [facts, Spacer(1, 9), Paragraph(PROFILE, body), Spacer(1, 7)]
    cur = Table([[Paragraph(CURRENT, ParagraphStyle("cur", parent=body, textColor=INK))]], colWidths=[PW - 2 * M])
    cur.setStyle(TableStyle([("LINEBEFORE", (0, 0), (0, -1), 3, ACCENT), ("LEFTPADDING", (0, 0), (-1, -1), 10),
                             ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    s += [cur, FrameBreak()]

    # ── left column ──
    s += heading("Playing history")
    rows = [[Paragraph(y, ParagraphStyle("y", parent=small, fontName="Inter-SemiBold", textColor=ACCENT)),
             [Paragraph(club, strong), Paragraph(lg, small)]] for y, club, lg in HISTORY]
    t = Table(rows, colWidths=[56, colw - 56])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
                           ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                           ("LEFTPADDING", (0, 0), (-1, -1), 0)]))
    s.append(t)
    s += heading("Achievements")
    s += [Paragraph(a, item, bulletText="•") for a in ACHIEVEMENTS]
    s += [FrameBreak()]

    # ── right column ──
    s += heading("Career highs")
    cells = []
    for n, label, where in HIGHS:
        cells.append([Paragraph(f'<font name="Playfair" size="21" color="#c2410c">{n}</font> '
                                f'<font name="Inter-SemiBold" size="9" color="#1a1a2e">{label}</font>',
                                ParagraphStyle("tile", leading=25)), Paragraph(where, small)])
    grid = Table([[cells[0], cells[1]], [cells[2], cells[3]]], colWidths=[colw / 2, colw / 2])
    grid.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), TILE), ("BOX", (0, 0), (-1, -1), 0.7, colors.white),
                              ("INNERGRID", (0, 0), (-1, -1), 1.5, colors.white), ("TOPPADDING", (0, 0), (-1, -1), 6),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 7), ("LEFTPADDING", (0, 0), (-1, -1), 8),
                              ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    s.append(grid)
    s += heading("Education")
    for place, what in EDUCATION:
        s += [Paragraph(place, strong), Paragraph(what, small), Spacer(1, 4)]
    s += [Paragraph(EXTRA, body)]
    s += heading("Languages")
    s += [Paragraph(LANGUAGES, body)]
    s += heading("Profiles and video")
    lk = [link(t_, u) for t_, u in LINKS]
    s += [Paragraph("  ·  ".join(lk[:3]) + "<br/>" + "  ·  ".join(lk[3:]), ParagraphStyle("lk", parent=body, leading=14))]
    s += [FrameBreak()]

    # ── footer ──
    s.append(Spacer(1, 6))
    c = [f"{k}: " + link(txt, u) for k, u, txt in CONTACT]
    s.append(Paragraph("<b>Contact</b>  " + c[0] + "  ·  " + c[2] + "  ·  " + c[3] + "<br/>" + c[1],
                       ParagraphStyle("ct", parent=body, textColor=INK, leading=13)))
    s.append(Spacer(1, 3))
    s.append(Paragraph(f"Updated {datetime.date.today():%B %Y}. Full and current details: " + link(SITE + "/basketball.html", SITE + "/basketball.html"),
                       small))
    doc.build(s)
    print("wrote", OUT)


if __name__ == "__main__":
    OUT.parent.mkdir(exist_ok=True)
    build()
