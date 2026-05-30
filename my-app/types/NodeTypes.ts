import { Node } from "@xyflow/react";

export type AiNodeType = Node<{ provider: string, apiKey: string, prompt: string, status: "initial" | "loading" | "success" | "error" }, "aiNode">;
export type HttpRequestNodeType = Node<{ endpoint: string, method: string, status: "initial" | "loading" | "success" | "error" }, "httpRequest">;
export type ManualTriggerNodeType = Node<{ activated: boolean, workspaceId: number, status: "initial" | "loading" | "success" | "error" }, "manualTrigger">;
export type ProviderNodeType = Node<{ type: string }, "provider">
