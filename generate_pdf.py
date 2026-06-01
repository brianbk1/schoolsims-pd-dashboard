from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
import math

W, H = letter  # 612 x 792

# ── Brand Colors ──────────────────────────────────────────────────────────────
NAVY      = colors.HexColor("#1E2D6B")
NAVY_DARK = colors.HexColor("#131E4A")
MAROON    = colors.HexColor("#8B1A2E")
BLUE_ACC  = colors.HexColor("#2E6DB4")
WHITE     = colors.white
BG        = colors.HexColor("#F4F5FA")
BORDER    = colors.HexColor("#D6DAE8")
MUTED     = colors.HexColor("#6B7A9A")
SUCCESS   = colors.HexColor("#2E6B50")
WARNING   = colors.HexColor("#8B5A1A")
SUCCESS_L = colors.HexColor("#E8F4EF")
WARNING_L = colors.HexColor("#FBF3E8")
MAROON_L  = colors.HexColor("#F6EAEC")
BLUE_L    = colors.HexColor("#E8F0FA")

COMP_COLORS = {
    "Lead with Courage": MAROON,
    "Build Culture":     NAVY,
    "Lead Academics":    BLUE_ACC,
    "Develop People":    colors.HexColor("#5A3472"),
    "Manage Operations": SUCCESS,
    "Beliefs & Values":  WARNING,
}

# ── Data ──────────────────────────────────────────────────────────────────────
DISTRICT = {
    "label": "K-12 District",
    "program": "APS Aspiring Leaders Program",
    "org": "Atlanta Public Schools",
    "duration": "August – May",
    "participants": 42,
    "completion": 18,
    "competencies": ["Lead with Courage","Build Culture","Lead Academics","Develop People","Manage Operations","Beliefs & Values"],
    "pillars": ["Professional Development","Essential Experiences","School Improvement Project","Coaching","70/20/10 Plan","Community of Practice"],
    "pillar_pct": [20, 20, 25, 15, 10, 10],
    "comp_pct":   [22, 18, 15, 20, 12, 25],
    "months": [
        ("August",    [("Attend Program Orientation","Workshop","Beliefs & Values"),
                       ("Review Program Expectations","Planning","Beliefs & Values"),
                       ("Meet Assigned Coach","Coaching","Develop People"),
                       ("Submit School Improvement Project Charter","Project","Lead Academics")]),
        ("September", [("Obtain Project Approval","Project","Lead Academics"),
                       ("Complete Monthly Essential Experience","Experience","Lead with Courage"),
                       ("Coaching Session #1","Coaching","Develop People"),
                       ("Create 70/20/10 Plan","Planning","Beliefs & Values")]),
        ("October",   [("Attend Courageous Conversations Workshop","Workshop","Lead with Courage"),
                       ("Coaching Session #2","Coaching","Develop People"),
                       ("Receive 70/20/10 Plan Approval","Planning","Beliefs & Values")]),
        ("November",  [("Complete Data Analysis Activity","Assessment","Lead Academics"),
                       ("Monthly Essential Experience","Experience","Lead with Courage"),
                       ("Coaching Session #3","Coaching","Develop People")]),
        ("December",  [("Complete Mock Interview","Assessment","Lead with Courage"),
                       ("Upload Reflection and Feedback","Reflection","Beliefs & Values")]),
        ("January",   [("Complete Operations Learning Module","Workshop","Manage Operations"),
                       ("Create School Budget Reflection","Reflection","Manage Operations")]),
        ("February",  [("Create School Culture Improvement Plan","Project","Build Culture"),
                       ("Submit Community Engagement Action Plan","Project","Build Culture")]),
        ("March",     [("Complete Talent Development Action Plan","Planning","Develop People"),
                       ("Document Coaching Cycle Evidence","Reflection","Develop People")]),
        ("April",     [("Complete Supplemental Learning Requirement","Experience","Lead Academics"),
                       ("Upload Final Project Artifacts","Project","Lead Academics")]),
        ("May",       [("Present School Improvement Project","Assessment","Lead Academics"),
                       ("Complete End-of-Year Reflection","Reflection","Beliefs & Values")]),
    ],
    "narrative": (
        "The APS Aspiring Leaders Program is a comprehensive, year-long leadership development initiative "
        "designed to prepare 42 high-potential educators for school leadership roles within Atlanta Public Schools. "
        "Structured across the full academic year from August through May, the program integrates five core pillars — "
        "Professional Development, Hands-On Practice, Community of Practice, Personalized Coaching, and individualized "
        "70/20/10 Development Plans — to develop leaders across six PSEL-aligned competency domains. "
        "Participants engage in monthly coaching sessions, school improvement projects, essential experiences, "
        "and simulation-based practice to bridge theory and applied leadership. The program's multi-modal design "
        "ensures both accountability and growth, culminating in a formal School Improvement Project presentation "
        "and end-of-year reflection."
    ),
    "risks": [
        "Early-stage completion rates (10–25%) suggest participants may need proactive outreach and accountability structures to maintain momentum through Q2.",
        "Coaching session completion is the lowest-tracked pillar at 15% — consistent scheduling and coach capacity should be monitored closely.",
        "School Improvement Projects require early charter approval; delays in September could compress milestone timelines in spring months.",
    ],
    "recommendations": [
        "Implement bi-weekly cohort check-ins through November to establish habits before holiday disruptions affect momentum.",
        "Assign simulation experiences in October aligned to the Courageous Conversations workshop to reinforce applied learning.",
        "Build a shared digital evidence portfolio system by September to reduce artifact submission friction in April–May.",
    ],
    "simulations": [
        ("Lead With Courage", ["Difficult Teacher Conversation","Parent Conflict Scenario","Staff Performance Improvement"]),
        ("Develop People",    ["Teacher Coaching Cycle","Observation & Feedback","Mentoring New Staff"]),
        ("Manage Operations", ["Budget Crisis Response","Scheduling Conflict","Safety Incident Protocol"]),
    ],
}

