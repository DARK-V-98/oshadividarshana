
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fetch from 'node-fetch';

// Initialize Firebase Admin SDK
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

function initAdmin() {
  if (!getApps().length) {
    if (!serviceAccount) {
        throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable.');
    }
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
}

async function getUserFromToken(req: NextRequest) {
  initAdmin();
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const idToken = authHeader.split('Bearer ')[1];
  if (!idToken) {
    return null;
  }
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { pdfUrl } = await req.json();
    if (!pdfUrl) {
      return new NextResponse(JSON.stringify({ error: 'Missing PDF URL' }), { status: 400 });
    }

    const watermarkText = `${user.name || 'User'} (${user.email})`;

    // Fetch the original PDF
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

    // Load the PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 2,
        y: height / 2,
        font: helveticaFont,
        size: 50,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.5,
        rotate: { type: 'degrees', angle: -45 },
        xSkew: {type: 'degrees', angle: 0},
        ySkew: {type: 'degrees', angle: 0},
      });
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    
    // Return as base64 data URI
    const base64 = Buffer.from(pdfBytes).toString('base64');
    return NextResponse.json({ watermarkedPdf: `data:application/pdf;base64,${base64}` });

  } catch (error) {
    console.error('Error watermarking PDF:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to watermark PDF' }), { status: 500 });
  }
}

