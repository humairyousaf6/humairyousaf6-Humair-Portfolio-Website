import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";

const RESUME_URL = "/Muhammad_Humair_CV.pdf";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Muhammad Humair — Resume" },
      { name: "description", content: "Preview and download Muhammad Humair's resume." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>

          <h1 className="hidden font-display text-base font-bold sm:block">
            Muhammad Humair — Resume
          </h1>

          <a
            href={RESUME_URL}
            download="Muhammad_Humair_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-md bg-accent-yellow px-4 py-2 text-sm font-semibold text-foreground shadow-card transition-transform hover:-translate-y-0.5"
          >
            <Download size={16} /> Download
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-border bg-muted shadow-card">
          <object
            data={RESUME_URL}
            type="application/pdf"
            className="h-[calc(100vh-9rem)] w-full"
            aria-label="Muhammad Humair resume preview"
          >
            <iframe
              src={RESUME_URL}
              title="Muhammad Humair resume preview"
              className="h-[calc(100vh-9rem)] w-full"
            />
          </object>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Trouble viewing the PDF?{" "}
          <a href={RESUME_URL} download className="underline">
            Download it directly
          </a>
          .
        </p>
      </main>
    </div>
  );
}