HIGHER_ED = {
    "label": "Higher Education",
    "program": "Educational Leadership Faculty Cohort",
    "org": "University Professional Learning Institute",
    "duration": "September – April",
    "participants": 28,
    "completion": 12,
    "competencies": ["Instructional Design","Curriculum Leadership","Research Integration","Faculty Mentoring","Program Assessment","Equity & Inclusion"],
    "pillars": ["Faculty Development","Simulation Practice","Peer Learning Community","Individual Coaching","Capstone Project"],
    "pillar_pct": [18, 15, 20, 12, 8],
    "comp_pct":   [20, 14, 18, 22, 10, 16],
    "months": [
        ("September", [("Cohort Orientation & Goal Setting","Workshop","Equity & Inclusion"),
                       ("Meet Faculty Mentor","Coaching","Faculty Mentoring"),
                       ("Submit Capstone Proposal","Project","Program Assessment")]),
        ("October",   [("Simulation: Difficult Advising Scenario","Simulation","Faculty Mentoring"),
                       ("Peer Learning Session #1","Experience","Equity & Inclusion"),
                       ("Coaching Session #1","Coaching","Faculty Mentoring")]),
        ("November",  [("Curriculum Mapping Workshop","Workshop","Curriculum Leadership"),
                       ("Complete Equity Audit Module","Assessment","Equity & Inclusion"),
                       ("Coaching Session #2","Coaching","Faculty Mentoring")]),
        ("December",  [("Mid-Year Reflection Submission","Reflection","Program Assessment"),
                       ("Peer Learning Session #2","Experience","Equity & Inclusion")]),
        ("January",   [("Research Integration Workshop","Workshop","Research Integration"),
                       ("Simulation: Grade Appeal Scenario","Simulation","Instructional Design"),
                       ("Coaching Session #3","Coaching","Faculty Mentoring")]),
        ("February",  [("Instructional Design Deep Dive","Workshop","Instructional Design"),
                       ("Submit Curriculum Revision Draft","Project","Curriculum Leadership")]),
        ("March",     [("Mentoring Practicum","Experience","Faculty Mentoring"),
                       ("Assessment Framework Review","Assessment","Program Assessment"),
                       ("Coaching Session #4","Coaching","Faculty Mentoring")]),
        ("April",     [("Capstone Project Presentation","Assessment","Program Assessment"),
                       ("Complete End-of-Cohort Reflection","Reflection","Equity & Inclusion"),
                       ("Peer Recognition Ceremony","Experience","Faculty Mentoring")]),
    ],
    "narrative": (
        "The Educational Leadership Faculty Cohort is a nine-month professional learning initiative designed to "
        "prepare 28 higher education faculty for expanded leadership roles in curriculum design, mentoring, and "
        "institutional equity. The program blends simulation-based practice with peer learning communities, "
        "individual coaching, and a culminating capstone project to develop six core competency domains. "
        "Participants engage in monthly experiential learning cycles that connect research to applied practice, "
        "equipping faculty to lead departmental change and support student success at scale. The cohort model "
        "fosters cross-disciplinary collaboration and sustained professional growth across the academic year."
    ),
    "risks": [
        "Faculty scheduling conflicts during mid-semester peaks (October–November) may reduce coaching session attendance and peer learning participation.",
        "Capstone project scope may be too broad without early faculty advisor check-ins — proposal approval in September is critical.",
        "Simulation module adoption depends on LMS integration; delayed setup could push experiential components into later months.",
    ],
    "recommendations": [
        "Offer asynchronous coaching options in November and March to accommodate faculty research and grading cycles.",
        "Pair simulation debriefs with structured peer reflection to deepen learning transfer beyond individual sessions.",
        "Establish a Capstone Advisory Panel by October to provide ongoing faculty guidance and reduce scope creep.",
    ],
    "simulations": [
        ("Instructional Design",  ["Difficult Advising Scenario","Curriculum Conflict","Online Course Redesign"]),
        ("Faculty Mentoring",     ["Struggling Doctoral Student","Promotion Review Conversation","New Faculty Onboarding"]),
        ("Equity & Inclusion",    ["Classroom Bias Incident","Accessibility Accommodation","DEI Committee Leadership"]),
    ],
}

