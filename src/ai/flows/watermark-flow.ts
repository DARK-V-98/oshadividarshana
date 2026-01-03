'use server';
/**
 * @fileOverview A flow for adding a watermark to PDF files.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getCurrentUser } from 'genkit/auth';

const WatermarkInputSchema = z.object({
  pdfUrl: z.string().url().describe('The URL of the PDF file to watermark.'),
});

const WatermarkOutputSchema = z.object({
  watermarkedPdf: z.string().describe('The base64 encoded watermarked PDF.'),
});

export async function watermarkPdf(input: z.infer<typeof WatermarkInputSchema>): Promise<z.infer<typeof WatermarkOutputSchema>> {
  return watermarkFlow(input);
}

const watermarkFlow = ai.defineFlow(
  {
    name: 'watermarkFlow',
    inputSchema: WatermarkInputSchema,
    outputSchema: WatermarkOutputSchema,
    auth: (auth, input) => {
        if (!auth) {
            throw new Error('You must be logged in to access this content.');
        }
    },
  },
  async (input) => {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('Authentication failed.');
    }
    const watermarkText = `${user.displayName} (${user.email})`;
    
    // Fetch the PDF from the URL
    const existingPdfBytes = await fetch(input.pdfUrl).then(res => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the pages of the document
    const pages = pdfDoc.getPages();

    // Add watermark to each page
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 2 - 200,
        y: height / 2,
        font: helveticaFont,
        size: 50,
        color: rgb(0.95, 0.1, 0.1),
        opacity: 0.2,
        rotate: { type: 'degrees', angle: -45 },
      });
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Convert to base64
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    return {
      watermarkedPdf: `data:application/pdf;base64,${base64Pdf}`,
    };
  }
);
