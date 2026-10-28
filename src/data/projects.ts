import p01 from "@/assets/projects/project-01.png";
import p02 from "@/assets/projects/project-02.png";
import p03 from "@/assets/projects/project-03.png";
import p04 from "@/assets/projects/project-04.png";
import p05 from "@/assets/projects/project-05.png";
import p06 from "@/assets/projects/project-06.png";
import p07 from "@/assets/projects/project-07.png";
import p08 from "@/assets/projects/project-08.png";
import p09 from "@/assets/projects/project-09.png";
import p10 from "@/assets/projects/project-10.png";

export type Project = {
  badge: string;
  title: string;
  caption: string;
  tags: string[];
  github: string;
  img: string;
  alt: string;
};

export const projects: Project[] = [
  {
    badge: "Project 01",
    title: "Microsoft Dynamics 365 Dataverse Supply Chain AI Analytics",
    caption:
      "Conversational analytics over Dynamics 365 and Dataverse via the TDS endpoint. Ask supply-chain questions in plain language and get KPIs, tables, and charts.",
    tags: ["TypeScript", "Dynamics 365", "OpenAI", "MCP"],
    github:
      "https://github.com/humairyousaf6/Microsoft-Dynamics-365-Dataverse-Supply-Chain-AI-Analytics",
    img: p01,
    alt: "Dataverse Analytics Console answering a supply-chain question with a KPI table",
  },
  {
    badge: "Project 02",
    title: "Voice Based Tuition Fee Assistant for Sunmarke School RAG",
    caption:
      "Record a voice question, transcribe it with Deepgram, and retrieve tuition details from Qdrant. Returns grounded answers in text and optional audio.",
    tags: ["TypeScript", "LangChain", "Qdrant", "ElevenLabs"],
    github:
      "https://github.com/humairyousaf6/Voice-Based-Tuition-Fee-Assistant-for-Sunmarke-School-RAG-",
    img: p02,
    alt: "Sunmarke School voice assistant interface recording and answering a tuition question",
  },
  {
    badge: "Project 03",
    title: "Speaker Diarization Transcription Minutes of Meeting",
    caption:
      "Upload meeting audio, separate speakers, and transcribe with Whisper. Merges attributed transcripts into AI-generated meeting minutes.",
    tags: ["TypeScript", "Python", "OpenAI Whisper", "FastAPI"],
    github: "https://github.com/humairyousaf6/Speaker-Diarization-Transcription-Minutes-of-Meeting",
    img: p03,
    alt: "Meeting transcription screen showing diarized speaker segments and generated minutes",
  },
  {
    badge: "Project 04",
    title: "n8n AI Automated EU Database Updates",
    caption:
      "Detects incoming changes, assesses records with AI, and drafts updates. Routes uncertain cases for approval and syncs Google Sheets.",
    tags: ["n8n", "OpenAI API", "Google Sheets", "JavaScript"],
    github: "https://github.com/humairyousaf6/n8n-AI-Automated-EU-Database-Updates",
    img: p04,
    alt: "n8n workflow that detects changes, drafts AI updates, and syncs to Google Sheets",
  },
  {
    badge: "Project 05",
    title: "Make.com AI Receptionist for US Plumbing Services",
    caption:
      "Missed-call text-back and SMS lead intake via Twilio and Make.com. Books appointments, escalates urgent jobs, and sends reminders and review requests.",
    tags: ["Make.com", "Twilio", "Google Sheets", "JSON Modules"],
    github: "https://github.com/humairyousaf6/Make.com-AI-Receptionist-for-US-Plumbing-Services",
    img: p05,
    alt: "Make.com scenario routing Twilio SMS lead intake through Make AI Agents to Google Sheets",
  },
  {
    badge: "Project 06",
    title: "WhatsApp Attendance System Leave and Late Tracker Playwright",
    caption:
      "Deterministic parsing of WhatsApp sign-in, sign-out, late, and leave messages. Handles night shifts, breaks, and holidays, and flags unresolved cases for review.",
    tags: ["TypeScript", "Playwright", "WhatsApp", "Groq"],
    github:
      "https://github.com/humairyousaf6/WhatsApp-Attendance-System-Leave-and-Late-Tracker-Playwright-",
    img: p06,
    alt: "Attendance dashboard tracking WhatsApp sign-ins, late arrivals, and leave requests",
  },
  {
    badge: "Project 07",
    title: "Data Insight App PostgreSQL and CSV Analytics with MCP",
    caption:
      "Chat with PostgreSQL, CSV, and Excel data through MCP. Returns tables and Plotly charts with CSV export and session history.",
    tags: ["TypeScript", "MCP", "PostgreSQL", "CSV"],
    github:
      "https://github.com/humairyousaf6/Data-Insight-App-PostgreSQL-and-CSV-Analytics-with-MCP",
    img: p07,
    alt: "Data Insight platform connecting PostgreSQL and CSV sources for AI analytics",
  },
  {
    badge: "Project 08",
    title: "OpenClaw Agentic URL Explainer and Screen Recording Avatar Video Automation Pipeline",
    caption:
      "Turns a URL or screen recording into a narrated avatar video. Page set and script are human-approved, with delivery back through Slack.",
    tags: ["OpenClaw", "OpenAI API", "HeyGen", "Slack"],
    github:
      "https://github.com/humairyousaf6/Openclaw-Agentic-URL-Explainer-and-Screen-Recording-Avatar-Video-Automation-Pipeline",
    img: p08,
    alt: "Openclaw pipeline turning a URL into a human-approved narrated avatar video delivered via Slack",
  },
  {
    badge: "Project 09",
    title: "Florida Lottery Prediction AI",
    caption:
      "Upload historical draws and train ML models for Pick 3, 4, 5, and Pick 5 Combo. Tracks model versions, training progress, and daily predictions.",
    tags: ["Python", "LightGBM", "XGBoost", "TensorFlow"],
    github: "https://github.com/humairyousaf6/Florida-Lottery-Prediction-AI",
    img: p09,
    alt: "Florida lottery prediction app training ML models on historical draws",
  },
  {
    badge: "Project 10",
    title: "Sequence Modeling with RNN/LSTM and Image Generation with DCGAN",
    caption:
      "Compares Simple RNN and LSTM on six-class human activity recognition. Trains a DCGAN on CelebA over 50 epochs to generate faces.",
    tags: ["Jupyter Notebook", "RNN", "LSTM", "GAN"],
    github:
      "https://github.com/humairyousaf6/Sequence-Modeling-with-RNN-LSTM-and-Image-Generation-with-DCGAN",
    img: p10,
    alt: "Notebook comparing RNN and LSTM accuracy curves and DCGAN-generated face samples",
  },
];
