import type { InvokeArgs } from "@tauri-apps/api/tauri"

// workarounds for window being undefined in next.js
const isNode = (): boolean =>
  Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) ===
  "[object process]"

export async function invoke<T>(
  cmd: string,
  args?: InvokeArgs | undefined,
): Promise<T> {
  if (isNode()) {
    return Promise.resolve(undefined as unknown as T)
  }
  const tauriAppsApi = await import("@tauri-apps/api")
  const tauriInvoke = tauriAppsApi.invoke
  return tauriInvoke(cmd, args)
}

export async function convertFileSrc(
    file: string
  ): Promise<string> {
    if (isNode()) {
      return "";
    }
    const tauriAppsApi = await import("@tauri-apps/api")
    const tauriInvoke = tauriAppsApi.tauri.convertFileSrc;
    return tauriInvoke(file)
  }