import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Shield, Send, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import MailingTestPanel from '@/components/MailingTestPanel';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: 'Hello from qwerty-developers',
    html: '<h1>Welcome!</h1><p>This email was sent via the qwerty-developers mailing service.</p>',
    apiKey: localStorage.getItem('mailing_service_key') || '',
    serviceUrl: localStorage.getItem('mailing_service_url') || 'http://localhost:10000'
  });

  useEffect(() => {
    localStorage.setItem('mailing_service_key', formData.apiKey);
    localStorage.setItem('mailing_service_url', formData.serviceUrl);
  }, [formData.apiKey, formData.serviceUrl]);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Mail className="text-blue-600" /> qwerty-developers Mailer
            </h1>
            <p className="text-slate-500 mt-1">High-performance mailing agent with anti-sleep protection.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-slate-600">Always Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-500" /> Dispatch Center
                </CardTitle>
                <CardDescription>Sender identity is locked to <b>qwerty-developers</b>.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendTest} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceUrl">Service URL</Label>
                      <Input 
                        id="serviceUrl" 
                        placeholder="https://your-app.onrender.com"
                        value={formData.serviceUrl}
                        onChange={(e) => setFormData({...formData, serviceUrl: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">Service API Key (Password)</Label>
                      <Input 
                        id="apiKey" 
                        type="password"
                        placeholder="Enter your secret key"
                        value={formData.apiKey}
                        onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">Recipient</Label>
                    <Input 
                      id="to" 
                      type="email" 
                      required
                      placeholder="recipient@example.com"
                      value={formData.to}
                      onChange={(e) => setFormData({...formData, to: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
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
                      required
                      value={formData.html}
                      onChange={(e) => setFormData({...formData, html: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Dispatching..." : "Send Email"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* New Diagnostic Panel */}
            <MailingTestPanel 
              serviceUrl={formData.serviceUrl} 
              apiKey={formData.apiKey} 
            />

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Service Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Anti-Sleep Active
                  </div>
                  <p className="text-xs text-green-600 mt-1">Pinging every 40s to stay awake on Render.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Identity</h4>
                      <p className="text-xs text-slate-500">qwerty-developers</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Unsubscribe</h4>
                      <p className="text-xs text-slate-500">RFC-compliant headers included.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;