// lib/apiFetch.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type FetchOpts = AxiosRequestConfig & {
  retries?: number; // jumlah retry (default 2)
  retryDelay?: number; // base delay ms (default 500)
  dedupeKey?: string; // jika diberikan, deduplikasi request yg sama
};

const inFlightRequests = new Map<string, Promise<AxiosResponse<any>>>();

export const apiFetch = async (
  config: FetchOpts
): Promise<AxiosResponse<any>> => {
  const {
    url = "",
    method = "get",
    retries = 2,
    retryDelay = 500,
    dedupeKey,
  } = config;

  /**
   * 🔒 FIX PENTING
   * POST / PUT harus memasukkan BODY (data) ke dedupe key
   * supaya payment tidak dianggap request yang sama secara salah
   */
  const key =
    dedupeKey ??
    `${method}:${url}:${JSON.stringify(config.params ?? {})}:${JSON.stringify(
      config.data ?? {}
    )}`;

  // dedupe: jika sudah ada request sama yang sedang berjalan, return promise yang sama
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key)!;
  }

  const attempt = async (
    attemptIndex: number,
    signal?: AbortSignal
  ): Promise<AxiosResponse<any>> => {
    try {
      const axiosConfig: AxiosRequestConfig = {
        ...config,
        method,
        signal,
      };

      const res = await axios(axiosConfig);
      return res;
    } catch (err: any) {
      const status = err?.response?.status;

      /**
       * ❌ JANGAN retry payment jika 429
       * Retry payment creation = anti-pattern
       */
      const shouldRetry =
        attemptIndex < retries &&
        status !== 429 &&
        (!err?.response || err?.code === "ECONNABORTED");

      if (shouldRetry) {
        const delay = retryDelay * Math.pow(2, attemptIndex);
        await new Promise((r) => setTimeout(r, delay));
        return attempt(attemptIndex + 1, signal);
      }

      throw err;
    }
  };

  const controller = new AbortController();

  const promise = attempt(0, controller.signal).finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, promise);

  // optional cancel support
  // @ts-ignore
  promise.cancel = () => controller.abort();

  return promise;
};
