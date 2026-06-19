import { google } from "googleapis";

export interface LeadForSheet {
  fullName: string;
  company?: string | null;
  cnpj?: string | null;
  phone?: string | null;
  email: string;
  taxRegime?: string | null;
  service?: string | null;
  challenge?: string | null;
  message?: string | null;
  createdAt: Date;
}

export async function appendLeadToSheet(lead: LeadForSheet): Promise<void> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!clientId || !clientSecret || !refreshToken || !spreadsheetId) {
    return;
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });

  const sheets = google.sheets({ version: "v4", auth });

  const HEADERS = ["Data", "Nome Completo", "Empresa", "CNPJ", "WhatsApp", "E-mail", "Regime Tributário", "Serviço", "Desafio", "Mensagem"];

  const check = await sheets.spreadsheets.values.get({ spreadsheetId, range: "A1" });
  if (!check.data.values || check.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "A1:J1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [HEADERS] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "A:J",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          lead.createdAt.toISOString(),
          lead.fullName,
          lead.company ?? "",
          lead.cnpj ?? "",
          lead.phone ?? "",
          lead.email,
          lead.taxRegime ?? "",
          lead.service ?? "",
          lead.challenge ?? "",
          lead.message ?? "",
        ],
      ],
    },
  });
}
