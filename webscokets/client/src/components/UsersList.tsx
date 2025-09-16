export default function UsersList({
  users,
  selected,
  onSelect,
}: {
  users: string[];
  selected: string | null;
  onSelect: (u: string) => void;
}) {
  return (
    <div className="w-64 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-4 flex flex-col">
      <h3 className="font-semibold text-gray-700 mb-3">
        Online — <span className="text-emerald-600">{users.length}</span>
      </h3>

      {users.length === 0 && (
        <p className="text-sm text-gray-500">No users online</p>
      )}

      <div className="space-y-2 overflow-y-auto">
        {users.map((u) => (
          <div
            key={u}
            onClick={() => onSelect(u)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              selected === u
                ? "bg-emerald-600 text-white"
                : "bg-gray-50 hover:bg-gray-100 text-gray-800"
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                selected === u ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span className="text-sm font-medium">
                {u.charAt(0).toUpperCase()}
              </span>
            </div>

            <span className="text-sm font-medium truncate">{u}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
