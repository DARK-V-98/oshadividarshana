
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/firebase/admin';
import { UserRecord } from 'firebase-admin/auth';

// This function needs to be defined outside of the POST handler
// if you want to reuse it or keep the handler cleaner.
const getUserFromToken = async (req: NextRequest): Promise<UserRecord | null> => {
    const adminApp = await initAdmin();
    const auth = getAuth(adminApp);
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    
    if (!token) {
        return null;
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const user = await auth.getUser(decodedToken.uid);
        return user;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}


export async function POST(req: NextRequest) {
  const { pdfUrl } = await req.json();

  if (!pdfUrl) {
    return NextResponse.json({ error: 'Missing PDF URL.' }, { status: 400 });
  }

  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {    
    const watermarkText = `${user.displayName || 'No Name'} (${user.email || 'No Email'})`;
    
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: 50,
        y: height / 2 + 300,
        font: helveticaFont,
        size: 50,
        color: rgb(0.95, 0.1, 0.1),
        opacity: 0.1,
        rotate: { type: 'degrees', angle: -45 },
      });
       page.drawText(watermarkText, {
        x: 50,
        y: height / 2,
        font: helveticaFont,
        size: 50,
        color: rgb(0.95, 0.1, 0.1),
        opacity: 0.1,
        rotate: { type: 'degrees', angle: -45 },
      });
       page.drawText(watermarkText, {
        x: width/2,
        y: height / 2 - 300,
        font: helveticaFont,
        size: 50,
        color: rgb(0.95, 0.1, 0.1),
        opacity: 0.1,
        rotate: { type: 'degrees', angle: -45 },
      });
    }

    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    return NextResponse.json({ watermarkedPdf: `data:application/pdf;base64,${base64Pdf}` });

  } catch (error: any) {
    console.error('Watermark API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process PDF.' }, { status: 500 });
  }
}
