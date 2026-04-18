import bcrypt from "bcryptjs";
import { Notification } from "../models/Notification.js";
import { HelpRequest } from "../models/Request.js";
import { User } from "../models/User.js";

export async function seedDemoData() {
  const totalUsers = await User.countDocuments();
  if (totalUsers > 0) return;

  const passwordHash = await bcrypt.hash("password123", 10);
  const [ayesha, hassan, sara] = await User.create([
    {
      fullName: "Ayesha Khan",
      email: "community@helphub.ai",
      passwordHash,
      role: "Both",
      skills: ["Figma", "UI/UX", "HTML/CSS", "Career Guidance"],
      interests: ["Hackathons", "UI/UX", "Community Building"],
      location: "Karachi",
      trustScore: 100,
      badges: ["Design Ally", "Fast Responder", "Top Mentor"],
      contributionCount: 35,
    },
    {
      fullName: "Hassan Ali",
      email: "hassan@helphub.ai",
      passwordHash,
      role: "Can Help",
      skills: ["JavaScript", "React", "Git/GitHub"],
      interests: ["Mentoring", "Frontend"],
      location: "Karachi",
      trustScore: 88,
      badges: ["Code Rescuer", "Bug Hunter"],
      contributionCount: 24,
    },
    {
      fullName: "Sara Noor",
      email: "sara@helphub.ai",
      passwordHash,
      role: "Need Help",
      skills: ["Python", "Data Analysis"],
      interests: ["Career Growth", "Portfolio"],
      location: "Lahore",
      trustScore: 74,
      badges: ["Community Voice"],
      contributionCount: 11,
    },
  ]);

  const requests = await HelpRequest.create([
    {
      requesterId: ayesha._id,
      title: "Need help",
      description: "help needed",
      category: "Web Development",
      urgency: "High",
      tags: [],
      status: "Solved",
      helperIds: [hassan._id],
      aiSummary:
        "Basic support request. Adding more challenge context and deadline will increase match quality.",
      location: "Karachi",
    },
    {
      requesterId: sara._id,
      title: "Need help making my portfolio responsive before demo day",
      description:
        "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.",
      category: "Web Development",
      urgency: "High",
      tags: ["HTML/CSS", "Responsive", "Portfolio"],
      status: "Solved",
      helperIds: [ayesha._id],
      aiSummary:
        "Responsive layout issue with short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.",
      location: "Karachi",
    },
    {
      requesterId: ayesha._id,
      title: "Looking for Figma feedback on a volunteer event poster",
      description:
        "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.",
      category: "Design",
      urgency: "Medium",
      tags: ["Figma", "Poster", "Design Review"],
      status: "Open",
      helperIds: [hassan._id],
      aiSummary:
        "Visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.",
      location: "Lahore",
    },
    {
      requesterId: sara._id,
      title: "Need mock interview support for internship applications",
      description:
        "Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.",
      category: "Career",
      urgency: "Low",
      tags: ["Interview Prep", "Career", "Frontend"],
      status: "Solved",
      helperIds: [ayesha._id, hassan._id],
      aiSummary:
        "Candidate needs structured interview practice focused on confidence-building and entry-level frontend interviews.",
      location: "Remote",
    },
  ]);

  await Notification.create([
    {
      userId: ayesha._id,
      type: "status",
      title: '"Need help" was marked as solved',
      message: "A status update was posted on a request you follow.",
    },
    {
      userId: ayesha._id,
      type: "match",
      title: 'Ayesha Khan offered help on "Need help"',
      message: "A new helper matched with an active request.",
    },
    {
      userId: ayesha._id,
      type: "insight",
      title: "AI Center detected rising demand for interview prep",
      message: "Trend signal created from request analysis.",
      isRead: true,
    },
  ]);

  return requests;
}
