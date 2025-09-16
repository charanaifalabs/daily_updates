export default function MessageBubble({
  from,
  text,
  currentUser,
}: {
  from: string;
  text: string;
  currentUser: string;
}) {
  const me = from === currentUser;

  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"} mb-3 px-1`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm 
        ${
          me
            ? "bg-emerald-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {!me && (
          <div className="text-xs text-gray-500 mb-1 font-medium">{from}</div>
        )}
        <div className="break-words">{text}</div>
      </div>
    </div>
  );
}
