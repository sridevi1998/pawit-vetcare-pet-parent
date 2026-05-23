import React from "react";
import { createRoot } from "react-dom/client";
import { CalendarCheck, HeartPulse, PawPrint } from "lucide-react";
import "./styles.css";

function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-blue-600 text-white">
            <PawPrint />
          </div>
          <div>
            <h1 className="text-xl font-bold">PawIt</h1>
            <p className="text-sm text-slate-500">Pet Parent Portal</p>
          </div>
        </div>
      </header>
      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <CalendarCheck className="text-blue-600" />
          <h2 className="mt-4 text-2xl font-bold">Upcoming Visits</h2>
          <p className="mt-2 text-slate-600">Book appointments, check queue status, and view visit history.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <HeartPulse className="text-green-600" />
          <h2 className="mt-4 text-2xl font-bold">Pet Health Records</h2>
          <p className="mt-2 text-slate-600">Vaccinations, prescriptions, lab reports, invoices, and care reminders.</p>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
