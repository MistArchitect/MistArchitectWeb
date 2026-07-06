# Mist Architect Website Context

This context defines project-specific language for the Mist Architect website,
especially around search visibility and client-facing content decisions.

## Language

**Search Result Snippet**:
The short summary text that a search engine shows below a result title, which may come from meta descriptions, visible page copy, or search-engine rewriting.
_Avoid_: subtitle, Bing subtitle, fixed description

**Meta Description**:
The page-level metadata description exposed in HTML to suggest a search summary.
_Avoid_: guaranteed search result text

**Visible Intro Copy**:
The concise public-facing introductory copy near the top of a page.
_Avoid_: hidden SEO text, keyword block

## Relationships

- A **Meta Description** may influence a **Search Result Snippet**, but does not guarantee it.
- A **Search Result Snippet** may be rewritten from **Visible Intro Copy** when the search engine considers the page text more relevant.
- **Visible Intro Copy** is client-facing website content and requires owner approval before material wording changes.
- Contact availability may be mentioned in a **Search Result Snippet**, but direct phone numbers, email addresses, and street addresses should remain on the contact page rather than being targeted for snippet display.
- For `/zh/about` and `/en/about`, the desired **Search Result Snippet** direction is business-clear first: explain what the studio does before expressing brand atmosphere.
- Chinese and English About summaries should stay semantically aligned, with the English page carrying a natural translation of the approved Chinese direction.
- About summary wording should retain the founders, **Cheng Bo** and **Li Bo**, after the studio location and service focus rather than leading with founder identity.

## Example dialogue

> **Dev:** "Should we change the Search Result Snippet directly?"
> **Domain expert:** "We cannot set it directly. We can adjust the Meta Description and, where approved, the Visible Intro Copy that Bing may use."

## Flagged ambiguities

- "副标题内容" was used for the red-box text in Bing results; resolved: this means **Search Result Snippet**, not page title, site name, sitelinks, or a guaranteed metadata field.
- `/zh/about` visible introductory wording may be adjusted conservatively to influence the **Search Result Snippet**, but not as hidden SEO text or broad brand repositioning.
- Contact information in search summaries was clarified: target wording may mention that contact details are available, but should not try to expose direct phone, email, or street address in the **Search Result Snippet**.
- `/zh/about` and `/en/about` target summary tone was resolved as business-clear rather than primarily poetic or brand-atmospheric.
- English About summary wording should reflect the updated Chinese direction rather than diverging into a different positioning.
- Founder information was retained in the target About summary, but placed after the business/service description.
