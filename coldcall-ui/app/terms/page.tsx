import Link from "next/link";
import { ArrowLeft, RadioTower } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | CallAgent",
  description: "Terms of service for CallAgent cold calling automation platform",
};

export default function TermsPage() {
  return (
    <div className="relative min-h-dvh bg-[#070e1d] text-on-surface selection:bg-primary/30 selection:text-on-primary">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[30%] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-primary/[0.12] blur-[100px]" />
        <div className="absolute -right-[15%] top-1/3 h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-secondary/8 blur-[90px]" />
        <div className="absolute bottom-0 left-1/2 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-10 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/login">
            <Button variant="ghost" className="gap-2 text-on-surface-variant hover:text-on-surface">
              <ArrowLeft className="size-4" />
              Back to login
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <RadioTower className="size-5 text-primary" />
            <span className="text-sm font-semibold text-primary">CallAgent</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
              Terms of Service
            </h1>
            <p className="text-sm text-on-surface-variant">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-on-surface">
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">1. Acceptance of Terms</h2>
              <p className="text-on-surface-variant leading-relaxed">
                By accessing and using CallAgent (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">2. Description of Service</h2>
              <p className="text-on-surface-variant leading-relaxed">
                CallAgent is an automated cold calling platform designed for B2B sales teams. The Service provides tools for prospect management, campaign automation, call intelligence, and performance analytics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">3. User Accounts</h2>
              <div className="space-y-3 text-on-surface-variant leading-relaxed">
                <p>You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your use complies with applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">4. Acceptable Use</h2>
              <div className="space-y-3 text-on-surface-variant leading-relaxed">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the service for spam, harassment, or abusive purposes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">5. Data Privacy</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">6. Intellectual Property</h2>
              <p className="text-on-surface-variant leading-relaxed">
                The Service and its original content, features, and functionality are and will remain the exclusive property of CallAgent and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">7. Termination</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">8. Limitation of Liability</h2>
              <p className="text-on-surface-variant leading-relaxed">
                In no event shall CallAgent, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">9. Governing Law</h2>
              <p className="text-on-surface-variant leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which CallAgent is incorporated, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">10. Changes to Terms</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">11. Contact Information</h2>
              <p className="text-on-surface-variant leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at legal@callagent.com.
              </p>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-outline-variant/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-on-surface-variant/80 sm:flex-row sm:gap-6">
            <span>© {new Date().getFullYear()} CallAgent</span>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <Link href="/terms" className="hover:text-on-surface-variant">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-on-surface-variant">
                Privacy
              </Link>
              <Link href="/security" className="hover:text-on-surface-variant">
                Security
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}