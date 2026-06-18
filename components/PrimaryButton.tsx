export default function PrimaryButton({
  children, pending, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean }) {
  return (
    <button
      {...rest}
      disabled={pending || rest.disabled}
      className="w-full rounded-2xl bg-brand p-3.5 font-bold text-brand-fg shadow-soft transition active:scale-[.99] disabled:opacity-50"
    >
      {children}
    </button>
  );
}
