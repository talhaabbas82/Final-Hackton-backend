const categoryLexicon = {
  "Web Development": [
    "javascript",
    "react",
    "css",
    "html",
    "portfolio",
    "frontend",
  ],
  Design: ["figma", "poster", "ui", "ux", "layout", "design"],
  Career: ["internship", "interview", "career", "resume", "job"],
  Community: ["event", "community", "volunteer", "support", "mentor"],
};

export const suggestCategory = (title = "", description = "") => {
  const text = `${title} ${description}`.toLowerCase();
  for (const [category, words] of Object.entries(categoryLexicon)) {
    if (words.some((word) => text.includes(word))) return category;
  }
  return "Community";
};

export const detectUrgency = (description = "") => {
  const text = description.toLowerCase();
  if (/(urgent|today|asap|deadline|tomorrow|submission)/.test(text))
    return "High";
  if (/(soon|this week|quick|fast)/.test(text)) return "Medium";
  return "Low";
};

export const suggestTags = (title = "", description = "") => {
  const text = `${title} ${description}`.toLowerCase();
  const tags = [];
  if (text.includes("react")) tags.push("React");
  if (text.includes("javascript")) tags.push("JavaScript");
  if (text.includes("figma")) tags.push("Figma");
  if (text.includes("portfolio")) tags.push("Portfolio");
  if (text.includes("interview")) tags.push("Interview Prep");
  if (text.includes("css")) tags.push("HTML/CSS");
  if (!tags.length) tags.push("Community Support");
  return tags.slice(0, 4);
};

export const suggestRewrite = (description = "") =>
  description?.trim()
    ? `${description.trim()} Please include your current blockers, timeline, and expected outcome.`
    : "Explain your challenge, current progress, deadline, and exact support needed.";

export function analyzeRequest(title, description) {
  return {
    suggestedCategory: suggestCategory(title, description),
    detectedUrgency: detectUrgency(description),
    suggestedTags: suggestTags(title, description),
    rewriteSuggestion: suggestRewrite(description),
  };
}
