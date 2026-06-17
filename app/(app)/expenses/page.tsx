import ExpenseForm from "./ExpenseForm";
export default function ExpensesPage() {
  return (
    <main className="space-y-4 p-4">
      <h1 className="pt-2 text-2xl font-semibold">Log expense</h1>
      <p className="text-sm text-gray-500">
        Tag who's responsible — the app tracks what Mom owes you automatically.
      </p>
      <ExpenseForm />
    </main>
  );
}
