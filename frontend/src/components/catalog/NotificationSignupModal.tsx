type NotificationSignupModalProps = {
  open: boolean;
  name: string;
  phone: string;
  error: string | null;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAccept: () => void;
  onDecline: () => void;
};

export default function NotificationSignupModal({
  open,
  name,
  phone,
  error,
  isSubmitting,
  onNameChange,
  onPhoneChange,
  onAccept,
  onDecline,
}: NotificationSignupModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-900">
          ¿Quieres recibir avisos de productos nuevos?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Comparte tu nombre y WhatsApp para que podamos avisarte cuando haya novedades.
        </p>
        <div className="mt-4 space-y-3">
          <label className="block text-sm text-slate-700">
            Nombre
            <input
              type="text"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-500"
              placeholder="Tu nombre"
            />
          </label>
          <label className="block text-sm text-slate-700">
            WhatsApp
            <input
              type="tel"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-500"
              placeholder="Ej. 5591234567"
            />
          </label>
        </div>
        {error ? (
          <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onAccept}
            disabled={isSubmitting}
            className="flex-1 rounded-2xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Enviando..." : "Quiero recibir avisos"}
          </button>
          <button
            type="button"
            onClick={onDecline}
            disabled={isSubmitting}
            className="flex-1 rounded-2xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            No gracias
          </button>
        </div>
      </div>
    </div>
  );
}
