"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import CircleBackground from "@/modules/landing/ui/components/circle-background";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen relative">
      <CircleBackground />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mb-8 text-lg">Last updated: December 2, 2025</p>

              <div className="space-y-8">
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    InterviewCrew (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                    This Privacy Policy explains how your personal information is collected, used, and disclosed by InterviewCrew.
                    This policy applies to our website and our AI-powered recruitment tools.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium text-foreground/90">Personal Information</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We collect information you provide directly to us, such as when you create an account, 
                        upload your resume, or communicate with us. This may include:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Name and contact information (email address)</li>
                        <li>Professional experience and education (via resumes/CVs)</li>
                        <li>Authentication credentials</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium text-foreground/90">Interview Data</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        When you use our AI mock interview tools, we collect:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li>Audio recordings of your responses</li>
                        <li>Transcripts of the interview sessions</li>
                        <li>Code written during technical assessments</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed">We use the information we collect for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>To provide, maintain, and improve our services (including the AI mock interviewer).</li>
                    <li>To process your specific requests and facilitate your interview preparation.</li>
                    <li>To improve our AI models and algorithms (using anonymized data).</li>
                    <li>
                      <strong className="text-foreground">For Recruitment Services:</strong> With your explicit consent, to evaluate your 
                      qualifications for potential employment opportunities with our clients.
                    </li>
                    <li>To communicate with you about services, updates, and promotional offers.</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">4. AI and Data Processing</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our services utilize Artificial Intelligence. By using our platform, you acknowledge that your 
                    data (including voice and text) may be processed by third-party LLM (Large Language Model) 
                    providers to generate feedback and conduct the interview simulation. We ensure these providers 
                    adhere to strict data protection standards.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">5. EU AI Act & GDPR Compliance</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We are committed to compliance with the General Data Protection Regulation (GDPR) and the EU AI Act.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">Human-in-the-Loop:</strong> While we use AI for preparation tools, high-stakes 
                      recruitment decisions (vetting for our &quot;A-Player&quot; catalog) always involve human oversight 
                      and expert review.
                    </li>
                    <li>
                      <strong className="text-foreground">Legal Basis:</strong> We process your data based on your consent and our legitimate 
                      interest in providing and improving our services.
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">6. Data Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell your personal data. We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">With Clients:</strong> Only if you are a candidate in our vetted &quot;A-Player&quot; catalog 
                      and have given specific permission for your profile to be shared with potential employers.
                    </li>
                    <li>
                      <strong className="text-foreground">Service Providers:</strong> With vendors who perform services for us (e.g., cloud hosting, AI API providers), 
                      under strict confidentiality agreements.
                    </li>
                    <li>
                      <strong className="text-foreground">Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities.
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">7. Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Under the GDPR, you have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request erasure of your data (&quot;Right to be forgotten&quot;)</li>
                    <li>Restrict or object to processing</li>
                    <li>Data portability</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    To exercise these rights, please contact us using the information below.
                  </p>
                </section>

                <section className="space-y-4 pt-4 border-t border-border/50">
                  <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms, please contact us at: {" "}
                    <a href="mailto:sadjad@interviewcrew.io" className="text-primary hover:underline hover:text-primary/80 transition-colors">
                      sadjad@interviewcrew.io
                    </a>
                  </p>
                </section>
              </div>
            </article>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