# ── Drawing Helpers ───────────────────────────────────────────────────────────

def draw_header(c, title_text, page_num, total_pages, tab_label):
    """Full-width navy header bar with logo text and tab indicator."""
    # Header bar
    c.setFillColor(NAVY)
    c.rect(0, H - 56, W, 56, fill=1, stroke=0)
    # Maroon accent stripe
    c.setFillColor(MAROON)
    c.rect(0, H - 60, W, 4, fill=1, stroke=0)
    # Logo area
    c.setFillColor(MAROON)
    c.roundRect(20, H - 46, 30, 30, 4, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(35, H - 35, "S")
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(58, H - 33, "SchoolSims")
    c.setFillColor(colors.HexColor("#8A9CC8"))
    c.setFont("Helvetica", 10)
    c.drawString(150, H - 33, "/ AI Cohort Dashboard")
    # Tab pill on right
    pill_text = tab_label
    c.setFillColor(MAROON)
    c.roundRect(W - 170, H - 46, 148, 22, 6, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(W - 96, H - 39, pill_text.upper())
    # Page number
    c.setFillColor(colors.HexColor("#8A9CC8"))
    c.setFont("Helvetica", 8)
    c.drawRightString(W - 20, H - 66, f"Page {page_num} of {total_pages}")


def draw_footer(c, org, program):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, 32, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#8A9CC8"))
    c.setFont("Helvetica", 8)
    c.drawString(20, 11, f"SchoolSims AI Guidebook Engine  ·  {org}  ·  {program}  ·  For demonstration purposes")
    c.setFillColor(MAROON)
    c.rect(0, 32, W, 2, fill=1, stroke=0)


def draw_progress_bar(c, x, y, width, height, pct, fill_color, bg_color=BORDER):
    c.setFillColor(bg_color)
    c.roundRect(x, y, width, height, height/2, fill=1, stroke=0)
    if pct > 0:
        bar_w = max(width * min(pct, 100) / 100, height)
        c.setFillColor(fill_color)
        c.roundRect(x, y, bar_w, height, height/2, fill=1, stroke=0)


def draw_card(c, x, y, w, h, fill=None, border_color=None, radius=6):
    c.setFillColor(fill or WHITE)
    c.setStrokeColor(border_color or BORDER)
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def draw_stat_tile(c, x, y, w, h, label, value, icon_color):
    draw_card(c, x, y, w, h)
    # color bar on left
    c.setFillColor(icon_color)
    c.roundRect(x, y, 5, h, 3, fill=1, stroke=0)
    # value
    c.setFillColor(icon_color)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(x + 18, y + h - 32, str(value))
    # label
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(x + 18, y + 10, label)


def draw_badge(c, x, y, text, bg_color, text_color=None):
    tc = text_color or bg_color
    c.setFillColor(colors.HexColor(bg_color.hexval() + "33") if hasattr(bg_color, 'hexval') else BG)
    w = len(text) * 5.5 + 10
    c.roundRect(x, y, w, 13, 4, fill=1, stroke=0)
    c.setFillColor(tc)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(x + 5, y + 3, text.upper())
    return w


def hex_to_rl(hexstr):
    return colors.HexColor(hexstr)


def wrap_text_lines(text, max_chars):
    words = text.split()
    lines = []
    cur = ""
    for w in words:
        if len(cur) + len(w) + 1 <= max_chars:
            cur = (cur + " " + w).strip()
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


# ── Page 1: Overview ──────────────────────────────────────────────────────────

def draw_overview(c, data):
    draw_header(c, data["program"], 1, 4, "Overview")

    # Program banner
    c.setFillColor(colors.HexColor("#F0F2FA"))
    c.rect(20, H - 110, W - 40, 46, fill=1, stroke=0)
    c.setFillColor(MAROON)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(28, H - 76, data["org"].upper())
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(28, H - 92, data["program"])
    # Meta right side
    meta = f"{data['duration']}   ·   {data['participants']} Participants   ·   {len(data['months'])} Months   ·   {sum(len(t) for _,t in data['months'])} Tasks"
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawRightString(W - 28, H - 80, meta)
    # Completion big number
    c.setFillColor(MAROON)
    c.setFont("Helvetica-Bold", 28)
    c.drawRightString(W - 28, H - 98, f"{data['completion']}%")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawRightString(W - 28, H - 108, "Overall Completion")

    # ── Stat tiles row ────────────────────────────────────────────────────────
    tile_y = H - 158
    tile_w = (W - 50) / 4 - 4
    tiles = [
        ("Participants", data["participants"], NAVY),
        ("Total Tasks", sum(len(t) for _,t in data["months"]), MAROON),
        ("Competencies", len(data["competencies"]), BLUE_ACC),
        ("Program Months", len(data["months"]), SUCCESS),
    ]
    for i, (label, val, col) in enumerate(tiles):
        draw_stat_tile(c, 20 + i * (tile_w + 5), tile_y, tile_w, 42, label, val, col)

    # ── Pillar Progress (left col) ────────────────────────────────────────────
    col_left_x = 20
    col_left_w = (W - 50) * 0.55
    card_y = tile_y - 200
    draw_card(c, col_left_x, card_y, col_left_w, 188)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(col_left_x + 12, card_y + 174, "Program Pillar Progress")
    bar_colors = [MAROON, NAVY, BLUE_ACC, colors.HexColor("#5A3472"), SUCCESS, WARNING]
    for i, (pillar, pct) in enumerate(zip(data["pillars"], data["pillar_pct"])):
        by = card_y + 155 - i * 28
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 8)
        c.drawString(col_left_x + 12, by, pillar[:38])
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Bold", 8)
        c.drawRightString(col_left_x + col_left_w - 12, by, f"{pct}%")
        draw_progress_bar(c, col_left_x + 12, by - 11, col_left_w - 24, 7, pct, bar_colors[i % 6])

    # ── Right column: Tasks by Type + Alerts ──────────────────────────────────
    col_right_x = col_left_x + col_left_w + 10
    col_right_w = W - 40 - col_left_w - 10

    # Tasks by type card
    type_counts = {}
    for _, tasks in data["months"]:
        for t in tasks:
            type_counts[t[1]] = type_counts.get(t[1], 0) + 1
    type_card_h = 14 + len(type_counts) * 20 + 14
    type_card_y = card_y + 188 - type_card_h
    draw_card(c, col_right_x, type_card_y, col_right_w, type_card_h)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(col_right_x + 10, type_card_y + type_card_h - 16, "Tasks by Type")
    total_t = sum(type_counts.values())
    for i, (ttype, cnt) in enumerate(sorted(type_counts.items(), key=lambda x: -x[1])):
        ty = type_card_y + type_card_h - 34 - i * 20
        c.setFillColor(bar_colors[i % 6])
        c.rect(col_right_x + 10, ty + 3, 8, 8, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 8)
        c.drawString(col_right_x + 22, ty + 3, ttype)
        bar_w = (col_right_w - 60) * cnt / total_t
        c.setFillColor(BORDER)
        c.roundRect(col_right_x + col_right_w - 42, ty + 4, 30, 5, 2, fill=1, stroke=0)
        c.setFillColor(bar_colors[i % 6])
        c.roundRect(col_right_x + col_right_w - 42, ty + 4, max(bar_w * 30 / (col_right_w - 60), 3), 5, 2, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8)
        c.drawRightString(col_right_x + col_right_w - 10, ty + 3, str(cnt))

    # Alerts card
    alert_card_y = card_y
    alert_card_h = type_card_y - card_y - 8
    draw_card(c, col_right_x, alert_card_y, col_right_w, alert_card_h, fill=WARNING_L, border_color=WARNING)
    c.setFillColor(WARNING)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(col_right_x + 10, alert_card_y + alert_card_h - 16, "⚠  AI Action Alerts")
    ay = alert_card_y + alert_card_h - 32
    for risk in data["risks"][:2]:
        c.setFillColor(WARNING)
        c.rect(col_right_x + 10, ay - 2, 2, 26, fill=1, stroke=0)
        lines = wrap_text_lines(risk, 32)[:3]
        for ln in lines:
            c.setFillColor(colors.HexColor("#5C3A00"))
            c.setFont("Helvetica", 7)
            c.drawString(col_right_x + 16, ay, ln)
            ay -= 9
        ay -= 6

    # ── Recommendations row ───────────────────────────────────────────────────
    rec_y = card_y - 86
    draw_card(c, 20, rec_y, W - 40, 78, fill=BLUE_L, border_color=BLUE_ACC)
    c.setFillColor(BLUE_ACC)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(32, rec_y + 64, "💡  AI Recommendations")
    rec_w = (W - 60) / 3 - 4
    for i, rec in enumerate(data["recommendations"]):
        rx = 28 + i * (rec_w + 6)
        draw_card(c, rx, rec_y + 8, rec_w, 48)
        c.setFillColor(BLUE_ACC)
        c.rect(rx, rec_y + 8, 3, 48, fill=1, stroke=0)
        c.setFillColor(BLUE_ACC)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(rx + 8, rec_y + 48, f"#{i+1}")
        lines = wrap_text_lines(rec, 42)[:4]
        for j, ln in enumerate(lines):
            c.setFillColor(NAVY)
            c.setFont("Helvetica", 7.5)
            c.drawString(rx + 8, rec_y + 38 - j * 9, ln)

    draw_footer(c, data["org"], data["program"])


# ── Page 2: Task Timeline ──────────────────────────────────────────────────────

def draw_timeline(c, data):
    draw_header(c, data["program"], 2, 4, "Task Timeline")

    col_colors = [MAROON, NAVY, colors.HexColor("#9E2235"), colors.HexColor("#253580"),
                  colors.HexColor("#7A1728"), colors.HexColor("#172560"),
                  MAROON, NAVY, colors.HexColor("#9E2235"), colors.HexColor("#253580")]

    # Two-column layout
    months = data["months"]
    mid = math.ceil(len(months) / 2)
    col1 = months[:mid]
    col2 = months[mid:]

    def draw_month_col(months_list, start_x, col_w, start_y):
        y = start_y
        for mi, (month, tasks) in enumerate(months_list):
            mc = col_colors[mi % len(col_colors)]
            row_h = 18 + len(tasks) * 22
            if y - row_h < 44:
                break
            # Month label
            c.setFillColor(mc)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(start_x, y, month)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 7)
            c.drawString(start_x, y - 10, f"{len(tasks)} tasks")
            # Timeline dot and line
            dot_x = start_x + 82
            c.setFillColor(mc)
            c.circle(dot_x, y - 2, 4, fill=1, stroke=0)
            if mi < len(months_list) - 1:
                c.setStrokeColor(colors.HexColor("#D6DAE8"))
                c.setLineWidth(1)
                c.line(dot_x, y - 8, dot_x, y - row_h + 4)
            # Tasks
            for ti, (title, ttype, comp) in enumerate(tasks):
                ty = y - 18 - ti * 22
                card_x = start_x + 92
                card_w = col_w - 92
                draw_card(c, card_x, ty - 14, card_w, 18, border_color=mc)
                c.setFillColor(mc)
                c.roundRect(card_x, ty - 14, 3, 18, 2, fill=1, stroke=0)
                c.setFillColor(NAVY)
                c.setFont("Helvetica-Bold", 7.5)
                c.drawString(card_x + 7, ty - 4, title[:36])
                # Type badge
                badge_x = card_x + 7
                c.setFillColor(colors.HexColor("#E8ECF5"))
                bw = len(ttype) * 4.5 + 8
                c.roundRect(badge_x, ty - 13, bw, 8, 2, fill=1, stroke=0)
                c.setFillColor(NAVY)
                c.setFont("Helvetica", 6)
                c.drawString(badge_x + 4, ty - 11, ttype)
            y -= row_h + 8

    top_y = H - 80
    col_gap = 14
    col_w = (W - 40 - col_gap) / 2

    draw_month_col(col1, 20, col_w, top_y)
    draw_month_col(col2, 20 + col_w + col_gap, col_w, top_y)

    draw_footer(c, data["org"], data["program"])


