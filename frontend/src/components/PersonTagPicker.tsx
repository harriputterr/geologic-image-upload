const PEOPLE = [
  "Alex Morgan",
  "Jordan Lee",
  "Maya Patel",
  "Sofia Garcia",
  "Daniel Kim",
];

type PersonTagPickerProps = {
  people: string[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onTogglePerson: (person: string) => void;
};

export default function PersonTagPicker({
  people,
  isOpen,
  onToggleOpen,
  onTogglePerson,
}: PersonTagPickerProps) {
  return (
    <>
      {people.length > 0 && (
        <p className="mt-2 text-xs text-white/60">
          Tagged: {people.join(", ")}
        </p>
      )}

      <button
        type="button"
        onClick={onToggleOpen}
        className="mt-4 cursor-pointer border border-white/60 px-3 py-2 text-xs tracking-[0.08em] uppercase hover:bg-white hover:text-[#07141c]"
      >
        Tag people
      </button>

      {isOpen && (
        <div className="mt-3 flex flex-wrap gap-2">
          {PEOPLE.map((person) => {
            const isTagged = people.includes(person);

            return (
              <button
                key={person}
                type="button"
                aria-pressed={isTagged}
                onClick={() => onTogglePerson(person)}
                className={`cursor-pointer border px-3 py-2 text-xs ${
                  isTagged
                    ? "border-white bg-white text-[#07141c]"
                    : "border-white/30 text-white/75 hover:border-white"
                }`}
              >
                {person}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
