/**
 * AI image-matching integration seam.
 *
 * Calls the PetLink ML service (FastAPI, running separately on port 8000).
 * It is deliberately called from BOTH report paths, because a match can be
 * discovered from either direction:
 *
 *   - a finder submits a found report, and a matching lost report already exists
 *   - a pet owner submits a lost report, and a matching found report was
 *     submitted days earlier
 *
 * The second case is the common one in practice: someone picks up a stray before
 * the owner has got around to reporting it.
 *
 * For a lost report, /embed-lost computes and stores the embedding so future
 * found-report matching can compare against it instantly.
 *
 * For a found report, /match-found does the full pipeline - extracts a frame
 * from the video, crops the dog with YOLO, embeds it, compares against every
 * unreunited lost report, writes any match above threshold into the `matches`
 * table, and emails the pet owner for the best match. All of that runs
 * server-side with the Supabase service-role key; this file only makes the
 * HTTP call and never sees that key.
 *
 * The call is fire-and-forget from the form's point of view: matching (and
 * especially video processing) can take a few seconds, and the report is
 * already saved regardless of whether a match is found, so the submission
 * flow doesn't wait on it.
 */
import type { PetReport } from "@/lib/supabase";

const ML_API_URL = import.meta.env.VITE_ML_API_URL ?? "http://localhost:8000";
const ML_API_KEY = import.meta.env.VITE_ML_API_KEY;

export async function notifyPotentialMatches(report: PetReport): Promise<void> {
  const endpoint = report.type === "lost" ? "embed-lost" : "match-found";

  try {
    const res = await fetch(`${ML_API_URL}/${endpoint}/${report.id}`, {
      method: "POST",
      headers: { "x-api-key": ML_API_KEY },
    });

    if (!res.ok) {
      console.error(`[matching] ${endpoint} failed:`, await res.text());
      return;
    }

    if (import.meta.env.DEV) {
      console.info(`[matching] ${endpoint} result:`, await res.json());
    }
  } catch (err) {
    // The ML service may not be running (e.g. in production before it's
    // deployed, or if the dev server just isn't up). Never let that break
    // report submission - the report itself is already saved.
    console.error(`[matching] could not reach ML service:`, err);
  }
}