# ── Page 3: Competencies ──────────────────────────────────────────────────────

def draw_competencies(c, data):
    draw_header(c, data["program"], 3, 4, "Competencies")

    comps = data["competencies"]
    pcts  = data["comp_pct"]
    all_tasks = [(t[0], t[1], t[2], m) for m, tasks in data["months"] for t in tasks]

    # 3-column grid
    card_w = (W - 50) / 3 - 4
    card_h = 162
    start_y = H - 80

    comp_col_list = [MAROON, NAVY, BLUE_ACC, colors.HexColor("#5A3472"), SUCCESS, WARNING]

    for i, (comp, pct) in enumerate(zip(comps, pcts)):
        col = i % 3
        row = i // 3
        cx = 20 + col * (card_w + 8)
        cy = start_y - row * (card_h + 10) - card_h

        color = comp_col_list[i % 6]
        related = [t for t in all_tasks if t[2] == comp]

        draw_card(c, cx, cy, card_w, card_h)

        # Color top bar
        c.setFillColor(color)
        c.roundRect(cx, cy + card_h - 8, card_w, 8, 4, fill=1, stroke=0)
        c.rect(cx, cy + card_h - 10, card_w, 6, fill=1, stroke=0)

        # Score
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", 26)
        c.drawRightString(cx + card_w - 12, cy + card_h - 40, f"{pct}%")

        # Icon circle
        c.setFillColor(colors.HexColor(f"{color.hexval()}22") if hasattr(color,'hexval') else BG)
        icons = ["💪","🌱","📚","🤝","⚙","🎯"]
        c.circle(cx + 28, cy + card_h - 28, 16, fill=1, stroke=0)
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(cx + 28, cy + card_h - 32, icons[i % 6])

        # Name
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 9)
        name_lines = wrap_text_lines(comp, 22)
        for j, ln in enumerate(name_lines[:2]):
            c.drawString(cx + 12, cy + card_h - 52 - j * 11, ln)

        # Task count
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7)
        c.drawString(cx + 12, cy + card_h - 68, f"{len(related)} tasks aligned")

        # Progress bar
        draw_progress_bar(c, cx + 12, cy + card_h - 80, card_w - 24, 6, pct, color)

        # Divider
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.line(cx + 12, cy + card_h - 90, cx + card_w - 12, cy + card_h - 90)

        # Aligned tasks list
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(cx + 12, cy + card_h - 102, "ALIGNED TASKS")
        for ti, task in enumerate(related[:4]):
            ty = cy + card_h - 115 - ti * 12
            c.setFillColor(color)
            c.circle(cx + 16, ty + 3, 2, fill=1, stroke=0)
            c.setFillColor(NAVY)
            c.setFont("Helvetica", 7)
            c.drawString(cx + 22, ty, task[0][:30])
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 6)
            c.drawRightString(cx + card_w - 10, ty, task[3])
        if len(related) > 4:
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 6.5)
            c.drawString(cx + 14, cy + card_h - 115 - 4 * 12, f"+{len(related)-4} more")

    draw_footer(c, data["org"], data["program"])


