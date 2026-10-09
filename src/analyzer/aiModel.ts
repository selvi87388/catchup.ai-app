/**
 * On-device AI model manager using Transformers.js (WebAssembly).
 *
 * Uses Xenova/distilbert-base-uncased-finetuned-sst-2-english for sentiment
 * analysis to score message importance — urgent/negative messages tend to
 * be higher priority. The model runs entirely in the browser via WASM;
 * no data is sent to any server.
 */

export type ModelStatus = "unloaded" | "loading" | "ready" | "error";

export interface MessageScore {
  /** Sentiment label: "POSITIVE" or "NEGATIVE" */
  label: string;
  /** Confidence score 0..1 */
  score: number;
}

type SentimentPipeline = (texts: string[]) => Promise<MessageScore[]>;

let pipelineInstance: SentimentPipeline | null = null;
let status: ModelStatus = "unloaded";
let loadPromise: Promise<SentimentPipeline | null> | null = null;
let progressCallback: ((status: ModelStatus, progress?: number) => void) | null = null;

export function onModelProgress(cb: (status: ModelStatus, progress?: number) => void): void {
  progressCallback = cb;
}

export function getModelStatus(): ModelStatus {
  return status;
}

/**
 * Initialize the on-device sentiment analysis pipeline.
 * Returns null if loading fails — callers should fall back to heuristics.
 */
export async function initModel(): Promise<SentimentPipeline | null> {
  if (pipelineInstance) return pipelineInstance;
  if (loadPromise) return loadPromise;

  status = "loading";
  progressCallback?.("loading", 0);

  loadPromise = (async () => {
    try {
      // Dynamically import from CDN so Vite doesn't bundle the package
      const moduleUrl =
        "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";
      const transformersModule: any = await import(
        /* @vite-ignore */ moduleUrl
      );
      const { pipeline, env } = transformersModule;

      // Configure for browser WASM inference
      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const classifier = await pipeline(
        "text-classification",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
        {
          quantized: true,
          progress_callback: (data: { status: string; progress?: number }) => {
            if (data.progress !== undefined) {
              progressCallback?.("loading", data.progress);
            }
          },
        },
      ) as unknown as {
        (texts: string[]): Promise<
          Array<{ label: string; score: number }>
        >;
      };

      // Wrap to normalize the output shape
      const wrapped: SentimentPipeline = async (texts: string[]) => {
        const results = await classifier(texts);
        return results.map((r) => ({
          label: r.label,
          score: r.score,
        }));
      };

      pipelineInstance = wrapped;
      status = "ready";
      progressCallback?.("ready", 100);
      return wrapped;
    } catch (err) {
      console.warn("Transformers.js model failed to load, falling back to heuristics:", err);
      status = "error";
      progressCallback?.("error");
      return null;
    }
  })();

  return loadPromise;
}

/**
 * Score a batch of messages using the on-device model.
 * Returns null if the model isn't available — caller should use heuristics.
 */
export async function scoreMessages(texts: string[]): Promise<MessageScore[] | null> {
  const model = await initModel();
  if (!model) return null;

  try {
    // Process in batches of 8 to avoid memory issues
    const results: MessageScore[] = [];
    const batchSize = 8;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchResults = await model(batch);
      results.push(...batchResults);
    }
    return results;
  } catch (err) {
    console.warn("Model inference failed, falling back to heuristics:", err);
    return null;
  }
}

/**
 * Preload the model in the background so it's ready when the user clicks Analyze.
 * Safe to call multiple times — subsequent calls return the existing promise.
 */
export function preloadModel(): void {
  void initModel();
}
