import ExpenseForm from "./ExpenseForm";
export default function ExpensesPage() {
  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-bold text-gray-800">Log spending 🧾</h1>
      <p className="text-sm text-gray-400">Tag who&apos;s responsible — we track what Mom owes you automatically.</p>
      <ExpenseForm />
    </main>
  );
}
