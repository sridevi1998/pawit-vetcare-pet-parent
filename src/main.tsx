import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AlertCircle, CalendarCheck, HeartPulse, PawPrint, Receipt } from "lucide-react";
import { getBilling, getCurrentUser, listAppointments, listPets, type Appointment, type BillingResponse, type MeResponse, type PetRecord } from "./pawit-api";
import "./styles.css";

type PortalData = {
  appointments: Appointment[];
  billing: BillingResponse | null;
  me: MeResponse | null;
  pets: PetRecord[];
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(cents / 100);
}

function App() {
  const [data, setData] = useState<PortalData>({
    appointments: [],
    billing: null,
    me: null,
    pets: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [me, appointments, pets, billing] = await Promise.all([
          getCurrentUser(),
          listAppointments(),
          listPets(),
          getBilling(),
        ]);
        if (active) {
          setData({ appointments, billing, me, pets });
        }
      } catch {
        if (active) {
          setError("Live portal data is unavailable.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const upcoming = data.appointments.slice(0, 2);
  const invoiceTotal = useMemo(
    () => data.billing?.invoices.reduce((sum, invoice) => sum + invoice.amount, 0) ?? 0,
    [data.billing],
  );
  const guardianName = data.me?.user.id ? "Welcome back" : "Welcome";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg bg-blue-600 text-white">
              <PawPrint />
            </div>
            <div>
              <h1 className="text-xl font-bold">PawIt</h1>
              <p className="text-sm text-slate-500">Pet Parent Portal</p>
            </div>
          </div>
          <p className="hidden text-sm font-medium text-slate-500 sm:block">{guardianName}</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <CalendarCheck className="text-blue-600" />
          <h2 className="mt-4 text-2xl font-bold">Upcoming Visits</h2>
          <p className="mt-2 text-slate-600">
            {loading ? "Loading visits..." : `${data.appointments.length} appointments on file`}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <HeartPulse className="text-green-600" />
          <h2 className="mt-4 text-2xl font-bold">Pet Health Records</h2>
          <p className="mt-2 text-slate-600">
            {loading ? "Loading pets..." : `${data.pets.length} pet records available`}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Receipt className="text-violet-600" />
          <h2 className="mt-4 text-2xl font-bold">Invoices</h2>
          <p className="mt-2 text-slate-600">
            {loading ? "Loading billing..." : `${formatCurrency(invoiceTotal)} total balance`}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Visit Timeline</h2>
          {error ? (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          ) : null}
          <div className="mt-5 space-y-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, index) => (
                <div className="h-20 animate-pulse rounded-lg bg-slate-100" key={index} />
              ))
            ) : upcoming.length > 0 ? (
              upcoming.map((appointment) => (
                <div className="rounded-lg border border-slate-200 p-4" key={appointment.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{appointment.petName}</p>
                      <p className="text-sm text-slate-500">{appointment.reason}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
                No upcoming visits.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Pets</h2>
          <div className="mt-5 space-y-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, index) => (
                <div className="h-16 animate-pulse rounded-lg bg-slate-100" key={index} />
              ))
            ) : data.pets.length > 0 ? (
              data.pets.slice(0, 3).map((pet) => (
                <div className="rounded-lg border border-slate-200 p-4" key={pet.id}>
                  <p className="font-semibold">{pet.petName}</p>
                  <p className="text-sm text-slate-500">
                    {pet.species} - {pet.breed}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
                No pet records.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
