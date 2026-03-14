"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ResultCard from "@/components/ResultCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import type { SubmitResponse } from "@/types";
import { ArrowLeft, AlertCircle, Download } from "lucide-react";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(`result_${testId}`);
    if (cached) {
      try {
        setResult(JSON.parse(cached));
        sessionStorage.removeItem(`result_${testId}`);
      } catch {
        setError("Natija topilmadi.");
      }
    } else {
      setError("Natija topilmadi.");
    }
    setLoading(false);
  }, [testId]);

  const downloadCertificate = async () => {
    if (!result?.certificate_id) return;
    setDownloading(true);
    try {
      const response = await api.get(
        `/tests/certificate/${result.certificate_id}/`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${result.certificate_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Sertifikatni yuklab olishda xatolik yuz berdi.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" label="Natija yuklanmoqda..." />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <div>
              <p>{error}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-2 text-sm font-medium text-brand-400 hover:text-brand-300"
              >
                ← Bosh sahifaga qaytish
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {!loading && !error && result && (
          <div className="animate-slide-up">
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl font-bold text-white">
                Test natijasi
              </h1>
              <p className="mt-1 text-surface-400">
                Sizning ko&apos;rsatkichlaringiz
              </p>
            </div>

            <ResultCard result={result} />

            {/* Certificate download */}
            {result.is_passed && result.certificate_id && (
              <div className="mt-6 text-center">
                <button
                  onClick={downloadCertificate}
                  disabled={downloading}
                  className="btn-primary inline-flex"
                >
                  <Download size={16} />
                  {downloading
                    ? "Yuklab olinmoqda..."
                    : "Sertifikat yuklab olish"}
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex justify-center">
              <Link href="/" className="btn-secondary">
                <ArrowLeft size={16} />
                Bosh sahifa
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
