import Chat from "./components/Chat";

export default function HomePage() {
  return (
    <div className="h-full w-full bg-[#090D17]">
      <Chat key="new-chat" threadId={null} initialMessages={[]} />
    </div>
  )
}
