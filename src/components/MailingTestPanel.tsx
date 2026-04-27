"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Beaker, AlertTriangle, CheckCircle2, Info, Loader2, ExternalLink } from "lucide-react";

interface MailingTestPanelProps {
  serviceUrl: string;
  apiKey: string;
}

const MailingTestPanel = ({ serviceUrl, apiKey }: MailingTestPanelProps) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<{ message: string; solution: string; link?: string } | null>(null);

  const troubleshootError = (error: any, data?: any) => {
    const msg = data?.error || error?.message || "Unknown connection error";
    
    // Specific Brevo "Not Enabled" Error
    if (msg.toLowerCase().includes("api key not enabled") || msg.toLowerCase().includes("not_enabled")) {
      return {
        message: "Brevo API Key Not Activated",
        solution: "Your Brevo API key is valid but 'Transactional' features are not enabled. Go to Brevo -> SMTP & API -> Settings and ensure Transactional emails are active.",
        link: "https://app.brevo.com/settings/keys/api"
      };
    }

    if (msg.includes("Unauthorized") || msg.includes("Invalid or missing API key")) {
      return {
        message: "Authentication Failed (401)",
        solution: "The 'Service API Key' you entered doesn't match the SERVICE_API_KEY set in your Render environment variables."
      };
    }
    
    if (msg.includes("BREVO_API_KEY is not configured")) {
      return {
        message: "Brevo Config Missing",
        solution: "The BREVO_API_KEY environment variable is missing on Render. Add it to your Web Service settings."
      };
    }

    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      return {
        message: "Service Unreachable",
        solution: "The server is offline or the URL is wrong. If using Render's free tier, it may take 30-60s to 'wake up' after inactivity."
      };
    }

    return {
      message: msg,
      solution: "Check your Render service logs for the full error trace. This usually happens if an environment variable is missing or incorrect."
    };
  };

  const runDiagnostic = async () => {
    if (!apiKey) {
      setStatus('error');
      setErrorDetail({ 
        message: "API Key Missing", 
        solution: "Please enter your Service API Key in the Dispatch Center first." 
      });
      return;
    }

    setStatus('loading');
    setErrorDetail(null);

    try {
      const response = await fetch(`${serviceUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          to: ["gunjarigourav@gmail.com"],
          subject: "🚀 System Diagnostic: qwerty-developers",
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #2563eb;">Diagnostic Successful</h2>
              <p>Your mailing agent is fully operational.</p>
              <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorDetail(troubleshootError(null, data));
      }
    } catch (err) {
      setStatus('error');
      setErrorDetail(troubleshootError(err));
    }
  };

  return (
    <Card className="border-none shadow-lg bg-white overflow-hidden">
      <div className="h-1 bg-blue-500" />
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Beaker className="w-5 h-5 text-blue-500" /> System Diagnostics
        </CardTitle>
        <CardDescription>
          Test delivery to <b>gunjarigourav@gmail.com</b>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostic} 
          disabled={status === 'loading'}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Run Connection Test
        </Button>

        {status === 'success' && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Diagnostic email dispatched successfully.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && errorDetail && (
          <div className="space-y-3">
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle>{errorDetail.message}</AlertTitle>
              <AlertDescription className="mt-2">
                {errorDetail.solution}
                {errorDetail.link && (
                  <a 
                    href={errorDetail.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-blue-600 hover:underline font-medium"
                  >
                    Open Brevo Settings <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MailingTestPanel;