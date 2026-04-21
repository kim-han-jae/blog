type FaqItem = {
  question: string;
  answer: string;
};

export function FaqList({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;

  return (
    <section className="space-y-4 rounded-xl border border-zinc-200 p-6">
      <h2 className="text-xl font-semibold">FAQ</h2>
      {items.map((item) => (
        <div key={item.question} className="space-y-1">
          <h3 className="font-medium">{item.question}</h3>
          <p className="text-sm text-zinc-600">{item.answer}</p>
        </div>
      ))}
    </section>
  );
}
