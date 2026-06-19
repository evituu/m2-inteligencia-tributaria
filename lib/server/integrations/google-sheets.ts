import { google } from "googleapis";

export interface LeadForSheet {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  taxRegime?: string | null;
  message?: string | null;
  source?: string | null;
  createdAt: Date;
}

export async function appendLeadToSheet(lead: LeadForSheet): Promise<void> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    return;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          lead.createdAt.toISOString(),
          lead.fullName,
          lead.email,
          lead.phone ?? "",
          lead.company ?? "",
          lead.taxRegime ?? "",
          lead.message ?? "",
          lead.source ?? "",
        ],
      ],
    },
  });
}
