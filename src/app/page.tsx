import { ChatWindow } from "@/components/chat/chat-window";
import { publicModelRegistry } from "@/lib/bedrock/model-registry";

export default function Home() {
  return <ChatWindow models={publicModelRegistry()} />;
}
