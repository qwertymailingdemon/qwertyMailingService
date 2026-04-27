"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Beaker, AlertTriangle, CheckCircle2, Info, KeyRound, Loader2 } from "lucide-react";

interface MailingTestPanelProps {
  serviceUrl: string;
  apiKey: string;
}

const MailingTestPanel = ({ serviceUrl, apiKey }: MailingTestPanelProps) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<{ message: string; solution: string } | null>(null);

  const troubleshootError = (error: any, data?: any) => {
    const msg = data?.error || error.message || "Unknown connection error";
    
    if (msg.includes("Unauthorized") || msg.includes("Invalid or missing API key")) {
      return {
        message: "Authentication Failed (401)",
        solution: "Your 'Service API Key' does not match the SERVICE_API_KEY set in your Render environment variables."
      };
    }
    
    if (msg.includes("BREVO_API_KEY is not configured")) {
      return {
        message: "Brevo Configuration Missing",
        solution: "You need to add BREVO_API_KEY to your Render environment variables. Get it from your Brevo dashboard."
      };
    }

    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      return {
        message: "Service Unreachable",
        solution: "The server is either offline or the Service URL is incorrect. If on Render, wait 30s for it to wake up."
      };
    }

    if (data?.details?.code === "invalid_parameter") {
      return {
        message: "Invalid Sender Identity",
        solution: "The DEFAULT_SENDER_EMAIL in your environment variables is not a verified sender in your Brevo account."
      };
    }

    return {
      message: msg,
      solution: "Check the server logs in the Render dashboard for a detailed stack trace."
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
              <p>Your mailing agent is fully operational and connected to Brevo.</p>
              <ul style="color: #475569;">
                <li><strong>Target:</strong> gunjarigourav@gmail.com</li>
                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Status:</strong> Verified</li>
              </ul>
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
          Run a verified test to <b>gunjarigourav@gmail.com</b>
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
              Diagnostic email dispatched. Check your inbox at gunjarigourav@gmail.com.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && errorDetail && (
          <div className="space-y-3">
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle>{errorDetail.message}</AlertTitle>
              <AlertDescription>
                {errorDetail.solution}
              </AlertDescription>
            </Alert>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
                <Info className="w-3 h-3" /> Pro Tip
              </div>
              <p className="text-xs text-slate-600">
                Ensure your Render environment variables are saved and the service has finished redeploying.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MailingTestPanel;