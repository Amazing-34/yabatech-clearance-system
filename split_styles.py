
from pathlib import Path
import re

root = Path("src")
source = root / "styles.css"
output = root / "styles"

if not source.exists():
    raise SystemExit("Cannot find src/styles.css. Run this script from your project root.")

css = source.read_text(encoding="utf-8")

# Extract complete top-level CSS rules, including nested media blocks.
rules = []
i = 0
while i < len(css):
    while i < len(css) and (css[i].isspace() or css[i] == ";"):
        i += 1

    if i >= len(css):
        break

    start = i
    quote = None
    parens = 0

    while i < len(css):
        c = css[i]
        if quote:
            if c == quote and (i == 0 or css[i - 1] != "\\"):
                quote = None
        elif c in "\"'":
            quote = c
        elif c == "(":
            parens += 1
        elif c == ")":
            parens -= 1
        elif c == ";" and parens == 0:
            rules.append(css[start:i + 1].strip())
            i += 1
            break
        elif c == "{" and parens == 0:
            depth = 1
            i += 1
            quote = None
            while i < len(css) and depth:
                c = css[i]
                if quote:
                    if c == quote and css[i - 1] != "\\":
                        quote = None
                elif c in "\"'":
                    quote = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                i += 1
            rules.append(css[start:i].strip())
            break
        i += 1
    else:
        break

files = {
    "variables.css": [],
    "base.css": [],
    "layout.css": [],
    "components.css": [],
    "forms.css": [],
    "dashboard.css": [],
    "responsive.css": [],
}

layout = (
    ".topbar", ".hero", ".hero-art", ".feature-strip",
    ".process-section", ".steps-grid", ".cta-band", ".site-footer",
    ".login-layout", ".login-aside", ".login-main",
    ".portal-layout", ".portal-sidebar", ".portal-main",
    ".portal-topbar", ".portal-content", ".mobile-menu",
    ".mobile-scrim", ".not-found", ".wrap",
)

forms = (
    ".login-box", ".login-symbol", ".login-subtitle",
    ".password-input", ".show-password", ".form-options",
    ".remember", ".demo-only", ".form-alert", ".notice-banner",
    ".login-submit", ".demo-credentials", ".login-switch",
    ".prototype-note", ".bio-form", ".field", ".form-footer",
    ".saved-message", ".upload-button", ".toggle-label",
    ".review-feedback",
)

dashboard = (
    ".portal-topbar", ".sidebar-caption", ".side-nav",
    ".side-nav-link", ".sidebar-bottom", ".prototype-mini",
    ".logout-link", ".topbar-status", ".page-heading",
    ".status-badge", ".status-pending", ".status-approved",
    ".status-added", ".status-rejected", ".status-not-started",
    ".welcome-panel", ".welcome-chip", ".welcome-art",
    ".stat-grid", ".stat-card", ".stat-icon", ".stat-label",
    ".stat-value", ".stat-note", ".portal-card", ".card-title-row",
    ".card-icon", ".identity-grid", ".info-item", ".document-counter",
    ".upload-list", ".upload-row", ".upload-number", ".upload-info",
    ".upload-disclaimer", ".timeline", ".timeline-item",
    ".timeline-marker", ".feedback-banner", ".demo-tag",
    ".admin-stats", ".table-wrap", ".records-table", ".table-action",
    ".review-card", ".review-summary", ".fee-verification",
    ".subheading", ".admin-document-list", ".admin-document",
    ".review-actions", ".unavailable", ".clearance-paper",
    ".slip-header", ".slip-mark", ".slip-approved", ".slip-grid",
    ".slip-note", ".slip-signatures",
)

def selector_text(rule):
    return rule.split("{", 1)[0].strip()

for rule in rules:
    head = selector_text(rule)

    if head.startswith("@media"):
        files["responsive.css"].append(rule)
    elif head.startswith("@import"):
        files["base.css"].append(rule)
    elif head == ":root":
        files["variables.css"].append(rule)
    elif head.startswith("@"):
        files["base.css"].append(rule)
    elif head in ("*", "html", "body") or head.startswith(
        ("button", "input", "textarea", "a", ".wrap")
    ):
        files["base.css"].append(rule)
    elif any(s in head for s in forms):
        files["forms.css"].append(rule)
    elif any(s in head for s in dashboard):
        files["dashboard.css"].append(rule)
    elif any(s in head for s in layout):
        files["layout.css"].append(rule)
    else:
        files["components.css"].append(rule)

output.mkdir(parents=True, exist_ok=True)

for filename, items in files.items():
    content = "\n\n".join(items).strip()
    (output / filename).write_text(
        content + ("\n" if content else ""),
        encoding="utf-8"
    )

# Preserve the existing import in main.jsx.
imports = "\n".join(
    f'@import "./styles/{name}";'
    for name in files
)

source.write_text(imports + "\n", encoding="utf-8")

print("CSS split completed.")
for filename, items in files.items():
    print(f"{filename}: {len(items)} rules")
print("Next, run: npm run build")