# ── Page 4: AI Narrative ──────────────────────────────────────────────────────

def draw_narrative(c, data):
    draw_header(c, data["program"], 4, 4, "AI Narrative")

    # Program summary sidebar
    summary_x = W - 180
    summary_y = H - 80
    summary_h = 210
    draw_card(c, summary_x, summary_y - summary_h, 158, summary_h)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(summary_x + 10, summary_y - 18, "Program Summary")
    rows = [
        ("Program", data["program"][:24]),
        ("Organization", data["org"][:22]),
        ("Duration", data["duration"]),
        ("Participants", str(data["participants"])),
        ("Total Tasks", str(sum(len(t) for _,t in data["months"]))),
        ("Completion", f"{data['completion']}%"),
    ]
    for i, (k, v) in enumerate(rows):
        ry = summary_y - 36 - i * 28
        c.setFillColor(BG)
        c.rect(summary_x + 8, ry - 8, 142, 24, fill=1, stroke=0)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7)
        c.drawString(summary_x + 12, ry + 7, k)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(summary_x + 12, ry - 4, v)

    # AI Narrative card
    narr_x = 20
    narr_w = summary_x - 30
    narr_h = 155
    narr_y = H - 80 - narr_h
    draw_card(c, narr_x, narr_y, narr_w, narr_h, fill=BG)
    c.setFillColor(MAROON)
    c.rect(narr_x, narr_y, 4, narr_h, fill=1, stroke=0)

    # Robot icon box
    c.setFillColor(NAVY)
    c.roundRect(narr_x + 12, narr_y + narr_h - 36, 28, 28, 4, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 13)
    c.drawCentredString(narr_x + 26, narr_y + narr_h - 24, "AI")

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(narr_x + 48, narr_y + narr_h - 22, "AI Executive Narrative")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(narr_x + 48, narr_y + narr_h - 34, "Auto-generated from uploaded guidebook")

    # Narrative text
    narr_lines = wrap_text_lines(data["narrative"], 90)
    for i, ln in enumerate(narr_lines[:10]):
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 8.5)
        c.drawString(narr_x + 12, narr_y + narr_h - 54 - i * 11, ln)

    # Risk & Recommendations below
    half_w = (W - 50) / 2 - 4
    box_y = narr_y - 148
    box_h = 135

    # Risk card
    draw_card(c, 20, box_y, half_w, box_h, fill=colors.HexColor("#F6EAEC"), border_color=MAROON)
    c.setFillColor(MAROON)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(30, box_y + box_h - 18, "⚠  Risk Areas")
    for i, risk in enumerate(data["risks"]):
        ry2 = box_y + box_h - 36 - i * 34
        draw_card(c, 28, ry2 - 24, half_w - 16, 30, fill=WHITE)
        c.setFillColor(MAROON)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(34, ry2 - 4, f"Risk {i+1}:")
        lines = wrap_text_lines(risk, 50)[:2]
        for j, ln in enumerate(lines):
            c.setFillColor(NAVY)
            c.setFont("Helvetica", 7)
            c.drawString(34, ry2 - 14 - j * 9, ln)

    # Recommendations card
    rec_x = 20 + half_w + 8
    draw_card(c, rec_x, box_y, half_w, box_h, fill=SUCCESS_L, border_color=SUCCESS)
    c.setFillColor(SUCCESS)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(rec_x + 10, box_y + box_h - 18, "✓  Recommendations")
    for i, rec in enumerate(data["recommendations"]):
        ry2 = box_y + box_h - 36 - i * 34
        draw_card(c, rec_x + 8, ry2 - 24, half_w - 16, 30, fill=WHITE)
        c.setFillColor(SUCCESS)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(rec_x + 14, ry2 - 4, f"#{i+1}:")
        lines = wrap_text_lines(rec, 50)[:2]
        for j, ln in enumerate(lines):
            c.setFillColor(NAVY)
            c.setFont("Helvetica", 7)
            c.drawString(rec_x + 14, ry2 - 14 - j * 9, ln)

    # Simulation Integration footer box
    sim_y = box_y - 96
    draw_card(c, 20, sim_y, W - 40, 84)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(30, sim_y + 70, "Simulation Integration")
    sim_col_w = (W - 56) / 3 - 4
    for i, (sim_name, sims) in enumerate(data.get("simulations", [])):
        sx = 24 + i * (sim_col_w + 6)
        c.setFillColor(col_colors_list[i % 3])
        c.roundRect(sx, sim_y + 8, sim_col_w, 54, 4, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(sx + 8, sim_y + 52, sim_name)
        for j, sim in enumerate(sims):
            c.setFont("Helvetica", 7)
            c.drawString(sx + 8, sim_y + 40 - j * 12, f"› {sim}")

    draw_footer(c, data["org"], data["program"])


col_colors_list = [MAROON, NAVY, BLUE_ACC]


# ── Page 0: Landing / Main Dashboard View ─────────────────────────────────────

def draw_landing_page(c, data):
    """Replicates the main dashboard UI exactly as seen in the React app screenshot."""

    total_tasks = sum(len(t) for _, t in data["months"])

    # ── Full navy gradient header (top ~46% of page) ──────────────────────────
    header_h = 355
    # Dark gradient base
    c.setFillColor(NAVY_DARK)
    c.rect(0, H - header_h, W, header_h, fill=1, stroke=0)
    # Slightly lighter overlay for depth
    c.setFillColor(NAVY)
    c.rect(0, H - header_h, W, header_h - 40, fill=1, stroke=0)

    # ── Nav bar ───────────────────────────────────────────────────────────────
    nav_h = 52
    c.setFillColor(NAVY_DARK)
    c.rect(0, H - nav_h, W, nav_h, fill=1, stroke=0)

    # S logo badge
    c.setFillColor(MAROON)
    c.roundRect(16, H - nav_h + 10, 32, 32, 5, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 15)
    c.drawCentredString(32, H - nav_h + 22, "S")

    # SchoolSims wordmark
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(56, H - nav_h + 22, "SchoolSims")

    # Subtitle
    c.setFillColor(colors.HexColor("#8A9CC8"))
    c.setFont("Helvetica", 9)
    c.drawString(148, H - nav_h + 22, "/ AI Cohort Dashboard")

    # "AI Generated" pill badge top-right
    c.setFillColor(colors.HexColor("#5A1222"))
    c.roundRect(W - 120, H - nav_h + 14, 104, 22, 6, fill=1, stroke=0)
    c.setStrokeColor(MAROON)
    c.setLineWidth(1)
    c.roundRect(W - 120, H - nav_h + 14, 104, 22, 6, fill=0, stroke=1)
    c.setFillColor(MAROON)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(W - 68, H - nav_h + 22, "AI GENERATED")

    # "Sample Preview" pill
    c.setFillColor(colors.HexColor("#131E4A"))
    c.roundRect(W - 232, H - nav_h + 14, 104, 22, 6, fill=1, stroke=0)
    c.setStrokeColor(NAVY)
    c.setLineWidth(1)
    c.roundRect(W - 232, H - nav_h + 14, 104, 22, 6, fill=0, stroke=1)
    c.setFillColor(colors.HexColor("#8A9CC8"))
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(W - 180, H - nav_h + 22, "SAMPLE PREVIEW")

    # ── Program info block ────────────────────────────────────────────────────
    info_top = H - nav_h - 18

    # Org label in maroon caps
    c.setFillColor(MAROON)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(24, info_top, data["org"].upper())

    # Program title — large bold white
    prog_words = data["program"].split()
    # Split into up to 2 lines
    line1 = " ".join(prog_words[:4])
    line2 = " ".join(prog_words[4:]) if len(prog_words) > 4 else ""
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(24, info_top - 26, line1)
    if line2:
        c.drawString(24, info_top - 50, line2)

    meta_y = info_top - (68 if line2 else 50)

    # Meta row: duration · participants · months · tasks
    meta_items = [
        f"📅  {data['duration']}",
        f"👥  {data['participants']} Participants",
        f"📚  {len(data['months'])} Months",
        f"✅  {total_tasks} Tasks",
    ]
    c.setFillColor(colors.HexColor("#B0BED8"))
    c.setFont("Helvetica", 9)
    mx = 24
    for item in meta_items:
        c.drawString(mx, meta_y, item)
        mx += c.stringWidth(item, "Helvetica", 9) + 18

    # ── Big completion % centered ──────────────────────────────────────────────
    pct_y = meta_y - 62
    c.setFillColor(MAROON)
    c.setFont("Helvetica-Bold", 54)
    c.drawCentredString(W / 2, pct_y, f"{data['completion']}%")
    c.setFillColor(colors.HexColor("#B0BED8"))
    c.setFont("Helvetica", 10)
    c.drawCentredString(W / 2, pct_y - 16, "Overall Completion")

    # Progress bar below %
    bar_w = W - 48
    bar_y = pct_y - 32
    c.setFillColor(colors.HexColor("#FFFFFF22"))
    c.roundRect(24, bar_y, bar_w, 7, 3, fill=1, stroke=0)
    c.setFillColor(MAROON)
    c.roundRect(24, bar_y, max(bar_w * data["completion"] / 100, 8), 7, 3, fill=1, stroke=0)

    # ── Tab bar ───────────────────────────────────────────────────────────────
    tab_bar_y = H - header_h  # sits right at the boundary
    tab_h = 38
    tabs = ["📊  Overview", "📅  Task Timeline", "🎯  Competencies", "🤖  AI Narrative"]
    tab_w = W / len(tabs)

    for i, tab in enumerate(tabs):
        tx = i * tab_w
        if i == 0:
            # Active tab — white background
            c.setFillColor(WHITE)
            c.roundRect(tx + 2, tab_bar_y - tab_h + 4, tab_w - 4, tab_h, 6, fill=1, stroke=0)
            c.setFillColor(NAVY)
            c.setFont("Helvetica-Bold", 9)
        else:
            c.setFillColor(colors.HexColor("#B0BED8"))
            c.setFont("Helvetica", 9)
        c.drawCentredString(tx + tab_w / 2, tab_bar_y - tab_h + 17, tab)

    # ── Overview content area (white background) ───────────────────────────────
    content_y = tab_bar_y - tab_h
    content_h = content_y - 32  # down to footer
    c.setFillColor(BG)
    c.rect(0, 32, W, content_h, fill=1, stroke=0)

    # ── Stat tiles row (4 across) ──────────────────────────────────────────────
    tile_margin = 14
    tile_gap = 8
    tile_w = (W - tile_margin * 2 - tile_gap * 3) / 4
    tile_h = 52
    tile_y = content_y - tile_h - 12
    tile_data = [
        ("Participants",    data["participants"], NAVY),
        ("Total Tasks",     total_tasks,          MAROON),
        ("Competencies",    len(data["competencies"]), BLUE_ACC),
        ("Program Months",  len(data["months"]),   SUCCESS),
    ]
    for i, (label, val, col) in enumerate(tile_data):
        tx = tile_margin + i * (tile_w + tile_gap)
        draw_card(c, tx, tile_y, tile_w, tile_h)
        # Left color bar
        c.setFillColor(col)
        c.roundRect(tx, tile_y, 5, tile_h, 3, fill=1, stroke=0)
        c.setFillColor(col)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(tx + 14, tile_y + tile_h - 28, str(val))
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7.5)
        c.drawString(tx + 14, tile_y + 9, label)

    # ── Two-column section: Pillar Progress + Tasks by Type ────────────────────
    two_col_y = tile_y - 12
    left_w = (W - tile_margin * 2) * 0.58
    right_w = W - tile_margin * 2 - left_w - 8
    two_col_h = two_col_y - 32 - 8

    # Left card: Pillar Progress
    draw_card(c, tile_margin, 40, left_w, two_col_h)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(tile_margin + 10, 40 + two_col_h - 16, "Program Pillar Progress")

    bar_colors_list = [MAROON, NAVY, BLUE_ACC, colors.HexColor("#5A3472"), SUCCESS, WARNING]
    num_pillars = len(data["pillars"])
    for i, (pillar, pct) in enumerate(zip(data["pillars"], data["pillar_pct"])):
        row_h = (two_col_h - 28) / num_pillars
        py = 40 + two_col_h - 30 - (i + 1) * row_h + 8
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 7.5)
        c.drawString(tile_margin + 10, py + 10, pillar[:34])
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawRightString(tile_margin + left_w - 10, py + 10, f"{pct}%")
        draw_progress_bar(c, tile_margin + 10, py, left_w - 20, 6, pct, bar_colors_list[i % 6])

    # Right card: Tasks by Type
    right_x = tile_margin + left_w + 8
    draw_card(c, right_x, 40, right_w, two_col_h)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(right_x + 10, 40 + two_col_h - 16, "Tasks by Type")

    type_counts = {}
    for _, tasks in data["months"]:
        for t in tasks:
            type_counts[t[1]] = type_counts.get(t[1], 0) + 1
    sorted_types = sorted(type_counts.items(), key=lambda x: -x[1])
    total_t = sum(type_counts.values())
    row_h_t = (two_col_h - 28) / max(len(sorted_types), 1)

    for i, (ttype, cnt) in enumerate(sorted_types):
        ty = 40 + two_col_h - 30 - (i + 1) * row_h_t + 6
        c.setFillColor(bar_colors_list[i % 6])
        c.roundRect(right_x + 10, ty + 2, 8, 8, 2, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 7.5)
        c.drawString(right_x + 22, ty + 2, ttype)
        # Mini bar
        mb_w = right_w - 55
        c.setFillColor(BORDER)
        c.roundRect(right_x + right_w - mb_w - 22, ty + 4, mb_w, 5, 2, fill=1, stroke=0)
        c.setFillColor(bar_colors_list[i % 6])
        fill_w = max(mb_w * cnt / total_t, 4)
        c.roundRect(right_x + right_w - mb_w - 22, ty + 4, fill_w, 5, 2, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawRightString(right_x + right_w - 8, ty + 2, str(cnt))

    # ── Footer ────────────────────────────────────────────────────────────────
    draw_footer(c, data["org"], data["program"])


# ── Main ──────────────────────────────────────────────────────────────────────

def build_pdf(data, filepath):
    c = canvas.Canvas(filepath, pagesize=letter)
    c.setTitle(f"SchoolSims AI Dashboard – {data['program']}")
    c.setAuthor("SchoolSims AI Guidebook Engine")

    # Page 1: Landing / Main Dashboard UI
    draw_landing_page(c, data)
    c.showPage()

    # Page 2: Overview
    draw_overview(c, data)
    c.showPage()

    # Page 3: Task Timeline
    draw_timeline(c, data)
    c.showPage()

    # Page 4: Competencies
    draw_competencies(c, data)
    c.showPage()

    # Page 5: AI Narrative
    draw_narrative(c, data)
    c.showPage()

    c.save()
    print(f"✅ Saved: {filepath}")


build_pdf(DISTRICT,  "/mnt/user-data/outputs/SchoolSims_District_Dashboard.pdf")
build_pdf(HIGHER_ED, "/mnt/user-data/outputs/SchoolSims_HigherEd_Dashboard.pdf")
print("Done.")
