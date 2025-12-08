import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"
import nodemailer from "npm:nodemailer@6.9.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    
    // The webhook payload comes inside 'record'
    const record = payload.record
    
    if (!record) {
        throw new Error("No record found in payload")
    }

    const { 
        submission_id, 
        school_name, 
        district, 
        spoc_name, 
        remarks, 
        employee_email_id,
        rm_email_id 
    } = record

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the logged-in user is an RM (has reportees)
    console.log('Checking if user is RM:', employee_email_id)
    const { data: reportees, error: rmCheckError } = await supabase
      .from('emp_record')
      .select('email')
      .eq('reporting_manager_email', employee_email_id)
      .limit(1)

    if (rmCheckError) {
      console.error('Error checking RM status:', rmCheckError)
    }

    const isRM = reportees && reportees.length > 0
    console.log('User is RM:', isRM)

    // Determine CC recipients
    let ccRecipient = null
    if (!isRM && rm_email_id && rm_email_id.trim() !== '') {
      // User is field employee and has an RM - CC the RM
      ccRecipient = rm_email_id
      console.log('CC to RM:', ccRecipient)
    } else {
      console.log('No CC - User is RM or no RM assigned')
    }

    // Configure Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASS'),
      },
    })

    // Email configuration
    const mailOptions: any = {
      from: 'LVT System <' + Deno.env.get('SMTP_USER') + '>',
      to: employee_email_id,
      subject: `Visit Confirmation: ${school_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #6366f1;">Visit Punch Successful</h2>
            <p>Hello,</p>
            <p>Your visit for <strong>${school_name}</strong> has been successfully recorded.</p>

            <hr style="border: 1px solid #eee; margin: 20px 0;">

            <h3>Visit Details:</h3>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 8px;"><strong>Submission ID:</strong> ${submission_id}</li>
                <li style="margin-bottom: 8px;"><strong>School:</strong> ${school_name}</li>
                <li style="margin-bottom: 8px;"><strong>District:</strong> ${district}</li>
                <li style="margin-bottom: 8px;"><strong>SPOC Name:</strong> ${spoc_name}</li>
                <li style="margin-bottom: 8px;"><strong>Remarks:</strong> ${remarks || 'N/A'}</li>
            </ul>

            <p style="font-size: 12px; color: #888; margin-top: 30px;">
                This is an automated message from the LVT System.
            </p>
        </div>
      `,
    }

    // Add CC if applicable
    if (ccRecipient) {
      mailOptions.cc = ccRecipient
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)

    console.log("Email sent: %s", info.messageId)
    console.log("Recipients - TO:", employee_email_id, "CC:", ccRecipient || 'None')

    return new Response(JSON.stringify({ 
      message: "Email sent successfully",
      to: employee_email_id,
      cc: ccRecipient || 'None',
      isRM: isRM
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
