import Link from "next/link";
import { ArrowLeft, RadioTower } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | CallAgent",
  description: "Privacy policy for CallAgent cold calling automation platform",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm text-on-surface-variant">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-on-surface">
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-on-surface-variant leading-relaxed">
                <h3 className="text-lg font-semibold text-on-surface">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information</li>
                  <li>Work email address and company details</li>
                  <li>Account credentials and authentication data</li>
                  <li>Payment information (processed by secure third-party providers)</li>
                </ul>

                <h3 className="text-lg font-semibold text-on-surface">Usage Data</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Call logs and communication records</li>
                  <li>Campaign performance metrics</li>
                  <li>Prospect interaction data</li>
                  <li>System usage statistics and analytics</li>
                </ul>

                <h3 className="text-lg font-semibold text-on-surface">Technical Data</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and location information</li>
                  <li>Device and browser information</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>API usage patterns and error logs</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">2. How We Use Your Information</h2>
              <div className="space-y-3 text-on-surface-variant leading-relaxed">
                <p>We use the collected information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain the CallAgent service</li>
                  <li>Process and manage your account</li>
                  <li>Analyze usage patterns and improve our service</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">3. Data Sharing and Disclosure</h2>
              <p className="text-on-surface-variant leading-relaxed mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to the sharing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">4. Data Security</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, access controls, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">5. Data Retention</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">6. Your Rights</h2>
              <div className="space-y-3 text-on-surface-variant leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict certain processing activities</li>
                  <li>Data portability (receive your data in a structured format)</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">7. Cookies and Tracking</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and maintain security. You can control cookie settings through your browser preferences, though disabling certain cookies may affect service functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">8. International Data Transfers</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers, including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Our service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">10. Changes to This Policy</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the service after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">11. Contact Us</h2>
              <p className="text-on-surface-variant leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@callagent.com.
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