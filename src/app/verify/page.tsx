"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import type { CertificateVerifyResponse } from "@/types";
import {
  Search,
  ShieldCheck,
  ShieldX,
  AlertCircle,
  User,
  BookOpen,
  BarChart3,
  Calendar,
} from "lucide-react";

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState<CertificateVerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = certificateId.trim();
    if (!id) return;

    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);

    try {
      const { data } = await api.get<CertificateVerifyResponse>(
        `/tests/certificate/${id}/verify/`
      );
      setResult(data);
    } catch {
      setError("Sertifikat topilmadi yoki yaroqsiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-400">
            <ShieldCheck size={28} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Sertifikat tekshirish
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            Sertifikat ID sini kiriting va haqiqiyligini tekshiring
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleVerify} className="card mb-6">
          <label className="mb-1.5 block text-sm font-medium text-surface-300">
            Sertifikat ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="flex-1 rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 font-mono text-sm text-white placeholder-surface-500 outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
            <button
              type="submit"
              disabled={loading || !certificateId.trim()}
              className="btn-primary flex-shrink-0"
            >
              <Search size={16} />
              {loading ? "..." : "Tekshirish"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="card flex items-center gap-3 border-danger/30 bg-danger/10">
            <ShieldX size={24} className="flex-shrink-0 text-danger" />
            <div>
              <h3 className="font-semibold text-danger">Yaroqsiz</h3>
              <p className="text-sm text-surface-400">{error}</p>
            </div>
          </div>
        )}

        {/* Valid result */}
        {result?.valid && (
          <div className="card animate-slide-up border-brand-600/30">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-brand-400">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-400">
                  Sertifikat haqiqiy
                </h3>
                <p className="text-xs text-surface-500 font-mono">
                  {result.certificate_id}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-surface-800 bg-surface-800/30 p-3">
                <User size={18} className="flex-shrink-0 text-surface-500" />
                <div>
                  <p className="text-xs text-surface-500">To&apos;liq ism</p>
                  <p className="font-medium text-white">{result.full_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-surface-800 bg-surface-800/30 p-3">
                <BookOpen size={18} className="flex-shrink-0 text-surface-500" />
                <div>
                  <p className="text-xs text-surface-500">Test nomi</p>
                  <p className="font-medium text-white">{result.test_title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-surface-800 bg-surface-800/30 p-3">
                <BarChart3 size={18} className="flex-shrink-0 text-surface-500" />
                <div>
                  <p className="text-xs text-surface-500">Ball</p>
                  <p className="font-mono font-bold text-brand-400">
                    {result.score}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-surface-800 bg-surface-800/30 p-3">
                <Calendar size={18} className="flex-shrink-0 text-surface-500" />
                <div>
                  <p className="text-xs text-surface-500">Topshirilgan sana</p>
                  <p className="font-medium text-white">
                    {new Date(result.submitted_at).toLocaleDateString("uz-UZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Not searched yet hint */}
        {!searched && !result && !error && (
          <div className="py-8 text-center text-sm text-surface-500">
            Sertifikat haqiqiyligini tekshirish uchun yuqoridagi maydonga
            sertifikat ID sini kiriting.
          </div>
        )}
      </main>
    </div>
  );
}
