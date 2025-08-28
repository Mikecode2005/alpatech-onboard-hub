import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, FileDown, FileText, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { savePDF, openPDF } from '../lib/pdf-service';

interface PDFExportProps {
  generatePDF: () => Promise<jsPDF>;
  filename: string;
  label?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showPreview?: boolean;
}

/**
 * A reusable component for exporting data as PDF
 */
const PDFExport: React.FC<PDFExportProps> = ({
  generatePDF,
  filename,
  label = 'Export PDF',
  variant = 'default',
  size = 'default',
  className = '',
  showPreview = true,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const doc = await generatePDF();
      savePDF(doc, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    setIsGenerating(true);
    try {
      const doc = await generatePDF();
      openPDF(doc);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleExport}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileDown className="mr-2 h-4 w-4" />
            {label}
          </>
        )}
      </Button>
      
      {showPreview && (
        <Button
          variant="outline"
          size={size}
          onClick={handlePreview}
          disabled={isGenerating}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      )}
    </div>
  );
};

export default PDFExport;