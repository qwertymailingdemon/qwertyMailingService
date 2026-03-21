import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Shield, Send, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: 'Test Email from Mailing Agent',
    html: '<h1>Hello!</h1><p>This is a test email sent from the Mailing Agent Service.</p>',
    apiKey: '',
    serviceUrl: 'http://localhost:10000'
  });

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${formData.serviceUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': formData.apiKey
        },
        body: JSON.stringify({
          to: [formData.to],
          subject: formData.subject,
          html: formData.html
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Email sent successfully!");
      } else {
        toast.error(data.error || "Failed to send email");
      }
    } catch (error) {
      toast.error("Could not connect to the service. Make sure it's running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Mail className="text-blue-600" /> Mailing Agent Service
            </h1>
            <p className="text-slate-500 mt-1">Production-ready microservice for universal email delivery.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-600">Service Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration & Tester */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-500" /> Test Your Service
                </CardTitle>
                <CardDescription>Send a test email to verify your configuration.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendTest} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceUrl">Service URL</Label>
                      <Input 
                        id="serviceUrl" 
                        placeholder="https://your-app.render.com" 
                        value={formData.serviceUrl}
                        onChange={(e) => setFormData({...formData, serviceUrl: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">Service API Key (x-api-key)</Label>
                      <Input 
                        id="apiKey" 
                        type="password"
                        placeholder="Your secret key" 
                        value={formData.apiKey}
                        onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">Recipient Email</Label>
                    <Input 
                      id="to" 
                      type="email" 
                      placeholder="hello@example.com" 
                      required
                      value={formData.to}
                      onChange={(e) => setFormData({...formData, to: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Email Subject" 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="html">HTML Content</Label>
                    <Textarea 
                      id="html" 
                      className="min-h-[150px] font-mono text-sm"
                      placeholder="<h1>Hello</h1>" 
                      required
                      value={formData.html}
                      onChange={(e) => setFormData({...formData, html: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Sending..." : "Send Test Email"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-slate-900 text-slate-50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" /> Quick Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-xs text-blue-300">
{`// Example cURL request
curl -X POST ${formData.serviceUrl || 'https://your-service.com'}/send-email \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "to": ["user@example.com"],
    "subject": "Welcome!",
    "html": "<h1>Hello World</h1>"
  }'`}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Features & Status */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Core Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Shield, title: "Secure Auth", desc: "API Key protected endpoints" },
                  { icon: CheckCircle2, title: "Validation", desc: "Strict Zod schema validation" },
                  { icon: AlertCircle, title: "Error Handling", desc: "Detailed Brevo error mapping" },
                  { icon: Mail, title: "Attachments", desc: "Base64 file support included" }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1">
                      <feature.icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                      <p className="text-xs text-slate-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-2">Ready for Render</h3>
              <p className="text-sm text-blue-100 mb-4">
                This service is optimized for Render's free and paid tiers. Just connect your repo and set the env vars.
              </p>
              <Button variant="secondary" className="w-full text-blue-600 font-bold" asChild>
                <a href="https://render.com" target="_blank" rel="noreferrer">Deploy Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;