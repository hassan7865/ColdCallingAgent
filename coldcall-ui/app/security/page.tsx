import Link from "next/link";
import { ArrowLeft, RadioTower, Shield, Lock, Eye, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Security | CallAgent",
  description: "Security information and practices for CallAgent cold calling automation platform",
};

export default function SecurityPage() {
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
            <div className="flex items-center gap-3">
              <Shield className="size-8 text-primary" />
              <h1 className="text-balance text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
                Security Overview
              </h1>
            </div>
            <p className="text-sm text-on-surface-variant">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-on-surface">
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                <Lock className="size-5 text-primary" />
                Our Security Commitment
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                At CallAgent, security is fundamental to everything we do. We are committed to protecting your data, maintaining system integrity, and ensuring the confidentiality of your business communications. Our security practices are designed to meet and exceed industry standards for B2B SaaS platforms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                <Database className="size-5 text-primary" />
                Infrastructure Security
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 p-6">
                  <h3 className="text-lg font-semibold text-on-surface mb-3">Cloud Infrastructure</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li>• Hosted on enterprise-grade cloud providers</li>
                    <li>• SOC 2 Type II compliant infrastructure</li>
                    <li>• Multi-region redundancy and failover</li>
                    <li>• 99.9% uptime SLA with monitoring</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 p-6">
                  <h3 className="text-lg font-semibold text-on-surface mb-3">Network Security</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li>• End-to-end encryption (TLS 1.3)</li>
                    <li>• DDoS protection and rate limiting</li>
                    <li>• Web Application Firewall (WAF)</li>
                    <li>• Zero-trust network architecture</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 p-6">
                  <h3 className="text-lg font-semibold text-on-surface mb-3">Data Encryption</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li>• AES-256 encryption at rest</li>
                    <li>• TLS encryption in transit</li>
                    <li>• Encrypted database connections</li>
                    <li>• Secure key management system</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 p-6">
                  <h3 className="text-lg font-semibold text-on-surface mb-3">Access Controls</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    <li>• Role-based access control (RBAC)</li>
                    <li>• Multi-factor authentication (MFA)</li>
                    <li>• Least privilege principles</li>
                    <li>• Audit logging and monitoring</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                <Eye className="size-5 text-primary" />
                Application Security
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-3">Authentication & Authorization</h3>
                  <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                    <li>Secure password policies with complexity requirements</li>
                    <li>Mandatory multi-factor authentication for all accounts</li>
                    <li>Session management with automatic timeouts</li>
                    <li>JWT tokens with short expiration and refresh mechanisms</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-3">API Security</h3>
                  <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                    <li>OAuth 2.0 and API key authentication</li>
                    <li>Rate limiting and request throttling</li>
                    <li>Input validation and sanitization</li>
                    <li>Comprehensive API documentation and versioning</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-3">Data Protection</h3>
                  <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
                    <li>End-to-end encryption for call data</li>
                    <li>Secure data backup and recovery procedures</li>
                    <li>Data classification and handling policies</li>
                    <li>Regular security assessments and penetration testing</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Compliance & Certifications</h2>
              <div className="space-y-4 text-on-surface-variant leading-relaxed">
                <p>
                  CallAgent maintains compliance with industry-leading security standards and undergoes regular third-party audits:
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/40 p-4">
                    <div className="font-semibold text-on-surface">SOC 2 Type II</div>
                    <div className="text-sm text-on-surface-variant">Security, availability, and confidentiality controls</div>
                  </div>
                  <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/40 p-4">
                    <div className="font-semibold text-on-surface">GDPR</div>
                    <div className="text-sm text-on-surface-variant">European data protection compliance</div>
                  </div>
                  <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/40 p-4">
                    <div className="font-semibold text-on-surface">ISO 27001</div>
                    <div className="text-sm text-on-surface-variant">Information security management</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Security Monitoring & Response</h2>
              <div className="space-y-4 text-on-surface-variant leading-relaxed">
                <p>
                  Our security operations center provides 24/7 monitoring and rapid response capabilities:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Real-time threat detection and alerting</li>
                  <li>Automated incident response workflows</li>
                  <li>Regular security assessments and vulnerability scanning</li>
                  <li>Incident reporting and post-mortem analysis</li>
                  <li>Security awareness training for our team</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Third-Party Security</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We carefully vet all third-party vendors and service providers to ensure they meet our security standards. This includes conducting security questionnaires, reviewing their certifications, and monitoring their compliance with our requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Reporting Security Issues</h2>
              <p className="text-on-surface-variant leading-relaxed">
                If you discover a security vulnerability or have concerns about the security of our platform, please contact us immediately at security@callagent.com. We appreciate responsible disclosure and will work with you to address any issues promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Contact Information</h2>
              <p className="text-on-surface-variant leading-relaxed">
                For security-related questions or concerns, please reach out to our security team at security@callagent.com.
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