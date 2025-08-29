import { NextResponse } from 'next/server';

export async function GET() {
  const csvContent = `firstName,lastName,phoneNumber,email,company,tags
John,Doe,+1234567890,john.doe@example.com,Acme Corp,"customer,vip"
Jane,Smith,+1987654321,jane.smith@example.com,Tech Solutions,"customer,newsletter"
Mike,Johnson,+1555123456,mike.j@example.com,Global Inc,"prospect"
Sarah,Williams,+1444567890,sarah.w@example.com,Startup LLC,"customer,enterprise"
David,Brown,+1666789012,david.brown@example.com,Corp Ltd,"vip,enterprise"`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="contacts-import-template.csv"',
    },
  });
}
